# PURE GOLD Products — Ceylon Cinnamon E-Commerce Website

> **AI Assistant Context File** — Read this before making any changes to the project.

---

## Project Overview

**PURE GOLD Products** is a premium e-commerce website for authentic Ceylon Cinnamon products sourced directly from Sri Lanka. The brand positions itself as a luxury, heritage-driven cinnamon exporter targeting health-conscious consumers, chefs, Ayurvedic practitioners, and corporate gift buyers worldwide.

### Business Domain
- **Product**: Premium Ceylon Cinnamon (Cinnamomum verum) — quills, powder, tea, essential oils, and gift sets
- **Origin**: Southern Sri Lanka (Galle, Matara, Kurunegala, Kandy, Ratnapura)
- **USP**: Low-coumarin true cinnamon, hand-rolled by skilled artisans, organic-certified options
- **Target Audience**: International buyers — EU, US, and Asian markets

---

## Tech Stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| Framework    | **React 18** (JSX, functional components only) |
| Build Tool   | **Vite 5**                                     |
| Styling      | **Tailwind CSS 3** with custom design tokens   |
| Routing      | **React Router v6** (BrowserRouter)            |
| Animations   | **Framer Motion** (page transitions, UI)       |
| Icons        | **Lucide React**                               |
| Carousel     | **Swiper 11**                                  |
| State        | React Context API + `useReducer`               |
| Persistence  | `localStorage` (cart, wishlist)                 |
| Fonts        | Playfair Display, Cormorant Garamond, Inter    |
| Deployment   | **Firebase Hosting** (planned)                 |
| Backend      | **Node.js + Express** (`/Backend` directory)   |
| Database     | **Firebase Firestore** (NoSQL)                 |
| Auth         | **Custom JWT** (customer + admin tokens)       |
| API Client   | Centralized fetch wrapper (`src/services/api.js`) |

---

## Project Structure

