<?php

namespace App\Utils;

use Exception;

class ImageManager {
    /**
     * Resolves the absolute path to the uploads directory safely.
     */
    private static function getUploadsDir() {
        // Using __DIR__ to navigate out of app/Utils to root/uploads
        $dir = __DIR__ . '/../../uploads/';
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        return $dir;
    }

    /**
     * Secures, validates, and uploads an image.
     * 
     * @param array $file The $_FILES['image'] array
     * @return string The database-ready relative path (e.g., '/uploads/image-123.jpg')
     * @throws Exception If upload or validation fails
     */
    public static function upload($file) {
        if (!isset($file['error']) || is_array($file['error'])) {
            throw new Exception('Invalid upload parameters.');
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK: break;
            case UPLOAD_ERR_NO_FILE: throw new Exception('No file was sent.');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE: throw new Exception('Exceeded filesize limit.');
            default: throw new Exception('Unknown upload error.');
        }

        // 1. Validate File Size (Max 10MB)
        if ($file['size'] > 10485760) {
            throw new Exception('File is too large. Max 10MB allowed.');
        }

        // 2. Validate MIME type securely using finfo
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        
        $allowedMimes = [
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp'
        ];

        $ext = array_search($mime, $allowedMimes, true);
        if ($ext === false) {
            throw new Exception('Invalid file format. Only JPG, PNG, and WEBP are permitted.');
        }

        // 3. Generate unique, collision-proof filename
        // Format: image-1710000000000-a1b2c3d4.jpg
        $filename = sprintf('image-%s-%s.%s',
            (int)(microtime(true) * 1000),
            bin2hex(random_bytes(4)),
            $ext
        );

        $filepath = self::getUploadsDir() . $filename;

        // 4. Move the file securely
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            throw new Exception('Failed to save the uploaded file to disk.');
        }

        // 5. Return path relative to the domain
        return '/uploads/' . $filename;
    }

    /**
     * Safely deletes an image from the server physical storage.
     * 
     * @param string $path The path stored in DB (e.g., '/uploads/image-xxx.jpg')
     * @return bool True if deleted, False if failed or not found
     */
    public static function delete($path) {
        if (empty($path)) return false;

        // Security: Extract just the filename to prevent directory traversal attacks (e.g. ../../)
        $filename = basename($path);
        
        // Ensure it's not empty and has an extension
        if (empty($filename) || strpos($filename, '.') === false) return false;

        $filepath = self::getUploadsDir() . $filename;

        if (file_exists($filepath)) {
            return unlink($filepath);
        }

        return false;
    }
}
