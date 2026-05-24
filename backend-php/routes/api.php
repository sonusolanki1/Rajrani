<?php

use App\Controllers\AuthController;
use App\Controllers\CategoryController;
use App\Controllers\OrderController;
use App\Controllers\ProductController;
use App\Controllers\SettingsController;
use App\Controllers\SubscriberController;
use App\Controllers\TestimonialController;
use App\Controllers\UploadController;

// Auth Routes
$router->post('/auth/login', AuthController::class . '@login');

// Category Routes
$router->get('/categories', CategoryController::class . '@getCategories');
$router->post('/categories', CategoryController::class . '@createCategory');
$router->put('/categories/(\w+)', CategoryController::class . '@updateCategory');
$router->delete('/categories/(\w+)', CategoryController::class . '@deleteCategory');

// Product Routes
$router->get('/products', ProductController::class . '@getProducts');
$router->get('/products/(\w+)', ProductController::class . '@getProduct');
$router->post('/products', ProductController::class . '@createProduct');
$router->put('/products/(\w+)', ProductController::class . '@updateProduct');
$router->delete('/products/(\w+)', ProductController::class . '@deleteProduct');

// Order Routes
$router->get('/orders', OrderController::class . '@getOrders');
$router->post('/orders', OrderController::class . '@createOrder');

// Upload Routes
$router->post('/upload', UploadController::class . '@uploadImage');
$router->delete('/upload', UploadController::class . '@deleteImage');

// Settings Routes
$router->get('/settings', SettingsController::class . '@getSettings');
$router->put('/settings', SettingsController::class . '@updateSettings');

// Testimonial Routes
$router->get('/testimonials', TestimonialController::class . '@getTestimonials');
$router->post('/testimonials', TestimonialController::class . '@createTestimonial');
$router->put('/testimonials/(\w+)', TestimonialController::class . '@updateTestimonial');
$router->delete('/testimonials/(\w+)', TestimonialController::class . '@deleteTestimonial');

// Subscriber Routes
$router->get('/subscribers', SubscriberController::class . '@getSubscribers');
$router->post('/subscribers', SubscriberController::class . '@addSubscriber');
$router->delete('/subscribers/(\w+)', SubscriberController::class . '@deleteSubscriber');