```
Cinnamon-Website/
├── index.html                  # Entry HTML (SEO meta, Google Fonts, Swiper CSS)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite config (port 5173, auto-open, proxy /api → :5000)
├── tailwind.config.js          # Custom colors, fonts, animations, shadows
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
│
├── Backend/                    # ✅ Node.js + Express API server
│   ├── server.js               # Express entry — mounts all routes, CORS, error handlers
│   ├── package.json            # Backend dependencies (express, firebase-admin, bcryptjs, jsonwebtoken)
│   ├── .env                    # Environment variables (JWT secrets, port)
│   ├── config/
│   │   ├── firebase.js         # Firebase Admin SDK initialization
│   │   ├── jwt.js              # JWT token generation & verification (customer + admin)
│   │   └── serviceAccountKey.json # Firebase service account credentials
│   ├── middleware/
│   │   ├── auth.js             # Customer JWT auth middleware (authenticateCustomer, optionalCustomerAuth)
│   │   ├── adminAuth.js        # Admin JWT auth middleware
│   │   ├── errorHandler.js     # Global error handler + 404 handler
│   │   └── validate.js         # Request validation middleware
│   ├── controllers/            # Route handlers for customer-facing APIs
│   │   ├── authController.js   # Login, register, profile
│   │   ├── productController.js # List, get by slug, featured products
│   │   ├── categoryController.js # List categories
│   │   ├── orderController.js  # Create order, get my orders, track
│   │   ├── cartController.js   # Get/sync/clear cart
│   │   ├── wishlistController.js # Get/add/remove wishlist
│   │   ├── reviewController.js # Get/create reviews
│   │   └── contactController.js # Contact form submission
│   ├── controllers/admin/      # Admin-specific CRUD controllers
│   │   ├── authController.js   # Admin login, profile
│   │   ├── dashboardController.js # Dashboard stats
│   │   ├── productController.js # Admin product CRUD + stock adjustment
│   │   ├── categoryController.js # Admin category CRUD
│   │   ├── orderController.js  # Admin order management, status updates
│   │   ├── customerController.js # Customer management
│   │   ├── reviewController.js # Review moderation
│   │   ├── couponController.js # Coupon CRUD
│   │   ├── deliveryController.js # Delivery zone CRUD
│   │   ├── notificationController.js # Notification management
│   │   ├── staffController.js  # Staff/admin user CRUD
│   │   ├── reportController.js # Sales reports
│   │   └── settingsController.js # App settings
│   ├── routes/                 # Express route definitions (/api/...)
│   │   ├── auth.js, products.js, categories.js, orders.js, cart.js, wishlist.js, reviews.js, contact.js
│   │   └── admin/              # /api/admin/... routes
│   │       ├── auth.js, dashboard.js, products.js, categories.js, orders.js, customers.js
│   │       ├── reviews.js, coupons.js, delivery.js, notifications.js, staff.js, reports.js, settings.js
│   ├── seeds/
│   │   └── seed.js             # Firestore seeding script (categories, products, admin user, settings)
│   ├── database/
│   │   └── schema.sql          # Reference SQL schema (documents Firestore collection structure)
│   ├── utils/
│   │   └── apiResponse.js      # Standardized API response helpers (successResponse, errorResponse)
│   └── services/               # Business logic services (planned)
│
├── src/
│   ├── main.jsx                # React DOM entry point
│   ├── App.jsx                 # Root — BrowserRouter, providers, route definitions
│   ├── index.css               # Global CSS + Tailwind directives
│   │
│   ├── services/
│   │   └── api.js              # Centralized fetch wrapper — all API calls (auth, products, admin, etc.)
│   │
│   ├── context/                # React Context providers
│   │   ├── CartContext.jsx     # Cart state (add, remove, quantity, persist + API sync)
│   │   ├── WishlistContext.jsx # Wishlist state (localStorage)
│   │   ├── AuthContext.jsx     # Customer auth (login, register, profile, JWT tokens)
│   │   └── AdminAuthContext.jsx # Admin auth (admin login, role-based permissions)
│   │
│   ├── hooks/
│   │   └── useProducts.js      # Products hook — fetches from API, falls back to local data
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Site navigation (responsive, cart badge, auth state)
│   │   ├── Footer.jsx          # Site footer with links & contact info
│   │   ├── AdminRoute.jsx      # Admin route guard (checks admin JWT)
│   │   ├── Hero.jsx            # Homepage hero section (slideshow)
│   │   ├── MorphShowcase.jsx   # Interactive product showcase
│   │   ├── ProductCard.jsx     # Product listing card (links to /shop/:slug)
│   │   ├── ProductGrid.jsx     # Grid layout for products
│   │   ├── ProductShowcase.jsx # Featured product showcase
│   │   ├── ProductCategories.jsx
│   │   ├── CategoryCard.jsx    # Category display card
│   │   ├── FeaturedProducts.jsx
│   │   ├── CartItem.jsx        # Single cart item row
│   │   ├── QuantitySelector.jsx
│   │   ├── Button.jsx          # Reusable button component
│   │   ├── Modal.jsx           # Generic modal
│   │   ├── Toast.jsx           # Toast notification system (ToastProvider)
│   │   ├── BackToTop.jsx       # Scroll-to-top button
│   │   ├── StarRating.jsx      # Star rating display
│   │   ├── ReviewCard.jsx      # Customer review card
│   │   ├── Testimonials.jsx    # Testimonials section
│   │   ├── CTASection.jsx      # Call-to-action section
│   │   ├── CinnamonJourney.jsx # Journey/process timeline
│   │   ├── CinnamonStory.jsx   # Brand story section
│   │   └── WhyCeylon.jsx       # Why Ceylon cinnamon section
│   │
│   ├── pages/                  # Route-level page components
│   │   ├── Home.jsx            # Landing page (/)
│   │   ├── Shop.jsx            # Product listing (/shop)
│   │   ├── ProductDetails.jsx  # Single product (/shop/:slug)
│   │   ├── Cart.jsx            # Shopping cart (/cart)
│   │   ├── Checkout.jsx        # Checkout form (/checkout) — uses ordersApi
│   │   ├── About.jsx           # About page (/about)
│   │   ├── Contact.jsx         # Contact page (/contact) — uses contactApi
│   │   ├── Login.jsx           # Unified login/register (/login)
│   │   ├── Register.jsx        # Redirects to /login
│   │   ├── Account.jsx         # User account (/account)
│   │   ├── CeylonCinnamon.jsx  # Info page (/ceylon-cinnamon)
│   │   ├── Shipping.jsx        # Shipping info (/shipping)
│   │   ├── Returns.jsx         # Returns policy (/returns)
│   │   ├── FAQ.jsx             # FAQ page (/faq)
│   │   ├── Privacy.jsx         # Privacy policy (/privacy)
│   │   ├── Terms.jsx           # Terms of service (/terms)
│   │   ├── NotFound.jsx        # 404 page
│   │   └── admin/              # Admin panel pages (14 pages)
│   │       ├── AdminLogin.jsx, AdminDashboard.jsx, Products.jsx, Categories.jsx
│   │       ├── Inventory.jsx, Orders.jsx, Customers.jsx, Payments.jsx
│   │       ├── Delivery.jsx, Coupons.jsx, Reviews.jsx, Reports.jsx
│   │       ├── Notifications.jsx, Staff.jsx, Settings.jsx
│   │
│   ├── admin/                  # Admin UI components & mock data
│   │   ├── components/         # AdminLayout, AdminToast, StatsCard, SalesChart, etc.
│   │   └── data/mockData.js    # Fallback mock data for admin dashboard
│   │
│   └── data/                   # Static fallback data (used when backend is offline)
│       ├── products.js         # 8 product entries with full metadata
│       ├── categories.js       # 5 product categories
│       ├── reviews.js          # Customer reviews
│       └── images.js           # Centralized Unsplash image URL map
```

