# Firebase Deployment Guide

## Overview
This project deploys to **Firebase Hosting** as a static single-page application (SPA).

## Prerequisites
- Node.js 18+ installed
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project created at https://console.firebase.google.com

## Setup (One-Time)

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize hosting (from project root)
firebase init hosting
#    → Public directory: dist
#    → Configure as SPA: Yes
#    → Set up automatic builds with GitHub: No (or Yes if CI/CD desired)
```

## Build & Deploy

```bash
# Build the Vite production bundle
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Firebase Configuration

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### Key Points
- **Public directory**: `dist` (Vite's build output)
- **SPA rewrites**: All routes rewrite to `/index.html` for React Router to handle
- **Cache headers**: Long-lived cache for hashed assets in `/assets/`
- `dist/` and `.firebase/` must be in `.gitignore`

## Environment-Specific Deploys
- **Preview channel**: `firebase hosting:channel:deploy preview` (creates a temporary preview URL)
- **Production**: `firebase deploy --only hosting`

## Future: Firebase Services
When backend features are added, the project may also use:
- **Firebase Auth** — user authentication
- **Cloud Firestore** — product catalog, orders, user profiles
- **Cloud Functions** — PayHere webhook handler, server-side payment hash generation
- **Firebase Storage** — product images, user uploads
- **Firebase Analytics** — user behavior and conversion tracking
