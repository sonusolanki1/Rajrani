# API Documentation

## Auth
- **POST /api/auth/login**
  - Body: `{ email, password }`
  - Returns: `{ email, token }`
  - Note: Compares against `.env` variables `MASTER_ADMIN_EMAIL` and `MASTER_ADMIN_PASSWORD`.

## Categories
- **GET /api/categories**
  - Returns: Array of active categories.
- **POST /api/categories** (Admin)
  - Body: `{ name, image }`
  - Returns: Created category object.
- **PUT /api/categories/:id** (Admin)
  - Body: `{ name, image }`
  - Returns: Updated category object.
- **DELETE /api/categories/:id** (Admin)
  - Returns: `{ message: 'Category removed' }`

## Orders
- **GET /api/orders** (Admin)
  - Returns: Array of all orders sorted by newest first.
- **POST /api/orders**
  - Body: `{ customer, orderItems, totalAmount }`
  - Returns: Created order object.

## Products
- **GET /api/products**
  - Query Params: `isFeatured` (boolean), `category` (ObjectId string)
  - Returns: Array of products.
- **GET /api/products/:id**
  - Returns: Single product object.
- **POST /api/products** (Admin)
  - Body: Product fields.
  - Returns: Created product object.
- **PUT /api/products/:id** (Admin)
  - Body: Product fields to update.
  - Returns: Updated product object.
- **DELETE /api/products/:id** (Admin)
  - Returns: `{ message: 'Product removed' }`

## Settings
- **GET /api/settings**
  - Returns: Global settings object.
- **PUT /api/settings** (Admin)
  - Body: Settings fields to update.
  - Returns: Updated settings object.

## Subscribers
- **GET /api/subscribers** (Admin)
  - Returns: Array of subscribers.
- **POST /api/subscribers**
  - Body: `{ email }`
  - Returns: `{ message: 'Subscribed successfully' }`
- **DELETE /api/subscribers/:id** (Admin)
  - Returns: `{ message: 'Subscriber removed' }`

## Testimonials
- **GET /api/testimonials**
  - Returns: Array of active testimonials.
- **POST /api/testimonials** (Admin)
  - Body: Testimonial fields.
  - Returns: Created testimonial object.
- **PUT /api/testimonials/:id** (Admin)
  - Body: Testimonial fields to update.
  - Returns: Updated testimonial object.
- **DELETE /api/testimonials/:id** (Admin)
  - Returns: `{ message: 'Testimonial removed' }`

## Upload
- **POST /api/upload**
  - Uses `multipart/form-data` with field `image`.
  - Returns: `{ message: 'Image uploaded successfully', url: '...' }`