---

## Design System

### Color Palette (Tailwind Custom Tokens)
- **`cinnamon-*`** (50–900): Warm browns — primary brand color (`#A0522D` at 600)
- **`forest-*`** (50–900): Deep greens — accent for nature/organic themes
- **`cream-*`** (50–500): Soft warm whites — backgrounds and cards
- **`gold-*`** (300–600): Metallic gold — badges, premium highlights

### Typography
- **Headings**: `Playfair Display` (serif) — elegant, editorial
- **Body**: `Inter` (sans-serif) — clean, modern readability
- **Accent**: `Cormorant Garamond` (serif) — used for decorative text

### Custom Animations
- `float`, `float-slow`, `float-slower` — gentle vertical oscillation
- `spin-slow` — slow rotation (20s)
- `fade-in`, `slide-up` — entrance animations

### Custom Shadows
- `premium` — warm brand shadow with cinnamon tint
- `card`, `card-hover` — card elevation states
- `glass` — glassmorphism shadow

---

## Routes

### Public Routes
| Path               | Page Component   | Auth Layout? | Backend API |
| ------------------ | ---------------- | ------------ | ----------- |
| `/`                | Home             | No           | —           |
| `/shop`            | Shop             | No           | `GET /api/products` |
| `/shop/:slug`      | ProductDetails   | No           | `GET /api/products/:slug` |
| `/cart`            | Cart             | No           | `GET /api/cart` |
| `/checkout`        | Checkout         | Protected    | `POST /api/orders` |
| `/about`           | About            | No           | —           |
| `/contact`         | Contact          | No           | `POST /api/contact` |
| `/login`           | Login            | Yes (no nav) | `POST /api/auth/login`, `POST /api/auth/register` |
| `/register`        | Register         | Yes (no nav) | Redirects to `/login` |
| `/account`         | Account          | No           | `GET /api/auth/me` |
| `/ceylon-cinnamon` | CeylonCinnamon   | No           | —           |
| `/shipping`        | Shipping         | No           | —           |
| `/returns`         | Returns          | No           | —           |
| `/faq`             | FAQ              | No           | —           |
| `/privacy`         | Privacy          | No           | —           |
| `/terms`           | Terms            | No           | —           |
| `*`                | NotFound         | No           | —           |

