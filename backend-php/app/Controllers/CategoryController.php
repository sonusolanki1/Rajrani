<?php

namespace App\Controllers;

use App\Models\Category;
use App\Utils\Request;
use App\Utils\Response;
use Cocur\Slugify\Slugify;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;
use Exception;

class CategoryController {
    public function getCategories() {
        try {
            $cursor = Category::collection()->find(['isActive' => true]);
            $categories = Category::formatDocuments($cursor);
            
            Response::json($categories);
        } catch (Exception $e) {
            Response::error($e->getMessage());
        }
    }

    public function createCategory() {
        try {
            $body = Request::getBody();
            $name = $body['name'] ?? '';
            $image = $body['image'] ?? '';
            
            $slugify = new Slugify();
            $slug = $slugify->slugify($name);

            $now = new UTCDateTime();
            $doc = [
                'name' => $name,
                'slug' => $slug,
                'image' => $image,
                'isActive' => true,
                'createdAt' => $now,
                'updatedAt' => $now
            ];

            $result = Category::collection()->insertOne($doc);
            $doc['_id'] = $result->getInsertedId();
            
            Response::json(Category::formatDocument($doc), 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function updateCategory($id) {
        try {
            $body = Request::getBody();
            $category = Category::collection()->findOne(['_id' => new ObjectId($id)]);
            
            if ($category) {
                $updateDoc = [
                    'updatedAt' => new UTCDateTime()
                ];
                
                if (isset($body['name'])) {
                    $updateDoc['name'] = $body['name'];
                    $slugify = new Slugify();
                    $updateDoc['slug'] = $slugify->slugify($body['name']);
                }
                if (isset($body['image'])) {
                    $updateDoc['image'] = $body['image'];
                }

                Category::collection()->updateOne(
                    ['_id' => new ObjectId($id)],
                    ['$set' => $updateDoc]
                );

                $updatedCategory = Category::collection()->findOne(['_id' => new ObjectId($id)]);
                Response::json(Category::formatDocument($updatedCategory));
            } else {
                Response::json(['message' => 'Category not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function deleteCategory($id) {
        try {
            $category = Category::collection()->findOne(['_id' => new ObjectId($id)]);
            if ($category) {
                // CLEANUP: Delete physical image when category is deleted
                if (isset($category['image']) && !empty($category['image'])) {
                    \App\Utils\ImageManager::delete($category['image']);
                }

                Category::collection()->deleteOne(['_id' => new ObjectId($id)]);
                Response::json(['message' => 'Category and associated image removed']);
            } else {
                Response::json(['message' => 'Category not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
