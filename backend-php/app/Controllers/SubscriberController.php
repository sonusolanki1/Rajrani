<?php

namespace App\Controllers;

use App\Models\Subscriber;
use App\Utils\Request;
use App\Utils\Response;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;
use Exception;

class SubscriberController {
    public function addSubscriber() {
        try {
            $body = Request::getBody();
            $email = isset($body['email']) ? strtolower(trim($body['email'])) : '';

            if (empty($email)) {
                Response::json(['message' => 'Email is required'], 400);
            }

            $exists = Subscriber::collection()->findOne(['email' => $email]);
            if ($exists) {
                Response::json(['message' => 'Email already subscribed'], 400);
            }

            $now = new UTCDateTime();
            $doc = [
                'email' => $email,
                'createdAt' => $now,
                'updatedAt' => $now
            ];

            Subscriber::collection()->insertOne($doc);
            Response::json(['message' => 'Subscribed successfully'], 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getSubscribers() {
        try {
            $cursor = Subscriber::collection()->find([], ['sort' => ['createdAt' => -1]]);
            $subscribers = Subscriber::formatDocuments($cursor);
            Response::json($subscribers);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function deleteSubscriber($id) {
        try {
            $subscriber = Subscriber::collection()->findOne(['_id' => new ObjectId($id)]);
            if ($subscriber) {
                Subscriber::collection()->deleteOne(['_id' => new ObjectId($id)]);
                Response::json(['message' => 'Subscriber removed']);
            } else {
                Response::json(['message' => 'Subscriber not found'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
