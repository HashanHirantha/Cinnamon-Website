# Future Implementations — CEYLONÉ Roadmap

> **Status Legend**: 🔲 Planned · 🟡 In Progress · ✅ Completed

---

## Phase 1 — Firebase Deployment & Hosting

| Task | Status | Details |
|------|--------|---------|
| Firebase Hosting setup | 🔲 | `firebase.json` and `.firebaserc` created, awaiting project ID |
| Production build pipeline | 🔲 | `npm run build` → `dist/` → `firebase deploy` |
| Custom domain setup | 🔲 | Connect custom domain via Firebase Console |
| SSL certificate | 🔲 | Auto-provisioned by Firebase Hosting |
| Preview channels | 🔲 | Use `firebase hosting:channel:deploy` for staging |

---

## Phase 2 — Authentication (Firebase Auth)

| Task | Status | Details |
|------|--------|---------|
| Firebase Auth SDK integration | 🔲 | Add `firebase` npm package |
| `AuthContext.jsx` provider | 🔲 | Create in `src/context/` — wraps Firebase Auth state |
| Email/password sign-up | 🔲 | Wire `Register.jsx` to `createUserWithEmailAndPassword` |
| Email/password login | 🔲 | Wire `Login.jsx` to `signInWithEmailAndPassword` |
| Google OAuth login | 🔲 | Add Google sign-in button on Login/Register pages |
| Password reset flow | 🔲 | "Forgot password" link → `sendPasswordResetEmail` |
| Protected routes | 🔲 | Guard `/account`, `/checkout` — redirect to `/login` if unauthenticated |
| User profile in Firestore | 🔲 | Store name, address, phone in `users/{uid}` collection |
| Session persistence | 🔲 | Use `setPersistence(browserLocalPersistence)` |
| `Account.jsx` real data | 🔲 | Replace mock data with Firebase Auth + Firestore profile |

### Files to Create/Modify
- `src/config/firebase.js` — Firebase app initialization
- `src/context/AuthContext.jsx` — Auth provider + `useAuth` hook
- `src/pages/Login.jsx` — Connect to Firebase Auth
- `src/pages/Register.jsx` — Connect to Firebase Auth
- `src/pages/Account.jsx` — Load real user data
- `src/components/ProtectedRoute.jsx` — Route guard component

---

## Phase 3 — Backend API (`/Backend`)

| Task | Status | Details |
|------|--------|---------|
| Backend framework setup | 🔲 | Node.js + Express (or Firebase Cloud Functions) |
| Product API | 🔲 | `GET /api/products`, `GET /api/products/:slug` |
| Order API | 🔲 | `POST /api/orders`, `GET /api/orders/:id`, `GET /api/orders/user/:uid` |
| User API | 🔲 | `GET /api/users/:uid`, `PUT /api/users/:uid` |
| Review API | 🔲 | `POST /api/reviews`, `GET /api/reviews/product/:id` |
| Admin API | 🔲 | CRUD for products, orders, categories (admin-only) |
| Database | 🔲 | Cloud Firestore — collections: `products`, `orders`, `users`, `reviews` |
| API authentication | 🔲 | Firebase Auth ID tokens verified server-side |
| Input validation | 🔲 | Express middleware for request body validation |
| Error handling | 🔲 | Consistent error response format with status codes |
| CORS configuration | 🔲 | Allow frontend origin only |

### Planned Backend Structure
```
Backend/
├── index.js                    # Express app entry point
├── package.json
├── .env                        # Environment variables (never commit)
├── config/
│   └── firebase-admin.js       # Firebase Admin SDK init
├── middleware/
│   ├── auth.js                 # Verify Firebase ID tokens
│   ├── admin.js                # Admin role check
│   └── validate.js             # Request validation
├── routes/
│   ├── products.js             # Product endpoints
│   ├── orders.js               # Order endpoints
│   ├── users.js                # User endpoints
│   ├── reviews.js              # Review endpoints
│   └── payments.js             # PayHere webhook
├── controllers/
│   ├── productController.js
│   ├── orderController.js
│   ├── userController.js
│   ├── reviewController.js
│   └── paymentController.js
├── utils/
│   ├── payhere.js              # PayHere hash generation
│   └── email.js                # Email notification utility
└── services/
    ├── orderService.js
    └── paymentService.js
```

---

## Phase 4 — PayHere Payment Gateway

| Task | Status | Details |
|------|--------|---------|
| PayHere merchant account | 🔲 | Register at payhere.lk |
| PayHere JS SDK | 🔲 | Add `<script>` tag to `index.html` |
| Checkout form validation | 🔲 | Validate all fields before payment |
| Server-side hash generation | 🔲 | `Backend/utils/payhere.js` using `MERCHANT_SECRET` |
| Payment initiation | 🔲 | Frontend opens PayHere checkout popup |
| Notify URL webhook | 🔲 | `POST /api/payments/notify` — verify & update order |
| Order confirmation page | 🔲 | `src/pages/OrderSuccess.jsx` — post-payment confirmation |
| Payment failure handling | 🔲 | Retry mechanism + error UI on `Checkout.jsx` |
| Sandbox testing | 🔲 | Test with PayHere sandbox environment |
| Production switch | 🔲 | Swap sandbox → production URLs |
| Multi-currency (LKR/USD) | 🔲 | Currency selector on checkout |
| Payment receipt emails | 🔲 | Trigger via Cloud Functions on order status change |

