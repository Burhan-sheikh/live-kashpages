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
│   │   ├── auth/         # Authentication pages ✅
│   │   └── dashboard/    # Dashboard & management ✅
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── shop/         # Shop-related components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility functions
│   │   ├── firebase/     # Firebase config & helpers ✅
│   │   ├── hooks/        # Custom React hooks ✅
│   │   └── utils/        # Helper functions ✅
│   ├── styles/           # Global styles
│   └── types/            # TypeScript type definitions ✅
├── functions/            # Firebase Cloud Functions
│   ├── src/
│   │   ├── auth/        # Auth triggers
│   │   ├── analytics/   # Analytics functions
│   │   ├── payments/    # Payment webhooks
│   │   └── index.ts
│   └── package.json
├── firestore.rules       # Firestore security rules ✅
├── storage.rules         # Storage security rules ✅
└── firebase.json         # Firebase configuration ✅
```

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Custom components with Lucide Icons
- **Animation**: Framer Motion (planned)
- **State Management**: React Context + Custom Hooks

### Backend
- **Authentication**: Firebase Auth ✅
- **Database**: Firestore ✅
- **Storage**: Firebase Storage ✅
- **Functions**: Firebase Cloud Functions (Node.js)
- **Payments**: Cashfree Integration (planned)

### Deployment
- **Frontend**: Netlify
- **Backend**: Firebase Hosting + Functions
- **CI/CD**: GitHub Actions (planned)

---

## 📋 Development Phases

### ✅ Phase 1: Database & Backend Foundation (COMPLETE)
- [x] Repository setup
- [x] Project structure
- [x] Firebase Authentication (Email/Password + Google)
- [x] Firestore database schema
- [x] Security rules implementation
- [x] Feature gating logic
- [x] Type definitions
- [x] Helper utilities

### ✅ Phase 2: Dashboard & Core Features (COMPLETE)
- [x] Authentication pages (Login, Signup, Password Reset)
- [x] Dashboard layout (Responsive Sidebar + Content Area)
- [x] Dashboard home with stats
- [x] Pages management (List, Create, Edit)
- [x] Settings page (Profile, Security)
- [x] Templates placeholder
- [x] Protected routes
- [x] User state management

### 🔄 Phase 3: Page Builder & Editor (IN PROGRESS)
- [ ] Visual drag-and-drop page editor
- [ ] Component library (Hero, Features, Testimonials, etc.)
- [ ] Section management
- [ ] Real-time preview
- [ ] Template system
- [ ] Theme customization
- [ ] Mobile responsiveness controls

### ⏳ Phase 4: Public Pages & Templates
- [ ] Public page renderer
- [ ] Template library
- [ ] SEO optimization
- [ ] Custom domains
- [ ] Password protection
- [ ] Analytics tracking

### ⏳ Phase 5: Advanced Features
- [ ] Review system
- [ ] Advanced analytics dashboard
- [ ] Payment integration
- [ ] Pro plan features
- [ ] Branding removal
- [ ] Custom favicon support

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

### Pages Collection
```typescript
interface Page {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published';
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
  sections: Section[];
  seo?: {
    title: string;
    description: string;
    image: string;
  };
  views: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}
```

### Reviews Collection (Future)
```typescript
interface Review {
  id: string;
  pageId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  isVisible: boolean;
  createdAt: Timestamp;
}
```

### Analytics Collection (Future)
```typescript
interface Analytics {
  id: string;
  pageId: string;
  date: string; // YYYY-MM-DD
  views: number;
  clicks: number;
  conversions: number;
}
```

---

## 🎨 Current Features

### Authentication System
- ✅ Email/password registration and login
- ✅ Google OAuth integration
- ✅ Password reset via email
- ✅ Protected dashboard routes
- ✅ User session management
- ✅ Profile photo support

### Dashboard
- ✅ Responsive sidebar navigation
- ✅ Mobile hamburger menu
- ✅ Stats overview (Pages, Views, Status)
- ✅ Quick action buttons
- ✅ User profile dropdown
- ✅ Sign out functionality

### Pages Management
- ✅ Create new pages with title and slug
- ✅ List all pages with search and filters
- ✅ View/Edit/Delete actions
- ✅ Draft and Published status
- ✅ View counter
- ✅ Empty state handling

### Settings
- ✅ Edit display name
- ✅ View email (read-only)
- ✅ Profile photo display
- ✅ Security section (placeholder)
- ✅ Danger zone (delete account)

---

## 🔐 Security Rules

Firestore security rules are defined in `firestore.rules` with:
- User authentication checks
- Plan-based feature gating
- Owner-only access for pages
- Public read for published pages
- Rate limiting for analytics

---

## 💳 Pricing Plans

### Free Plan
- 1 Page
- Basic analytics
- Standard templates
- KashPages branding
- Standard SEO

### Pro Plan (₹50/month) - Coming Soon
- Unlimited pages
- Advanced analytics dashboard
- Premium templates
- Remove branding
- Review system
- Custom domain
- Advanced SEO (meta tags)
- Priority support

---

## 🚀 Deployment

### Netlify (Frontend)
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase (Backend)
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy storage rules
firebase deploy --only storage

# Deploy functions (when ready)
firebase deploy --only functions
```

---

## 📝 Development Workflow

### Current Status
- ✅ Phase 1 Complete: Foundation ready
- ✅ Phase 2 Complete: Dashboard & auth working
- 🔄 Phase 3 Starting: Page builder in progress

### Next Steps
1. Build visual page editor
2. Create component library
3. Implement drag-and-drop
4. Add template system
5. Build public page renderer

---

## 🐛 Known Issues

None at this time. All Phase 1 and Phase 2 features are working as expected.

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
