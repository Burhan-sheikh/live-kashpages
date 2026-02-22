# 🏪 KashPages - Business Listing SaaS Platform

> Production-ready SaaS platform for creating beautiful business listing pages with analytics, reviews, and advanced SEO features.

## 🚀 Project Overview

KashPages is a comprehensive SaaS solution that enables businesses to create professional online presence pages with:

- **Firebase Authentication** (Email/Password + Google OAuth)
- **Dynamic Shop Pages** with customizable layouts
- **Review Management System** with star ratings
- **Advanced Analytics Dashboard**
- **Freemium Pricing Model** (Free + Pro plans)
- **SEO Optimization** with meta tags, custom slugs, and sitemaps
- **Cashfree Payment Integration**

---

## 📁 Project Structure

```
live-kashpages/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js 14 App Router
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── shop/         # Shop-related components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility functions
│   │   ├── firebase/     # Firebase config & helpers
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Helper functions
│   ├── styles/           # Global styles
│   └── types/            # TypeScript type definitions
├── functions/            # Firebase Cloud Functions
│   ├── src/
│   │   ├── auth/        # Auth triggers
│   │   ├── analytics/   # Analytics functions
│   │   ├── payments/    # Payment webhooks
│   │   └── index.ts
│   └── package.json
├── firestore.rules       # Firestore security rules
├── storage.rules         # Storage security rules
└── firebase.json         # Firebase configuration
```

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Custom components with Lucide Icons
- **Animation**: Framer Motion
- **State Management**: React Context + Custom Hooks

### Backend
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Functions**: Firebase Cloud Functions (Node.js)
- **Payments**: Cashfree Integration

### Deployment
- **Frontend**: Netlify
- **Backend**: Firebase Hosting + Functions
- **CI/CD**: GitHub Actions (planned)

---

## 📋 Development Phases

### ✅ Phase 1: Database & Backend Foundation
- [x] Repository setup
- [x] Project structure
- [ ] Firebase Authentication (Email/Password + Google)
- [ ] Firestore database schema
- [ ] Security rules implementation
- [ ] Feature gating logic
- [ ] Cloud Functions setup

### 🔄 Phase 2: Dashboard & Core Features
- [ ] Dashboard layout (Mega Sidebar + Content Area)
- [ ] Analytics Overview
- [ ] Shop Management (Setup Wizard)
- [ ] Review Management
- [ ] Advanced Analytics
- [ ] Settings pages

### ⏳ Phase 3: Frontend (Public & Marketing)
- [ ] Homepage with hero section
- [ ] Advanced search functionality
- [ ] Public shop pages
- [ ] Pricing page with Cashfree
- [ ] Static pages (About, Terms, Privacy)
- [ ] SEO optimization

---

## 🔥 Firebase Setup

### 1. Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init
```

### 2. Enable Services
- Authentication (Email/Password + Google)
- Firestore Database
- Firebase Storage
- Cloud Functions

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.example .env.local
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Firebase CLI installed
- Git installed

### Installation Steps

```bash
# Clone repository
git clone https://github.com/Burhan-sheikh/live-kashpages.git
cd live-kashpages

# Install dependencies
npm install

# Install functions dependencies
cd functions
npm install
cd ..

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

### Users Collection
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: 'free' | 'pro';
  planExpiresAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Shops Collection
```typescript
interface Shop {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  coverImage: string;
  gallery: string[];
  about: string;
  services: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  contact: {
    phone: string;
    whatsapp: string;
    address: Address;
  };
  seo: {
    title: string;
    description: string;
    tags: string[];
    image: string;
    favicon?: string;
  };
  settings: {
    ratingsEnabled: boolean;
    removeBranding: boolean;
    passwordProtected: boolean;
    password?: string;
  };
  status: 'draft' | 'published' | 'unpublished';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}
```

### Reviews Collection
```typescript
interface Review {
  id: string;
  shopId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  isVisible: boolean;
  createdAt: Timestamp;
}
```

### Analytics Collection
```typescript
interface Analytics {
  id: string;
  shopId: string;
  date: string; // YYYY-MM-DD
  views: number;
  whatsappClicks: number;
  phoneClicks: number;
  locationClicks: number;
}
```

---

## 🔐 Security Rules

Firestore security rules are defined in `firestore.rules` with:
- User authentication checks
- Plan-based feature gating
- Owner-only access for shops
- Public read for published shops
- Rate limiting for analytics

---

## 💳 Pricing Plans

### Free Plan
- 1 Shop
- Basic analytics
- 3 gallery images
- KashPages branding
- Standard SEO

### Pro Plan (₹50/month)
- Unlimited shops
- Advanced analytics dashboard
- 30 gallery images
- Remove branding
- Review system
- Custom favicon
- Advanced SEO (meta tags)

---

## 🚀 Deployment

### Netlify (Frontend)
```bash
# Build command
npm run build

# Publish directory
out

# Environment variables
# Add all REACT_APP_* variables from .env.example
```

### Firebase (Backend)
```bash
# Deploy functions
npm run deploy:functions

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy storage rules
firebase deploy --only storage
```

---

## 📝 Contributing

This is a production project. Please follow these guidelines:

1. Create feature branches from `main`
2. Write clear commit messages
3. Test thoroughly before pushing
4. Update documentation as needed

---

## 📄 License

Proprietary - All rights reserved

---

## 👨‍💻 Developer

**Burhan Sheikh**  
Srinagar, Kashmir  
GitHub: [@Burhan-sheikh](https://github.com/Burhan-sheikh)

---

## 📞 Support

For issues and questions, please create a GitHub issue or contact support.

---

**Built with ❤️ in Kashmir**
