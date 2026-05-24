<?php
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;
use App\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$db = Database::getDb();
$p = $db->products->findOne(['images' => ['$regex' => 'image-1779563021488.jpg']]);
if ($p) {
    echo "Found product: " . $p['title'] . "\n";
    echo "Image path in DB: " . ($p['images'][0] ?? 'N/A') . "\n";
} else {
    echo "Product not found.\n";
}
