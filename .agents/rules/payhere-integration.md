# PayHere Payment Gateway — Integration Plan

> **Status**: 🔲 Planned (not yet implemented)

## Overview
[PayHere](https://www.payhere.lk/) is a Sri Lankan payment gateway that will be integrated for online payments. This document outlines the planned architecture so that any AI assistant working on this project understands the intended approach.

## Integration Architecture

### Frontend (React)
- **Integration Point**: `src/pages/Checkout.jsx`
- **Method**: PayHere JavaScript SDK (checkout popup)
- **Flow**:
  1. User fills checkout form (shipping details, contact info)
  2. Frontend sends order data to backend API
  3. Backend generates payment hash and returns payment object
  4. Frontend opens PayHere checkout using the SDK
  5. On success → redirect to order confirmation page
  6. On failure → show error and allow retry

### Backend (Node.js / Cloud Functions)
- **Hash Generation**: Payment hash must be generated server-side using `MERCHANT_SECRET`
- **Notify URL**: Webhook endpoint that PayHere calls after payment
- **Endpoints needed**:
  - `POST /api/orders` — Create order and return PayHere payment object
  - `POST /api/payments/notify` — PayHere webhook (verify + update order status)
  - `GET /api/orders/:id` — Get order status

### PayHere Payment Object Structure
```javascript
{
  sandbox: true,              // true for testing, false for production
  merchant_id: "MERCHANT_ID",
  return_url: "https://yoursite.com/order-success",
  cancel_url: "https://yoursite.com/checkout",
  notify_url: "https://your-api.com/api/payments/notify",
  order_id: "ORDER_12345",
  items: "Ceylon Cinnamon Products",
  amount: "89.99",
  currency: "USD",            // or "LKR"
  hash: "SERVER_GENERATED_HASH",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "0771234567",
  address: "123 Main St",
  city: "Colombo",
  country: "Sri Lanka"
}
```

### Security Rules
- **NEVER** expose `MERCHANT_SECRET` on the frontend
- **ALWAYS** generate payment hash on the server
- **ALWAYS** verify payments via the notify URL webhook
- Store `PAYHERE_MERCHANT_ID` and `PAYHERE_MERCHANT_SECRET` in environment variables
- Validate order amounts server-side before generating hash

### Environment Variables
```env
# Backend (.env — never commit)
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
PAYHERE_API_URL=https://sandbox.payhere.lk/pay/checkout  # sandbox
# Production: https://www.payhere.lk/pay/checkout

# Frontend (.env.local — Vite)
VITE_PAYHERE_MERCHANT_ID=your_merchant_id
```

### Testing
- Use PayHere sandbox environment for testing
- Sandbox URL: `https://sandbox.payhere.lk/pay/checkout`
- Production URL: `https://www.payhere.lk/pay/checkout`
- Test card numbers provided in PayHere docs

## Dependencies to Add
```bash
# No npm package needed — PayHere uses a script tag
# Add to index.html:
# <script src="https://www.payhere.lk/lib/payhere.js"></script>
```

## Files to Create/Modify
- `src/pages/Checkout.jsx` — Add PayHere SDK integration
- `src/services/paymentService.js` — API calls for order creation
- `Backend/routes/orders.js` — Order API routes
- `Backend/routes/payments.js` — Payment webhook handler
- `Backend/utils/payhere.js` — Hash generation utility
