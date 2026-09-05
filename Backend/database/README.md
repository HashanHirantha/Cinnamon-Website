# Database Architecture & Table Data Specifications
**PURE GOLD Products — Ceylon Cinnamon E-Commerce**

This document outlines the **11 core database tables / Firestore collections**, their data models, required inputs, and setup instructions.

---

## 📋 Database Tables / Collections Summary

| Table / Collection | Purpose | Key Data Inputs |
| :--- | :--- | :--- |
| **`categories`** | Product categories | `id`, `name`, `slug`, `description`, `image`, `productCount` |
| **`products`** | Cinnamon items & inventory | `id`, `name`, `slug`, `category`, `price`, `stock`, `weight`, `origin`, `rating`, `images` |
| **`users`** | Registered customers | `name`, `email`, `passwordHash`, `phone`, `country`, `addresses`, `cart`, `wishlist` |
| **`staff`** | Admin team members | `name`, `username`, `email`, `passwordHash`, `role`, `permissions`, `status` |
| **`orders`** | Customer purchases | `orderId`, `userId`, `customer`, `items`, `subtotal`, `shippingFee`, `total`, `shippingAddress`, `orderStatus` |
| **`reviews`** | Customer feedback & ratings | `productId`, `author`, `rating`, `date`, `title`, `comment`, `status`, `verified` |
| **`coupons`** | Promotional vouchers | `code`, `type`, `value`, `minOrder`, `maxDiscount`, `isActive` |
| **`deliveryZones`** | Shipping rates & regions | `name`, `country`, `baseRate`, `freeShippingThreshold`, `estimatedDays`, `isActive` |
| **`contacts`** | Contact form inquiries | `name`, `email`, `phone`, `subject`, `message`, `status` |
| **`notifications`** | Admin dashboard alerts | `title`, `message`, `type`, `referenceId`, `isRead` |
| **`settings`** | Store configuration | `storeName`, `contactEmail`, `contactPhone`, `currency`, `flatShippingRate`, `freeShippingThreshold` |

---

## 🛠️ Step-by-Step: Enabling Firestore in Firebase

If you see `Error: 5 NOT_FOUND` when running seed or starting the server, your Firebase project needs Cloud Firestore activated:

1. Open the [Firebase Console](https://console.firebase.google.com/project/pure-gold-product/firestore).
2. Click **Create database**.
3. Select your Database Location (e.g. `asia-south1` or `nam5`).
4. Select **Start in test mode** (or **Start in production mode**).
5. Click **Enable**.
6. Once created, run the seed script:
   ```bash
   cd Backend
   npm run seed
   ```

---

## 🗄️ Relational SQL Setup (PostgreSQL / MySQL)

If you are using or migrating to a relational SQL database:
- All `CREATE TABLE`, foreign key constraints, indexes, and column types are located in:
  [`Backend/database/schema.sql`](file:///e:/Cinnamon-Website/Backend/database/schema.sql)
