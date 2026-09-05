/**
 * Database Schema Definitions & Data Specifications
 * PURE GOLD Products - Ceylon Cinnamon E-Commerce
 * 
 * Defines schema specifications, field types, constraints, and valid input shapes
 * for both Firestore collections (NoSQL document tables) and relational databases.
 */

export const SCHEMAS = {
  /**
   * 1. CATEGORIES TABLE / COLLECTION
   * Primary categorization for products (quills, powder, tea, oils, gifts)
   */
  categories: {
    tableName: 'categories',
    description: 'Product categories and classifications',
    fields: {
      id: { type: 'string', required: true, example: 'quills', description: 'Unique category identifier / slug' },
      name: { type: 'string', required: true, example: 'Cinnamon Quills', description: 'Display name' },
      slug: { type: 'string', required: true, example: 'quills', description: 'URL-friendly slug' },
      description: { type: 'string', required: false, example: 'Premium whole cinnamon quills, hand-rolled by skilled artisans' },
      image: { type: 'string (url)', required: false, example: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10' },
      productCount: { type: 'number', required: false, default: 0, example: 3 },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 2. PRODUCTS TABLE / COLLECTION
   * Ceylon cinnamon inventory items with pricing, attributes, and stock
   */
  products: {
    tableName: 'products',
    description: 'Catalog items, inventory, specifications and pricing',
    fields: {
      id: { type: 'string', required: true, example: 'ceylon-cinnamon-quills-premium', description: 'Product unique slug/id' },
      slug: { type: 'string', required: true, example: 'ceylon-cinnamon-quills-premium' },
      name: { type: 'string', required: true, example: 'Ceylon Cinnamon Quills — Premium Grade' },
      shortDescription: { type: 'string', required: true, example: 'Hand-rolled True Ceylon quills, the gold standard' },
      description: { type: 'string', required: true, example: 'Our Premium Grade Ceylon Cinnamon Quills...' },
      category: { type: 'string (foreign key -> categories.id)', required: true, example: 'quills' },
      image: { type: 'string (url)', required: true, example: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10' },
      images: { type: 'array of string (urls)', required: false, example: ['https://images.unsplash.com/...'] },
      price: { type: 'number', required: true, min: 0, example: 18.99 },
      originalPrice: { type: 'number | null', required: false, example: 24.99 },
      weight: { type: 'string', required: true, example: '100g' },
      origin: { type: 'string', required: true, example: 'Galle, Sri Lanka' },
      ingredients: { type: 'string', required: true, example: '100% Ceylon Cinnamon (Cinnamomum verum)' },
      processing: { type: 'string', required: true, example: 'Sun-dried, hand-rolled' },
      shipping: { type: 'string', required: true, example: 'Ships within 1-2 business days.' },
      rating: { type: 'number', required: false, min: 0, max: 5, default: 5.0, example: 4.9 },
      reviewCount: { type: 'number', required: false, default: 0, example: 142 },
      stock: { type: 'number', required: true, min: 0, default: 0, example: 85 },
      inStock: { type: 'boolean', required: true, default: true, example: true },
      badge: { type: 'string | null', required: false, example: 'Best Seller' },
      featured: { type: 'boolean', required: false, default: false, example: true },
      tags: { type: 'array of string', required: false, example: ['quills', 'premium', 'authentic'] },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 3. USERS TABLE / COLLECTION
   * Registered customer accounts with authentication and shopping history
   */
  users: {
    tableName: 'users',
    description: 'Registered customer accounts, addresses, and saved carts',
    fields: {
      id: { type: 'string (UUID / Auth UID)', required: true, example: 'usr-1001' },
      name: { type: 'string', required: true, example: 'Kasun Rathnayake' },
      email: { type: 'string (email)', required: true, unique: true, example: 'kasun@example.com' },
      passwordHash: { type: 'string (bcrypt)', required: true, example: '$2a$10$...' },
      phone: { type: 'string', required: false, example: '+94 77 123 4567' },
      country: { type: 'string', required: false, default: 'Sri Lanka', example: 'Sri Lanka' },
      addresses: {
        type: 'array of objects',
        required: false,
        example: [
          {
            id: 'addr-1',
            firstName: 'Kasun',
            lastName: 'Rathnayake',
            address: '45 Lotus Road',
            apartment: 'Apt 3B',
            city: 'Colombo',
            state: 'Western Province',
            postalCode: '00100',
            country: 'Sri Lanka',
            phone: '+94 77 123 4567',
            isDefault: true,
          },
        ],
      },
      cart: {
        type: 'array of objects',
        required: false,
        default: [],
        example: [
          {
            id: 'ceylon-cinnamon-quills-premium',
            name: 'Ceylon Cinnamon Quills — Premium Grade',
            price: 18.99,
            quantity: 2,
            image: 'https://images.unsplash.com/...',
            slug: 'ceylon-cinnamon-quills-premium',
            weight: '100g',
          },
        ],
      },
      wishlist: { type: 'array of string (product IDs)', required: false, default: [], example: ['ceylon-cinnamon-quills-premium'] },
      role: { type: 'string (enum)', enum: ['customer'], default: 'customer' },
      status: { type: 'string (enum)', enum: ['active', 'inactive', 'blocked'], default: 'active' },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 4. ORDERS TABLE / COLLECTION
   * Customer purchases, order items, status tracking, and fulfillment
   */
  orders: {
    tableName: 'orders',
    description: 'Placed orders, items purchased, totals, and shipping details',
    fields: {
      id: { type: 'string', required: true, example: 'ORD-2025-1001' },
      orderId: { type: 'string', required: true, unique: true, example: 'ORD-2025-1001' },
      userId: { type: 'string | null (foreign key -> users.id)', required: false, example: 'usr-1001' },
      customer: {
        type: 'object',
        required: true,
        properties: {
          name: { type: 'string', required: true, example: 'Kasun Rathnayake' },
          email: { type: 'string (email)', required: true, example: 'kasun@example.com' },
          phone: { type: 'string', required: false, example: '+94 77 123 4567' },
        },
      },
      items: {
        type: 'array of objects',
        required: true,
        properties: {
          productId: { type: 'string', required: true, example: 'ceylon-cinnamon-quills-premium' },
          name: { type: 'string', required: true, example: 'Ceylon Cinnamon Quills — Premium Grade' },
          price: { type: 'number', required: true, example: 18.99 },
          quantity: { type: 'number', required: true, min: 1, example: 2 },
          image: { type: 'string', required: false },
          weight: { type: 'string', required: false, example: '100g' },
          total: { type: 'number', required: true, example: 37.98 },
        },
      },
      subtotal: { type: 'number', required: true, example: 37.98 },
      discount: { type: 'number', required: false, default: 0, example: 3.80 },
      appliedCoupon: { type: 'string | null', required: false, example: 'WELCOME10' },
      shippingFee: { type: 'number', required: true, default: 0, example: 5.00 },
      total: { type: 'number', required: true, example: 39.18 },
      shippingAddress: {
        type: 'object',
        required: true,
        properties: {
          firstName: { type: 'string', required: true },
          lastName: { type: 'string', required: true },
          address: { type: 'string', required: true },
          apartment: { type: 'string', required: false },
          city: { type: 'string', required: true },
          state: { type: 'string', required: false },
          postalCode: { type: 'string', required: false },
          country: { type: 'string', required: true, example: 'Sri Lanka' },
          phone: { type: 'string', required: false },
          email: { type: 'string', required: false },
        },
      },
      paymentMethod: { type: 'string (enum)', enum: ['cod', 'bank_transfer', 'payhere', 'card'], default: 'cod' },
      paymentStatus: { type: 'string (enum)', enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      orderStatus: { type: 'string (enum)', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' },
      trackingNumber: { type: 'string', required: false, example: 'TRK-582104' },
      notes: { type: 'string', required: false, example: 'Please deliver after 2 PM' },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 5. STAFF TABLE / COLLECTION
   * Administrative team accounts with granular role-based permissions
   */
  staff: {
    tableName: 'staff',
    description: 'Admin team members, roles, and permissions',
    fields: {
      id: { type: 'string', required: true, example: 'staff-admin-01' },
      name: { type: 'string', required: true, example: 'Hashan Hirantha (Admin)' },
      username: { type: 'string', required: true, unique: true, example: 'admin' },
      email: { type: 'string (email)', required: true, unique: true, example: 'admin@ceyloncinnamon.com' },
      passwordHash: { type: 'string (bcrypt)', required: true },
      role: {
        type: 'string (enum)',
        enum: ['superadmin', 'product_manager', 'order_manager', 'customer_support'],
        example: 'superadmin',
      },
      permissions: {
        type: 'array of string',
        example: ['all'], // or ['products', 'categories', 'orders', 'customers', 'reviews', 'inventory', 'delivery', 'coupons']
      },
      status: { type: 'string (enum)', enum: ['active', 'inactive'], default: 'active' },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 6. REVIEWS TABLE / COLLECTION
   * Customer ratings, testimonials, and verified purchase reviews
   */
  reviews: {
    tableName: 'reviews',
    description: 'Product ratings and customer feedback',
    fields: {
      id: { type: 'string', required: true, example: 'rev-01' },
      productId: { type: 'string (foreign key -> products.id)', required: true, example: 'ceylon-cinnamon-quills-premium' },
      productName: { type: 'string', required: true, example: 'Ceylon Cinnamon Quills — Premium Grade' },
      userId: { type: 'string | null (foreign key -> users.id)', required: false, example: 'usr-1001' },
      author: { type: 'string', required: true, example: 'Sophie Laurent' },
      location: { type: 'string', required: false, example: 'France 🇫🇷' },
      rating: { type: 'number', required: true, min: 1, max: 5, example: 5 },
      date: { type: 'string (YYYY-MM-DD)', required: true, example: '2024-05-12' },
      title: { type: 'string', required: true, example: 'Extraordinary quality' },
      comment: { type: 'string', required: true, example: 'The aroma is intoxicating and quills are perfectly rolled.' },
      status: { type: 'string (enum)', enum: ['pending', 'approved', 'rejected'], default: 'approved' },
      verified: { type: 'boolean', required: false, default: true, example: true },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 7. COUPONS TABLE / COLLECTION
   * Promotional voucher codes and discount rules
   */
  coupons: {
    tableName: 'coupons',
    description: 'Discount codes and promotional rules',
    fields: {
      id: { type: 'string', required: true, example: 'coup-01' },
      code: { type: 'string', required: true, unique: true, example: 'WELCOME10' },
      type: { type: 'string (enum)', enum: ['percentage', 'fixed'], example: 'percentage' },
      value: { type: 'number', required: true, min: 0, example: 10 },
      minOrder: { type: 'number', required: false, default: 0, example: 30 },
      maxDiscount: { type: 'number | null', required: false, example: 20 },
      isActive: { type: 'boolean', required: true, default: true, example: true },
      expiryDate: { type: 'string (ISO date) | null', required: false, example: '2026-12-31' },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 8. DELIVERY ZONES TABLE / COLLECTION
   * Shipping rates, regions, and delivery timeframes
   */
  deliveryZones: {
    tableName: 'deliveryZones',
    description: 'Regional delivery shipping fees and free shipping rules',
    fields: {
      id: { type: 'string', required: true, example: 'zone-01' },
      name: { type: 'string', required: true, example: 'Domestic (Sri Lanka)' },
      country: { type: 'string', required: true, example: 'Sri Lanka' },
      baseRate: { type: 'number', required: true, min: 0, example: 2.50 },
      freeShippingThreshold: { type: 'number | null', required: false, example: 30.00 },
      estimatedDays: { type: 'string', required: true, example: '1-3 business days' },
      isActive: { type: 'boolean', required: true, default: true, example: true },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 9. CONTACTS TABLE / COLLECTION
   * User contact form inquiries and support submissions
   */
  contacts: {
    tableName: 'contacts',
    description: 'Customer contact messages and inquiries',
    fields: {
      id: { type: 'string', required: true, example: 'msg-101' },
      name: { type: 'string', required: true, example: 'Michael Brown' },
      email: { type: 'string (email)', required: true, example: 'michael@culinaryhub.com' },
      phone: { type: 'string', required: false, example: '+1 415 555 2671' },
      subject: { type: 'string', required: false, default: 'Website Inquiry', example: 'Bulk Export Order Request' },
      message: { type: 'string', required: true, example: 'We are looking to source 50kg of premium Ceylon cinnamon quills...' },
      status: { type: 'string (enum)', enum: ['new', 'replied', 'archived'], default: 'new' },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 10. NOTIFICATIONS TABLE / COLLECTION
   * Admin dashboard alerts (order placements, low stock, reviews, customers)
   */
  notifications: {
    tableName: 'notifications',
    description: 'Real-time admin notifications and activity alerts',
    fields: {
      id: { type: 'string', required: true, example: 'notif-101' },
      title: { type: 'string', required: true, example: 'New Order Received' },
      message: { type: 'string', required: true, example: 'Order #ORD-2025-1001 placed by Kasun Rathnayake for $39.18' },
      type: { type: 'string (enum)', enum: ['order', 'user', 'review', 'stock', 'contact', 'system'], default: 'order' },
      referenceId: { type: 'string | null', required: false, example: 'ORD-2025-1001' },
      isRead: { type: 'boolean', required: true, default: false, example: false },
      createdAt: { type: 'string (ISO date)', required: true },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },

  /**
   * 11. SETTINGS TABLE / COLLECTION (Document: store_config)
   * Global store preferences, currency, branding, and contact details
   */
  settings: {
    tableName: 'settings',
    docId: 'store_config',
    description: 'Global business and storefront configuration',
    fields: {
      storeName: { type: 'string', required: true, example: 'PURE GOLD Products' },
      storeTagline: { type: 'string', required: true, example: 'Ceylon Cinnamon — Pure Gold from Sri Lanka' },
      contactEmail: { type: 'string (email)', required: true, example: 'info@puregoldcinnamon.com' },
      contactPhone: { type: 'string', required: true, example: '+94 77 123 4567' },
      address: { type: 'string', required: true, example: 'Mirissa / Galle, Southern Province, Sri Lanka' },
      currency: { type: 'string', required: true, default: 'USD', example: 'USD' },
      currencySymbol: { type: 'string', required: true, default: '$', example: '$' },
      freeShippingThreshold: { type: 'number', required: true, default: 50, example: 50 },
      flatShippingRate: { type: 'number', required: true, default: 5, example: 5 },
      maintenanceMode: { type: 'boolean', required: true, default: false, example: false },
      updatedAt: { type: 'string (ISO date)', required: true },
    },
  },
};

export default SCHEMAS;
