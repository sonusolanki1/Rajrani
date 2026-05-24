<?php

namespace App\Utils;

class Request {
    public static function getBody() {
        if (isset($_REQUEST['JSON_PAYLOAD'])) {
            return $_REQUEST['JSON_PAYLOAD'];
        }
        return $_POST;
    }

    public static function get($key, $default = null) {
        $body = self::getBody();
        return $body[$key] ?? $_GET[$key] ?? $_REQUEST[$key] ?? $default;
    }
}
