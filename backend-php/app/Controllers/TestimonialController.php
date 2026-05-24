<?php

namespace App\Controllers;

use App\Models\Testimonial;
use App\Utils\Request;
use App\Utils\Response;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;
use Exception;

class TestimonialController {
    public function getTestimonials() {
        try {
            $cursor = Testimonial::collection()->find(['isActive' => true]);
            $testimonials = Testimonial::formatDocuments($cursor);

            Response::json($testimonials);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function createTestimonial() {
        try {
            $body = Request::getBody();
            
            $now = new UTCDateTime();
            $doc = [
                'name' => $body['name'] ?? '',
                'role' => $body['role'] ?? '',
                'content' => $body['content'] ?? '',
                'image' => $body['image'] ?? '',
                'rating' => isset($body['rating']) ? (int)$body['rating'] : 5,
                'isActive' => isset($body['isActive']) ? (bool)$body['isActive'] : true,
                'createdAt' => $now,
                'updatedAt' => $now
            ];

            $result = Testimonial::collection()->insertOne($doc);
            $doc['_id'] = $result->getInsertedId();
            
            Response::json(Testimonial::formatDocument($doc), 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function updateTestimonial($id) {
        try {
            $body = Request::getBody();
            $testimonial = Testimonial::collection()->findOne(['_id' => new ObjectId($id)]);
            
            if ($testimonial) {
                $updateDoc = $body;
                unset($updateDoc['_id']);
                $updateDoc['updatedAt'] = new UTCDateTime();
                
                if (isset($updateDoc['rating'])) $updateDoc['rating'] = (int)$updateDoc['rating'];
                if (isset($updateDoc['isActive'])) $updateDoc['isActive'] = (bool)$updateDoc['isActive'];

                Testimonial::collection()->updateOne(
                    ['_id' => new ObjectId($id)],
                    ['$set' => $updateDoc]
                );

                $updatedTestimonial = Testimonial::collection()->findOne(['_id' => new ObjectId($id)]);
                Response::json(Testimonial::formatDocument($updatedTestimonial));
            } else {
                Response::json(['message' => 'Testimonial not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function deleteTestimonial($id) {
        try {
            $testimonial = Testimonial::collection()->findOne(['_id' => new ObjectId($id)]);
            if ($testimonial) {
                Testimonial::collection()->deleteOne(['_id' => new ObjectId($id)]);
                Response::json(['message' => 'Testimonial removed']);
            } else {
                Response::json(['message' => 'Testimonial not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
