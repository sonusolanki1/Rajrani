<?php

// Serve static files if they exist
if (PHP_SAPI == 'cli-server') {
    $url  = parse_url($_SERVER['REQUEST_METHOD'] == 'POST' ? $_SERVER['REQUEST_URI'] : $_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\Database;
use App\Utils\Response;

// Load env
try {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
} catch (Exception $e) {
    // silently ignore if .env missing
}

// Handle CORS
$allowedOrigins = [
    'https://admin-rajrani12.netlify.app',
    'https://rajrani12.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$sanitizedOrigin = rtrim($origin, '/');

if (empty($origin) || in_array($sanitizedOrigin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . ($origin ?: "*"));
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure JSON request body is in $_POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    if (strpos($contentType, 'application/json') !== false) {
        $content = trim(file_get_contents("php://input"));
        $decoded = json_decode($content, true);
        if (is_array($decoded)) {
            // Use a custom property for JSON input to handle both PUT and POST consistently
            $_REQUEST['JSON_PAYLOAD'] = $decoded;
        }
    }
}

// Router
$router = new \Bramus\Router\Router();

$router->mount('/api', function() use ($router) {
    require __DIR__ . '/../routes/api.php';
});

$router->get('/', function() {
    echo 'Rajputana API is running...';
});

$router->set404(function() {
    Response::error('Not found', 404);
});

try {
    $router->run();
} catch (Exception $e) {
    error_log($e->getMessage());
    Response::error($e->getMessage(), 500);
}
