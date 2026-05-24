<?php

namespace App\Controllers;

use App\Utils\Request;
use App\Utils\Response;
use Firebase\JWT\JWT;

class AuthController {
    public function login() {
        $body = Request::getBody();
        $email = $body['email'] ?? '';
        $password = $body['password'] ?? '';

        $masterEmail = trim(trim($_ENV['MASTER_ADMIN_EMAIL'] ?? getenv('MASTER_ADMIN_EMAIL') ?? '', '"\''));
        $masterPassword = trim(trim($_ENV['MASTER_ADMIN_PASSWORD'] ?? getenv('MASTER_ADMIN_PASSWORD') ?? '', '"\''));

        if ($email === $masterEmail && $password === $masterPassword) {
            $secret = $_ENV['JWT_SECRET'] ?? getenv('JWT_SECRET');
            $payload = [
                'email' => $email,
                'isAdmin' => true,
                'iat' => time(),
                'exp' => time() + (30 * 24 * 60 * 60) // 30 days
            ];
            
            $token = JWT::encode($payload, $secret, 'HS256');
            
            Response::json([
                'email' => $email,
                'token' => $token
            ]);
        } else {
            Response::json(['message' => 'Invalid email or password'], 401);
        }
    }
}
