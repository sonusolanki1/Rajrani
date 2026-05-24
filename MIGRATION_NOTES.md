# Migration Notes: Node.js to PHP

## Overview
The entire Node.js backend has been successfully converted into pure PHP using Composer packages. The core requirements were strictly adhered to:
- No changes to Frontend logic.
- Exact same MongoDB Database & Collections.
- Exact same JSON Response formats.
- Exact same routing structure.

## Key Changes & Implementations

1. **Routing:**
   - Switched from Express.js to `bramus/router`.
   - All `api/*` routes mirror the previous Express configurations precisely.

2. **MongoDB Integration:**
   - Switched from `mongoose` to the native `mongodb/mongodb` driver.
   - Built a custom `Model` abstract class (`app/Models/Model.php`) to automatically format BSON ObjectIds and UTCDateTimes to standard JSON strings/ISO-8601 dates to mimic Mongoose's `.toJSON()` behavior.

3. **File Uploads:**
   - Switched from `multer` to native `$_FILES` handling (`UploadController.php`).
   - Image names are generated precisely like they were before.

4. **Request/Response Handling:**
   - Built custom `Request` and `Response` utility classes.
   - PHP's native handling doesn't automatically populate `$_POST` with `application/json` data on PUT/POST. Added middleware logic in `public/index.php` to parse `php://input` natively and safely merge it.

5. **Security & Authentication:**
   - JWT authentication perfectly mimics the Node.js implementation, validating against `.env` master credentials.

## Actions Required
1. Ensure the PHP server has `ext-mongodb` enabled in `php.ini`.
2. Ensure you have Composer installed.
3. Run `composer install` inside `backend-php/`.
