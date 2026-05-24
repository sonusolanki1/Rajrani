<?php

namespace App\Controllers;

use App\Utils\Response;
use App\Utils\ImageManager;
use App\Utils\Request;
use Exception;

class UploadController {
    /**
     * Handles the image upload process
     */
    public function uploadImage() {
        try {
            if (!isset($_FILES['image'])) {
                Response::json(['message' => 'No image file provided in request.'], 400);
            }

            // ImageManager handles validation, MIME checking, and safe saving
            $path = ImageManager::upload($_FILES['image']);
            
            Response::json([
                'message' => 'Image uploaded successfully',
                'url' => $path
            ]);

        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    /**
     * Deletes an image directly via API (usually triggered when removing a draft image)
     */
    public function deleteImage() {
        try {
            $body = Request::getBody();
            $path = $body['path'] ?? '';

            if (empty($path)) {
                Response::json(['message' => 'Path is required'], 400);
            }

            $deleted = ImageManager::delete($path);

            if ($deleted) {
                Response::json(['message' => 'Image permanently deleted from server.']);
            } else {
                Response::json(['message' => 'File not found or could not be deleted.'], 404);
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }
}
