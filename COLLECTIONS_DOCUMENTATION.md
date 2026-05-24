# Collections Documentation

## 1. Categories
Stores product categories.
- `name` (String, required, unique)
- `slug` (String, required, unique)
- `image` (String, optional)
- `isActive` (Boolean, default: true)
- `createdAt` (Date)
- `updatedAt` (Date)

## 2. Orders
Stores customer orders.
- `orderId` (String, required, unique)
- `customer` (Object)
  - `name` (String, required)
  - `phone` (String, required)
  - `address` (String, required)
  - `city` (String, required)
  - `pincode` (String, required)
  - `notes` (String, optional)
- `orderItems` (Array of Objects)
  - `name` (String, required)
  - `quantity` (Number, required)
  - `image` (String, required)
  - `price` (Number, required)
  - `product` (ObjectId, ref: 'Product')
- `totalAmount` (Number, required, default: 0.0)
- `status` (String, Enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], default: 'Pending')
- `createdAt` (Date)
- `updatedAt` (Date)

## 3. Products
Stores product information.
- `title` (String, required)
- `slug` (String, required, unique)
- `description` (String, required)
- `price` (Number, required)
- `discountPrice` (Number, optional)
- `images` (Array of Strings, required)
- `category` (ObjectId, ref: 'Category', required)
- `stock` (Number, required, default: 0)
- `tags` (Array of Strings)
- `rating` (Number, default: 0)
- `numReviews` (Number, default: 0)
- `isFeatured` (Boolean, default: false)
- `sizes` (Array of Strings)
- `colors` (Array of Strings)
- `createdAt` (Date)
- `updatedAt` (Date)

## 4. Settings
Stores global site settings.
- `siteName` (String, required, default: 'RAJPUTANA')
- `siteLogo` (String)
- `logoHeight` (String, default: '40px')
- `logoWidth` (String, default: 'auto')
- `contactEmail` (String)
- `contactPhone` (String)
- `address` (String)
- `whatsappNumber` (String)
- `socialLinks` (Object)
  - `instagram` (String)
  - `twitter` (String)
  - `facebook` (String)
  - `youtube` (String)
- `createdAt` (Date)
- `updatedAt` (Date)

## 5. Subscribers
Stores newsletter subscribers.
- `email` (String, required, unique)
- `createdAt` (Date)
- `updatedAt` (Date)

## 6. Testimonials
Stores user testimonials.
- `name` (String, required)
- `role` (String)
- `content` (String, required)
- `image` (String)
- `rating` (Number, default: 5)
- `isActive` (Boolean, default: true)
- `createdAt` (Date)
- `updatedAt` (Date)

## 7. Users
Stores admin/user credentials (currently used mainly for admin via .env, but schema exists).
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- `isAdmin` (Boolean, required, default: false)
- `createdAt` (Date)
- `updatedAt` (Date)
