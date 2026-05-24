<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Utils\Request;
use App\Utils\Response;
use Cocur\Slugify\Slugify;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;
use Exception;

class ProductController {
    public function getProducts() {
        try {
            $isFeatured = Request::get('isFeatured');
            $categoryId = Request::get('category');
            
            $query = [];
            if ($isFeatured !== null) {
                $query['isFeatured'] = $isFeatured === 'true';
            }
            if ($categoryId) {
                if (preg_match('/^[a-f\d]{24}$/i', $categoryId)) {
                    $query['category'] = new ObjectId($categoryId);
                } else {
                    $query['category'] = $categoryId;
                }
            }

            $cursor = Product::collection()->find($query);
            $products = [];
            foreach ($cursor as $doc) {
                $product = Product::formatDocument($doc);
                
                // Normalization for frontend compatibility
                if (!isset($product['images']) || (!is_array($product['images']) && !($product['images'] instanceof \MongoDB\Model\BSONArray))) {
                    $product['images'] = [];
                    if (isset($product['image'])) {
                        $product['images'][] = $product['image'];
                    }
                } elseif ($product['images'] instanceof \MongoDB\Model\BSONArray) {
                    $product['images'] = $product['images']->getArrayCopy();
                }
                if (!isset($product['title']) && isset($product['name'])) {
                    $product['title'] = $product['name'];
                }

                // Populate category (simulating Mongoose populate)
                if (isset($product['category']) && preg_match('/^[a-f\d]{24}$/i', (string)$product['category'])) {
                    $catDoc = Category::collection()->findOne(['_id' => new ObjectId((string)$product['category'])]);
                    if ($catDoc) {
                        $product['category'] = [
                            '_id' => (string) $catDoc['_id'],
                            'name' => $catDoc['name']
                        ];
                    }
                }
                $products[] = $product;
            }
            
            Response::json($products);
        } catch (Exception $e) {
            Response::error($e->getMessage());
        }
    }

    public function getProduct($id) {
        try {
            $doc = Product::collection()->findOne(['_id' => new ObjectId($id)]);
            if ($doc) {
                $product = Product::formatDocument($doc);

                // Normalization for frontend compatibility
                if (!isset($product['images']) || (!is_array($product['images']) && !($product['images'] instanceof \MongoDB\Model\BSONArray))) {
                    $product['images'] = [];
                    if (isset($product['image'])) {
                        $product['images'][] = $product['image'];
                    }
                } elseif ($product['images'] instanceof \MongoDB\Model\BSONArray) {
                    $product['images'] = $product['images']->getArrayCopy();
                }
                if (!isset($product['title']) && isset($product['name'])) {
                    $product['title'] = $product['name'];
                }

                if (isset($product['category']) && preg_match('/^[a-f\d]{24}$/i', (string)$product['category'])) {
                    $catDoc = Category::collection()->findOne(['_id' => new ObjectId((string)$product['category'])]);
                    if ($catDoc) {
                        $product['category'] = [
                            '_id' => (string) $catDoc['_id'],
                            'name' => $catDoc['name']
                        ];
                    }
                }
                Response::json($product);
            } else {
                Response::json(['message' => 'Product not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage());
        }
    }

    public function createProduct() {
        try {
            $body = Request::getBody();
            
            $slugify = new Slugify();
            $slug = $slugify->slugify($body['title'] ?? '');

            $now = new UTCDateTime();
            $doc = [
                'title' => $body['title'] ?? '',
                'slug' => $slug,
                'description' => $body['description'] ?? '',
                'price' => isset($body['price']) ? (float)$body['price'] : 0,
                'discountPrice' => isset($body['discountPrice']) && $body['discountPrice'] !== '' ? (float)$body['discountPrice'] : 0,
                'images' => $body['images'] ?? [],
                'category' => new ObjectId($body['category'] ?? ''),
                'stock' => isset($body['stock']) ? (int)$body['stock'] : 0,
                'tags' => $body['tags'] ?? [],
                'rating' => 0,
                'numReviews' => 0,
                'isFeatured' => $body['isFeatured'] ?? false,
                'sizes' => $body['sizes'] ?? [],
                'colors' => $body['colors'] ?? [],
                'createdAt' => $now,
                'updatedAt' => $now
            ];

            $result = Product::collection()->insertOne($doc);
            $doc['_id'] = $result->getInsertedId();
            
            Response::json(Product::formatDocument($doc), 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function updateProduct($id) {
        try {
            $body = Request::getBody();
            $product = Product::collection()->findOne(['_id' => new ObjectId($id)]);
            
            if ($product) {
                $updateDoc = [
                    'updatedAt' => new UTCDateTime()
                ];
                
                $fields = ['title', 'description', 'price', 'discountPrice', 'stock', 'isFeatured', 'tags', 'sizes', 'colors'];
                foreach ($fields as $field) {
                    if (isset($body[$field])) {
                        if (in_array($field, ['price', 'discountPrice'])) {
                            $updateDoc[$field] = (float)$body[$field];
                        } elseif ($field === 'stock') {
                            $updateDoc[$field] = (int)$body[$field];
                        } else {
                            $updateDoc[$field] = $body[$field];
                        }
                    }
                }

                // Explicitly handle images array
                if (isset($body['images'])) {
                    // Ensure it's stored as an array
                    $updateDoc['images'] = is_array($body['images']) ? $body['images'] : [$body['images']];
                }

                if (isset($body['category'])) {
                    $updateDoc['category'] = new ObjectId($body['category']);
                }

                if (isset($body['title'])) {
                    $slugify = new Slugify();
                    $updateDoc['slug'] = $slugify->slugify($body['title']);
                }

                Product::collection()->updateOne(
                    ['_id' => new ObjectId($id)],
                    ['$set' => $updateDoc]
                );

                $updatedProduct = Product::collection()->findOne(['_id' => new ObjectId($id)]);
                Response::json(Product::formatDocument($updatedProduct));
            } else {
                Response::json(['message' => 'Product not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function deleteProduct($id) {
        try {
            $product = Product::collection()->findOne(['_id' => new ObjectId($id)]);
            if ($product) {
                // CLEANUP: Delete physical images when product is deleted
                if (isset($product['images']) && is_array($product['images'])) {
                    foreach ($product['images'] as $imagePath) {
                        \App\Utils\ImageManager::delete($imagePath);
                    }
                } elseif (isset($product['image'])) {
                    \App\Utils\ImageManager::delete($product['image']);
                }

                Product::collection()->deleteOne(['_id' => new ObjectId($id)]);
                Response::json(['message' => 'Product and associated images removed']);
            } else {
                Response::json(['message' => 'Product not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
