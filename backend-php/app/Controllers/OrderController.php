<?php

namespace App\Controllers;

use App\Models\Order;
use App\Utils\Request;
use App\Utils\Response;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;
use Exception;

class OrderController {
    public function createOrder() {
        try {
            $body = Request::getBody();
            
            if (empty($body['orderItems']) || !is_array($body['orderItems'])) {
                Response::json(['message' => 'No order items'], 400);
            }

            $orderId = $this->generateOrderId();
            while (Order::collection()->findOne(['orderId' => $orderId])) {
                $orderId = $this->generateOrderId();
            }

            // Convert product to ObjectId in orderItems
            $orderItems = $body['orderItems'];
            foreach ($orderItems as &$item) {
                if (isset($item['product'])) {
                    $item['product'] = new ObjectId($item['product']);
                }
            }

            $now = new UTCDateTime();
            $doc = [
                'orderId' => $orderId,
                'customer' => $body['customer'] ?? [],
                'orderItems' => $orderItems,
                'totalAmount' => isset($body['totalAmount']) ? (float)$body['totalAmount'] : 0.0,
                'status' => 'Pending',
                'createdAt' => $now,
                'updatedAt' => $now
            ];

            $result = Order::collection()->insertOne($doc);
            $doc['_id'] = $result->getInsertedId();

            Response::json(Order::formatDocument($doc), 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function getOrders() {
        try {
            $cursor = Order::collection()->find([], ['sort' => ['createdAt' => -1]]);
            $orders = Order::formatDocuments($cursor);
            Response::json($orders);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    private function generateOrderId() {
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $result = 'ORD-';
        for ($i = 0; $i < 6; $i++) {
            $result .= $chars[rand(0, strlen($chars) - 1)];
        }
        return $result;
    }
}
