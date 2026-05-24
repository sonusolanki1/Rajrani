<?php
$json = file_get_contents("http://localhost:5000/api/products");
$data = json_decode($json, true);
foreach ($data as $p) {
    if ($p['_id'] == '6a11b4fbaa825810e0712bac') {
        echo "Product ID: " . $p['_id'] . "\n";
        echo "Image: " . $p['image'] . "\n";
        echo "Images[0]: " . ($p['images'][0] ?? 'N/A') . "\n";
    }
}