### Payment Flow
```
User fills checkout form
        ↓
Frontend → POST /api/orders (create order + get payment hash)
        ↓
Frontend opens PayHere checkout popup
        ↓
    ┌───────────────────────┐
    │   PayHere processes   │
    │      payment          │
    └───────────────────────┘
        ↓                ↓
   Success            Failure
        ↓                ↓
PayHere → POST       Show error
/api/payments/notify  Allow retry
        ↓
Backend verifies &
updates order status
        ↓
Redirect to
OrderSuccess page
```

### Security Checklist
- [ ] `MERCHANT_SECRET` only on server — never exposed to frontend
- [ ] Hash generated server-side for every payment
- [ ] Notify URL verifies payment authenticity via hash comparison
- [ ] Order amounts validated server-side (prevent tampering)
- [ ] HTTPS enforced for all payment endpoints

---

## Phase 5 — Enhanced Product Features

| Task | Status | Details |
|------|--------|---------|
| Product search | 🔲 | Full-text search with debounced input |
| Advanced filters | 🔲 | Filter by price range, rating, origin, category |
| Sort options | 🔲 | Price (low/high), rating, newest, popularity |
| Product reviews (user-submitted) | 🔲 | Star rating + text review on `ProductDetails.jsx` |
| Related products | 🔲 | Show similar products based on category/tags |
| Recently viewed | 🔲 | Track in `localStorage`, show on Shop page |
| Stock management | 🔲 | Real-time stock from Firestore, "Out of Stock" states |
| Product image gallery | 🔲 | Swiper-based zoom/lightbox on product detail |
| Bulk/wholesale pricing | 🔲 | Tiered pricing for large quantities |

---

## Phase 6 — Order Management

| Task | Status | Details |
|------|--------|---------|
| Order history | 🔲 | List past orders on `Account.jsx` |
| Order tracking | 🔲 | Status timeline (processing → shipped → delivered) |
| Order confirmation email | 🔲 | Automated email via Cloud Functions |
| Shipping updates email | 🔲 | Trigger on status change |
| Invoice generation | 🔲 | PDF invoice download |
| Order cancellation | 🔲 | Cancel within 24 hours if not shipped |
| Refund workflow | 🔲 | PayHere refund API integration |

---

## Phase 7 — Admin Dashboard

| Task | Status | Details |
|------|--------|---------|
| Admin route (`/admin`) | 🔲 | Protected by admin role check |
| Product CRUD | 🔲 | Add, edit, delete products |
| Order management | 🔲 | View, update status, search orders |
| Customer management | 🔲 | View customer list and order history |
| Inventory tracking | 🔲 | Stock levels, low-stock alerts |
| Sales analytics | 🔲 | Revenue charts, best sellers, conversion rates |
| Image upload | 🔲 | Upload to Firebase Storage, replace Unsplash URLs |

---

## Phase 8 — SEO & Performance

| Task | Status | Details |
|------|--------|---------|
| Dynamic meta tags | 🔲 | Use `react-helmet-async` per page |
| Open Graph tags | 🔲 | Product sharing on social media |
| Structured data (JSON-LD) | 🔲 | Product schema for Google rich results |
| Sitemap generation | 🔲 | Auto-generate `sitemap.xml` at build time |
| Image optimization | 🔲 | WebP/AVIF format, lazy loading, srcset |
| Code splitting | 🔲 | `React.lazy()` + `Suspense` for route-based splitting |
| Bundle analysis | 🔲 | `rollup-plugin-visualizer` to audit bundle size |
| Lighthouse audit | 🔲 | Target 90+ score on all categories |
| PWA support | 🔲 | Service worker, manifest, offline capability |

---

## Phase 9 — Internationalization & Analytics

| Task | Status | Details |
|------|--------|---------|
| i18n setup | 🔲 | `react-i18next` — English, Sinhala, Tamil |
| Language switcher | 🔲 | Dropdown in Navbar |
| Multi-currency display | 🔲 | LKR, USD, EUR, GBP with conversion rates |
| Google Analytics | 🔲 | Firebase Analytics or GA4 integration |
| Conversion tracking | 🔲 | Track add-to-cart, checkout, purchase events |
| Heatmaps | 🔲 | Optional: Hotjar or Microsoft Clarity |

---

## Phase 10 — Production Image Migration

| Task | Status | Details |
|------|--------|---------|
| Product photography | 🔲 | Professional photos of all products |
| Firebase Storage setup | 🔲 | Upload images to Firebase Storage |
| CDN configuration | 🔲 | Firebase Hosting CDN or Cloudflare |
| Update `images.js` | 🔲 | Replace all Unsplash URLs with production URLs |
| Image compression pipeline | 🔲 | Automate WebP/AVIF conversion |

---

## Dependencies to Add (by Phase)

```bash
# Phase 2 — Auth
npm install firebase

# Phase 5 — Search & Filters
# No additional deps (built with existing React)

# Phase 8 — SEO
npm install react-helmet-async

# Phase 9 — i18n
npm install react-i18next i18next i18next-browser-languagedetector

# Backend (Phase 3)
cd Backend
npm init -y
npm install express cors dotenv firebase-admin
npm install -D nodemon
```

---

## Priority Order

> Implement in this order for maximum value:

1. **Firebase Deployment** — Get the site live
2. **Authentication** — Enable user accounts
3. **Backend API** — Enable dynamic data
4. **PayHere Payments** — Enable purchases
5. **Order Management** — Post-purchase experience
6. **Admin Dashboard** — Business operations
7. **SEO & Performance** — Growth and discoverability
8. **Enhanced Products** — Better shopping experience
9. **i18n & Analytics** — Scale and insights
10. **Production Images** — Final polish
