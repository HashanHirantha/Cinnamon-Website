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
| Backend      | `/Backend` directory (currently empty, planned) |

---

## Project Structure

```
Cinnamon-Website/
├── index.html                  # Entry HTML (SEO meta, Google Fonts, Swiper CSS)
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite config (port 5173, auto-open)
├── tailwind.config.js          # Custom colors, fonts, animations, shadows
├── postcss.config.js           # PostCSS (Tailwind + Autoprefixer)
├── Backend/                    # 🔲 Future backend (currently empty)
│
├── src/
│   ├── main.jsx                # React DOM entry point
│   ├── App.jsx                 # Root — BrowserRouter, providers, route definitions
│   ├── index.css               # Global CSS + Tailwind directives
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Site navigation (responsive, cart badge)
│   │   ├── Footer.jsx          # Site footer with links & newsletter
│   │   ├── Hero.jsx            # Homepage hero section
│   │   ├── ProductCard.jsx     # Product listing card
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
│   │   ├── Checkout.jsx        # Checkout form (/checkout)
│   │   ├── About.jsx           # About page (/about)
│   │   ├── Contact.jsx         # Contact page (/contact)
│   │   ├── Login.jsx           # Login page (/login)
│   │   ├── Register.jsx        # Registration page (/register)
│   │   ├── Account.jsx         # User account (/account)
│   │   ├── CeylonCinnamon.jsx  # Info page (/ceylon-cinnamon)
│   │   └── NotFound.jsx        # 404 page
│   │
│   ├── context/                # React Context providers
│   │   ├── CartContext.jsx     # Cart state (add, remove, quantity, persist)
│   │   └── WishlistContext.jsx # Wishlist state
│   │
│   └── data/                   # Static data (no backend yet)
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

| Path               | Page Component   | Auth Layout? |
| ------------------ | ---------------- | ------------ |
| `/`                | Home             | No           |
| `/shop`            | Shop             | No           |
| `/shop/:slug`      | ProductDetails   | No           |
| `/cart`            | Cart             | No           |
| `/checkout`        | Checkout         | No           |
| `/about`           | About            | No           |
| `/contact`         | Contact          | No           |
| `/login`           | Login            | Yes (no nav) |
| `/register`        | Register         | Yes (no nav) |
| `/account`         | Account          | No           |
| `/ceylon-cinnamon` | CeylonCinnamon   | No           |
| `*`                | NotFound         | No           |

> Login and Register pages hide the Navbar and Footer for a clean auth experience.

---

## State Management

### Cart (`CartContext.jsx`)
- Uses `useReducer` with actions: `ADD_TO_CART`, `REMOVE_FROM_CART`, `INCREASE_QUANTITY`, `DECREASE_QUANTITY`, `CLEAR_CART`
- Auto-persisted to `localStorage` under key `ceylone_cart`
- Exposes: `cart`, `cartTotal`, `cartCount`, `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`

### Wishlist (`WishlistContext.jsx`)
- Simple context for wishlisted product IDs

### Provider Hierarchy
```
BrowserRouter → CartProvider → WishlistProvider → ToastProvider → AppRoutes
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
- Currently uses static JS files in `src/data/`
- Product data includes: `id`, `slug`, `name`, `shortDescription`, `description`, `category`, `image`, `images`, `price`, `originalPrice`, `weight`, `origin`, `ingredients`, `processing`, `shipping`, `rating`, `reviewCount`, `stock`, `inStock`, `badge`, `featured`, `tags`
- When backend is added, these will be replaced with API calls

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

### 🔲 Backend Development (`/Backend`)
- API for products, orders, users, and reviews
- Authentication (Firebase Auth or custom JWT)
- Order management system
- Admin dashboard for inventory and orders
- Email notifications (order confirmation, shipping updates)

### 🔲 Future Enhancements
- User authentication (Firebase Auth)
- Order history and tracking
- Product reviews & ratings (user-submitted)
- Search with filters (price range, rating, origin)
- Multi-currency support (LKR, USD, EUR, GBP)
- Inventory management
- SEO optimization with dynamic meta tags
- PWA support for mobile
- Analytics integration (Google Analytics / Firebase Analytics)
- Internationalization (i18n) — English, Sinhala, Tamil

---

## Scripts

```bash
npm run dev       # Start Vite dev server (port 5173, auto-opens browser)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

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

Currently none are required. When backend/payments are added:

```env
# .env.local (never commit this)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_PAYHERE_MERCHANT_ID=
VITE_PAYHERE_API_URL=
```

> All client-exposed env vars in Vite must be prefixed with `VITE_`.