### Admin Routes (all wrapped in `<AdminRoute>` — requires admin JWT)
| Path                    | Page Component    | Backend API |
| ----------------------- | ----------------- | ----------- |
| `/admin/login`          | AdminLogin        | `POST /api/admin/auth/login` |
| `/admin` / `/admin/dashboard` | AdminDashboard | `GET /api/admin/dashboard/stats` |
| `/admin/products`       | Products          | `/api/admin/products` CRUD |
| `/admin/categories`     | Categories        | `/api/admin/categories` CRUD |
| `/admin/inventory`      | Inventory         | `/api/admin/products/:id/stock` |
| `/admin/orders`         | Orders            | `/api/admin/orders` CRUD |
| `/admin/customers`      | Customers         | `/api/admin/customers` |
| `/admin/payments`       | Payments          | `/api/admin/orders/:id/payment` |
| `/admin/delivery`       | Delivery          | `/api/admin/delivery` CRUD |
| `/admin/coupons`        | Coupons           | `/api/admin/coupons` CRUD |
| `/admin/reviews`        | Reviews           | `/api/admin/reviews` |
| `/admin/reports`        | Reports           | `/api/admin/reports` |
| `/admin/notifications`  | Notifications     | `/api/admin/notifications` |
| `/admin/staff`          | Staff             | `/api/admin/staff` CRUD |
| `/admin/settings`       | Settings          | `/api/admin/settings` |

> Login, Register, and all Admin pages hide the public Navbar and Footer.

---

## State Management

### Cart (`CartContext.jsx`)
- Uses `useReducer` with actions: `ADD_TO_CART`, `REMOVE_FROM_CART`, `INCREASE_QUANTITY`, `DECREASE_QUANTITY`, `CLEAR_CART`
- Auto-persisted to `localStorage` under key `ceylone_cart`
- Syncs to backend via `cartApi.syncCart()` when user is logged in
- Exposes: `cart`, `cartTotal`, `cartCount`, `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`

### Auth (`AuthContext.jsx`)
- Customer auth via JWT — `ceylone_token` in localStorage
- Validates session on mount via `authApi.getProfile()`
- Exposes: `user`, `token`, `signIn`, `signUp`, `signOut`, `updateProfile`, `loading`
- Falls back to local session when backend is offline

### Admin Auth (`AdminAuthContext.jsx`)
- Admin auth via separate JWT — `ceylone_admin_token` in localStorage
- Role-based permissions: `superadmin`, `product_manager`, `order_manager`, `customer_support`
- Exposes: `adminUser`, `adminLogin`, `adminLogout`, `hasPermission`, `isAuthenticated`

### Wishlist (`WishlistContext.jsx`)
- Simple context for wishlisted product IDs (localStorage only)

### Provider Hierarchy
```
BrowserRouter → AdminAuthProvider → AdminToastProvider → AuthProvider → CartProvider → WishlistProvider → ToastProvider → AppRoutes
```

---

## Conventions & Rules

### Code Style
- **Functional components only** — no class components
- **Named exports** for contexts/hooks, **default exports** for components
- **JSX file extension** (`.jsx`) for all React files
- Component file names use **PascalCase** (e.g., `ProductCard.jsx`)
- Data files use **camelCase** (e.g., `products.js`)

### Component Patterns
- Page-level components go in `src/pages/`
- Reusable UI pieces go in `src/components/`
- All product images are referenced via `IMAGES` object in `src/data/images.js` — **never hardcode image URLs** in components
- Page transitions are wrapped in `<PageWrapper>` using Framer Motion
- Use Tailwind classes — avoid inline styles or separate CSS modules

### Data Layer
- **API-first with local fallback**: The `useProducts()` hook fetches from the backend API first; if the backend is offline, it falls back to static data in `src/data/`
- Product data includes: `id`, `slug`, `name`, `shortDescription`, `description`, `category`, `image`, `images`, `price`, `originalPrice`, `weight`, `origin`, `ingredients`, `processing`, `shipping`, `rating`, `reviewCount`, `stock`, `inStock`, `badge`, `featured`, `tags`
- Admin product edits attempt API calls first, with localStorage override fallback
- The frontend proxy (`vite.config.js`) forwards `/api` requests to `http://localhost:5000`

---

## Deployment — Firebase Hosting

This project is planned to be deployed via **Firebase Hosting**.

### Setup Steps
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
   - Public directory: `dist`
   - Single-page app: **Yes** (rewrite all URLs to `/index.html`)
   - No GitHub Actions auto-deploy (unless desired)
