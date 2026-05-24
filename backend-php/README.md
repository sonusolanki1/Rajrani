# Rajputana PHP Backend

This is the pure PHP backend migration for the Rajputana application, replacing the previous Node.js/Express backend while strictly maintaining API compatibility and database structure.

## Tech Stack
- **PHP 8.3+**
- **MongoDB** (via `mongodb/mongodb` driver)
- **Bramus Router** (for lightweight, efficient routing)
- **vlucas/phpdotenv** (for `.env` file management)
- **firebase/php-jwt** (for JWT authentication)

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd backend-php
   composer install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and configure your credentials.
   ```bash
   cp .env.example .env
   ```
   Ensure `MONGODB_URI` points to your existing MongoDB instance.

3. **Start the Development Server:**
   You can start the PHP built-in server from the `public` directory.
   ```bash
   cd public
   php -S localhost:5000 index.php
   ```

4. **Production Deployment:**
   Deploy using Apache or Nginx. Point the document root to the `public/` directory and ensure URL rewriting routes all requests to `public/index.php`.

## Directory Structure
- `app/`: Core application logic.
  - `Controllers/`: Route handlers.
  - `Models/`: Database interaction layer.
  - `Utils/`: Helpers like Response formatter and Request parser.
  - `Config/`: Database and environment configuration.
- `public/`: Publicly accessible folder, contains `index.php` entry point.
- `routes/`: API route definitions.
- `uploads/`: Directory for uploaded images.
