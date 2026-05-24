<?php

namespace App\Controllers;

use App\Models\Settings;
use App\Utils\Request;
use App\Utils\Response;
use MongoDB\BSON\UTCDateTime;
use Exception;

class SettingsController {
    public function getSettings() {
        try {
            $settings = Settings::collection()->findOne();
            if (!$settings) {
                $now = new UTCDateTime();
                $doc = [
                    'siteName' => 'RAJPUTANA',
                    'siteLogo' => '',
                    'logoHeight' => '40px',
                    'logoWidth' => 'auto',
                    'contactEmail' => '',
                    'contactPhone' => '',
                    'address' => '',
                    'whatsappNumber' => '',
                    'socialLinks' => [
                        'instagram' => '',
                        'twitter' => '',
                        'facebook' => '',
                        'youtube' => ''
                    ],
                    'createdAt' => $now,
                    'updatedAt' => $now
                ];
                $result = Settings::collection()->insertOne($doc);
                $doc['_id'] = $result->getInsertedId();
                $settings = $doc;
            }

            // Normalization for frontend compatibility (ensuring no nulls for controlled inputs)
            $settings = (array)$settings;
            $fields = ['siteName', 'siteLogo', 'logoHeight', 'logoWidth', 'contactEmail', 'contactPhone', 'address', 'whatsappNumber'];
            foreach ($fields as $field) {
                if (!isset($settings[$field]) || $settings[$field] === null) {
                    $settings[$field] = '';
                }
            }
            if (!isset($settings['socialLinks']) || !is_array($settings['socialLinks'])) {
                $settings['socialLinks'] = [
                    'instagram' => '',
                    'twitter' => '',
                    'facebook' => '',
                    'youtube' => ''
                ];
            } else {
                $platforms = ['instagram', 'twitter', 'facebook', 'youtube'];
                foreach ($platforms as $platform) {
                    if (!isset($settings['socialLinks'][$platform]) || $settings['socialLinks'][$platform] === null) {
                        $settings['socialLinks'][$platform] = '';
                    }
                }
            }

            Response::json(Settings::formatDocument($settings));
        } catch (Exception $e) {
            Response::error($e->getMessage(), 500);
        }
    }

    public function updateSettings() {
        try {
            $body = Request::getBody();
            $settings = Settings::collection()->findOne();
            
            $now = new UTCDateTime();
            if (!$settings) {
                $body['createdAt'] = $now;
                $body['updatedAt'] = $now;
                if (!isset($body['siteName'])) $body['siteName'] = 'RAJPUTANA';
                if (!isset($body['logoHeight'])) $body['logoHeight'] = '40px';
                if (!isset($body['logoWidth'])) $body['logoWidth'] = 'auto';

                $result = Settings::collection()->insertOne($body);
                $body['_id'] = $result->getInsertedId();
                Response::json(Settings::formatDocument($body));
            } else {
                $updateDoc = $body;
                unset($updateDoc['_id']);
                $updateDoc['updatedAt'] = $now;

                Settings::collection()->updateOne(
                    ['_id' => $settings['_id']],
                    ['$set' => $updateDoc]
                );

                $updatedSettings = Settings::collection()->findOne(['_id' => $settings['_id']]);
                Response::json(Settings::formatDocument($updatedSettings));
            }
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }
}