4. Build: `npm run build`
5. Deploy: `firebase deploy --only hosting`

### Firebase Configuration Files (to be created)
- `firebase.json` — hosting config with SPA rewrites
- `.firebaserc` — project alias

### Important Notes
- The Vite build output goes to `dist/` — this is the Firebase public directory
- Since React Router uses client-side routing, Firebase must rewrite all paths to `index.html`
- Add `dist/` and `.firebase/` to `.gitignore`

---

## Roadmap & Planned Features

### 🔲 Payment Gateway — PayHere Integration
- **Gateway**: [PayHere](https://www.payhere.lk/) — Sri Lankan payment gateway
- **Integration Point**: `Checkout.jsx` page
- **Flow**: Cart → Checkout form → PayHere payment → Order confirmation
- **Requirements**:
  - PayHere merchant account & API keys
  - Server-side order validation (will need the `/Backend` to be built)
  - Webhook endpoint for payment notifications
  - Support for LKR and USD currencies
- **PayHere SDK**: Use the PayHere JavaScript SDK for frontend integration
- **Backend Tasks**:
  - Generate payment hash (server-side for security)
  - Verify payment via PayHere notify URL callback
  - Order management (create, update status, track)
- **Environment Variables Needed**:
  - `PAYHERE_MERCHANT_ID`
  - `PAYHERE_MERCHANT_SECRET`
  - `PAYHERE_API_URL` (sandbox vs production)

### ✅ Backend Development (`/Backend`) — COMPLETED
- **Express.js** REST API with modular routes, controllers, and middleware
- **Firebase Firestore** database with seed script for categories, products, admin users, and settings
- **Custom JWT authentication** for both customers and admin users (separate secrets/tokens)
- **Admin panel** with CRUD for products, categories, orders, customers, reviews, coupons, delivery zones, staff, notifications, reports, and settings
- **Offline-tolerant frontend**: All API calls have graceful fallbacks so the site works without the backend running

### 🔲 Future Enhancements
- Email notifications (order confirmation, shipping updates)
- Multi-currency support (LKR, USD, EUR, GBP)
- SEO optimization with dynamic meta tags
- PWA support for mobile
- Analytics integration (Google Analytics / Firebase Analytics)
- Internationalization (i18n) — English, Sinhala, Tamil

---

## Scripts

### Frontend (root directory)
```bash
npm run dev       # Start Vite dev server (port 5173, auto-opens browser)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

### Backend (`/Backend` directory)
```bash
npm run dev       # Start Express server with nodemon (port 5000)
npm start         # Start Express server (production)
npm run seed      # Seed Firestore database with initial data
```

> **Full stack dev**: Run both `npm run dev` in the root AND `npm run dev` in `/Backend` simultaneously.

---

## Image Management

All images are currently sourced from **Unsplash** via the centralized `src/data/images.js` file. To swap images:

1. Update the URL in `IMAGES` object in `src/data/images.js`
2. All components referencing that key will automatically update
3. **Never** hardcode image URLs directly in component files

When transitioning to production, replace Unsplash URLs with:
- Self-hosted images in `public/images/` or
- Firebase Storage / CDN URLs

---

## Environment Variables

### Backend (`/Backend/.env`)
```env
PORT=5000
JWT_SECRET=<your-jwt-secret>
JWT_ADMIN_SECRET=<your-admin-jwt-secret>
JWT_EXPIRES_IN=7d
JWT_ADMIN_EXPIRES_IN=12h
FIREBASE_PROJECT_ID=<your-firebase-project-id>
# Firebase Admin SDK uses serviceAccountKey.json in /Backend/config/
```

### Frontend (`/.env.local` — optional)
```env
VITE_API_URL=            # Defaults to /api (proxied via vite.config.js)
VITE_PAYHERE_MERCHANT_ID=
VITE_PAYHERE_API_URL=
```

> All client-exposed env vars in Vite must be prefixed with `VITE_`.
> Backend env vars are in `/Backend/.env` and should never be committed.
> Firebase Admin credentials are loaded from `/Backend/config/serviceAccountKey.json`.
