<?php

namespace App\Config;

use MongoDB\Client;
use Exception;

class Database {
    private static $client = null;
    private static $db = null;

    public static function connect() {
        if (self::$client === null) {
            try {
                $uri = $_ENV['MONGODB_URI'] ?? getenv('MONGODB_URI');
                if (!$uri) {
                    throw new Exception("MONGODB_URI is not set in environment variables.");
                }

                // Extract DB name from URI or default to STONA
                $parsedUri = parse_url($uri);
                $dbName = 'STONA';
                if (isset($parsedUri['path']) && strlen($parsedUri['path']) > 1) {
                    $dbName = ltrim($parsedUri['path'], '/');
                }

                self::$client = new Client($uri);
                self::$db = self::$client->$dbName;
                
                // Ping the database
                self::$db->command(['ping' => 1]);
            } catch (Exception $e) {
                // Return a clear error for logging, but exit
                error_log("MongoDB Connection Error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['message' => 'Database connection failed.']);
                exit;
            }
        }
        return self::$db;
    }

    public static function getDb() {
        if (self::$db === null) {
            self::connect();
        }
        return self::$db;
    }
}
