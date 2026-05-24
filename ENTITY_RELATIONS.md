# Entity Relations

1. **Product -> Category**
   - Products belong to a Category.
   - Field: `category` (ObjectId referencing the `categories` collection).
   - Relationship: Many-to-One. Many Products can belong to One Category.

2. **Order -> Product**
   - Orders contain multiple OrderItems.
   - Field: `orderItems[].product` (ObjectId referencing the `products` collection).
   - Relationship: One-to-Many via embedded array. One Order can reference Multiple Products.
