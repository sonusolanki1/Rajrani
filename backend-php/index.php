<?php

// 1. PHP Built-in Server Support (Localhost testing)
if (PHP_SAPI == 'cli-server') {
    $url  = parse_url($_SERVER['REQUEST_URI']);
    
    // Serve files from uploads directory
    if (strpos($url['path'], '/uploads/') === 0) {
        $filename = basename($url['path']);
        $file = __DIR__ . '/uploads/' . $filename;
        
        if (is_file($file)) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
                header('Content-Type: image/' . ($ext == 'jpg' ? 'jpeg' : $ext));
                header('Access-Control-Allow-Origin: *'); // Essential for cropper
                readfile($file);
                exit;
            }
        } else {
            // File not found in uploads
            http_response_code(404);
            echo "Image not found on local server: " . $file;
            exit;
        }
    }
}

// 2. URL Sanitization
$requestUri = $_SERVER['REQUEST_URI'];
if (strpos($requestUri, '//') !== false) {
    $_SERVER['REQUEST_URI'] = preg_replace('#/+#', '/', $requestUri);
}

// 3. Robust CORS Middleware
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$sanitizedOrigin = rtrim($origin, '/');

// Allow specific origins or accept any for development if strictly needed
$allowedOrigins = [
    'https://rajrani.online',
    'https://www.rajrani.online',
    'https://admin-rajrani12.netlify.app',
    'https://rajrani12.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5000'
];

if (empty($origin) || in_array($sanitizedOrigin, $allowedOrigins)) {
    // If empty origin (like Postman), we return * just in case, or default to the request host
    $allowOrigin = $origin ?: '*';
    header("Access-Control-Allow-Origin: $allowOrigin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
    header("Access-Control-Max-Age: 86400"); // Cache preflight requests for 1 day
}

// Handle Preflight OPTIONS request immediately and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // 204 No Content is standard for OPTIONS
    exit();
}

// 4. Bootstrap Application
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Utils\Response;

try {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
} catch (Exception $e) {}

// 5. JSON Body Parser Middleware
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    if (strpos($contentType, 'application/json') !== false) {
        $content = trim(file_get_contents("php://input"));
        $decoded = json_decode($content, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $_REQUEST['JSON_PAYLOAD'] = $decoded;
        }
    }
}

// 6. Database Connection check before routing (Prevents 500 downstream)
try {
    \App\Config\Database::connect();
} catch (Exception $e) {
    Response::error("Database Connection Failed: " . $e->getMessage(), 500);
}

// 7. Routing
$router = new \Bramus\Router\Router();

$router->mount('/api', function() use ($router) {
    require __DIR__ . '/routes/api.php';
});

$router->get('/', function() {
    Response::json(['status' => 'active', 'message' => 'API is running successfully', 'env' => $_ENV['NODE_ENV'] ?? 'development']);
});

$router->set404(function() {
    Response::error('API Route Not found', 404);
});

try {
    $router->run();
} catch (Exception $e) {
    error_log($e->getMessage());
    Response::error("Internal Server Error: " . $e->getMessage(), 500);
}
