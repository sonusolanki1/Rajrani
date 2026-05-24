<?php

namespace App\Models;

use App\Config\Database;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

abstract class Model {
    protected static $collectionName = '';

    public static function collection() {
        return Database::getDb()->{static::$collectionName};
    }

    public static function formatDocument($doc) {
        if (!$doc) return null;
        
        $doc = (array) $doc;
        if (isset($doc['_id'])) {
            $doc['_id'] = (string) $doc['_id'];
        }
        
        if (isset($doc['createdAt']) && $doc['createdAt'] instanceof UTCDateTime) {
            $doc['createdAt'] = $doc['createdAt']->toDateTime()->format('c');
        }
        if (isset($doc['updatedAt']) && $doc['updatedAt'] instanceof UTCDateTime) {
            $doc['updatedAt'] = $doc['updatedAt']->toDateTime()->format('c');
        }
        
        return $doc;
    }
    
    public static function formatDocuments($cursor) {
        $docs = [];
        foreach ($cursor as $doc) {
            $docs[] = self::formatDocument($doc);
        }
        return $docs;
    }
}
