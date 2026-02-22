# 🚀 Deployment Guide - KashPages

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Git installed
- Netlify account (for frontend)
- Firebase project created

---

## Step 1: Clone and Install

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
```

---

## Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it (e.g., "kashpages-prod")
4. Enable Google Analytics (optional)

### 2.2 Enable Services

**Authentication**:
1. Go to Authentication > Sign-in method
2. Enable "Email/Password"
3. Enable "Google"
4. Add authorized domain: `yourapp.netlify.app`

**Firestore Database**:
1. Go to Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location (e.g., asia-south1)

**Storage**:
1. Go to Storage
2. Click "Get started"
3. Use production mode
4. Same location as Firestore

**Cloud Functions**:
1. Go to Functions
2. Upgrade to Blaze plan (required for Functions)
3. Choose region (asia-south1 recommended)

### 2.3 Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (`</>`)
4. Register app with nickname
5. Copy the config object

### 2.4 Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cashfree (get from Cashfree dashboard)
NEXT_PUBLIC_CASHFREE_APP_ID=your_cashfree_app_id
NEXT_PUBLIC_CASHFREE_SECRET_KEY=your_cashfree_secret_key
NEXT_PUBLIC_CASHFREE_MODE=TEST # or PRODUCTION

# App URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5001/your-project/asia-south1
```

---

## Step 3: Deploy Firebase Backend

### 3.1 Login to Firebase

```bash
firebase login
```

### 3.2 Initialize Firebase

```bash
firebase init
```

Select:
- ☑️ Firestore
- ☑️ Functions
- ☑️ Storage
- ☑️ Hosting (optional)

Choose:
- Use existing project: Select your Firebase project
- Firestore rules: `firestore.rules`
- Firestore indexes: `firestore.indexes.json`
- Functions language: `TypeScript`
- Functions directory: `functions`
- Storage rules: `storage.rules`

### 3.3 Deploy Firestore Rules & Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### 3.4 Deploy Storage Rules

```bash
firebase deploy --only storage
```

### 3.5 Deploy Cloud Functions

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

**Note**: First deployment takes 5-10 minutes.

---

## Step 4: Setup Cashfree (Payment Gateway)

### 4.1 Create Cashfree Account

1. Go to [Cashfree](https://www.cashfree.com/)
2. Sign up for merchant account
3. Complete KYC verification

### 4.2 Get API Credentials

1. Login to Cashfree Dashboard
2. Go to Developers > API Keys
3. Copy App ID and Secret Key
4. Add to `.env.local`

### 4.3 Configure Webhook

1. Go to Developers > Webhooks
2. Add webhook URL: `https://asia-south1-your-project.cloudfunctions.net/handlePaymentWebhook`
3. Select events: `PAYMENT_SUCCESS_WEBHOOK`
4. Save webhook URL

---

## Step 5: Deploy Frontend to Netlify

### 5.1 Build for Production

```bash
npm run build
```

This creates an `out/` directory with static files.

### 5.2 Deploy to Netlify

**Option A: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Follow prompts:
# - Create new site
# - Publish directory: out
```

**Option B: Netlify Dashboard**

1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Add environment variables (same as `.env.local`)
6. Deploy site

### 5.3 Configure Custom Domain (Optional)

1. In Netlify dashboard, go to Site settings > Domain management
2. Add custom domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

### 5.4 Update Firebase Auth Domain

1. Go to Firebase Console > Authentication > Settings
2. Add authorized domain: `yourapp.netlify.app` or your custom domain
3. Save changes

---

## Step 6: Post-Deployment Checks

### 6.1 Test Authentication

- [ ] Sign up with email/password works
- [ ] Google sign-in works
- [ ] User document created in Firestore
- [ ] Password reset email sends

### 6.2 Test Firestore Rules

- [ ] Authenticated users can create shops
- [ ] Free users limited to 1 shop
- [ ] Free users limited to 3 gallery images
- [ ] Only owners can edit their shops
- [ ] Published shops are publicly visible

### 6.3 Test Storage

- [ ] Image uploads work
- [ ] Uploaded images accessible via URL
- [ ] Image deletion works

### 6.4 Test Cloud Functions

- [ ] User creation triggers function
- [ ] Analytics tracking works
- [ ] Review rating calculation works

---

## Step 7: Monitoring & Maintenance

### 7.1 Firebase Console

Monitor:
- Authentication users
- Firestore read/write operations
- Storage usage
- Functions execution logs
- Functions errors

### 7.2 Netlify Dashboard

Monitor:
- Deploy status
- Build logs
- Site analytics
- Form submissions

### 7.3 Set Up Alerts

**Firebase**:
1. Go to Alerts & reporting
2. Enable budget alerts
3. Set spending limits

**Netlify**:
1. Configure deploy notifications
2. Set up email alerts

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Functions Deploy Fails

```bash
# Check Node version (must be 18)
node --version

# Rebuild functions
cd functions
rm -rf node_modules lib
npm install
npm run build
```

### Firebase Rules Not Working

```bash
# Re-deploy rules
firebase deploy --only firestore:rules,storage --force
```

### Environment Variables Not Working

1. Verify all `NEXT_PUBLIC_*` variables are set
2. Restart dev server
3. Clear build cache: `rm -rf .next`
4. Rebuild

---

## Security Checklist

- [ ] Firebase API keys in environment variables (not hardcoded)
- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] Sensitive functions require authentication
- [ ] CORS configured for Cloud Functions
- [ ] Rate limiting implemented for public endpoints
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] HTTPS enforced (Netlify auto-enables)
- [ ] Environment variables secured in Netlify

---

## Performance Optimization

### Frontend
- [ ] Images optimized (WebP format)
- [ ] Lazy loading implemented
- [ ] Code splitting enabled (automatic in Next.js)
- [ ] Caching headers configured

### Backend
- [ ] Firestore indexes created
- [ ] Composite queries optimized
- [ ] Cloud Functions cold start minimized
- [ ] Storage bucket CORS configured

---

## Cost Estimation

### Firebase (Blaze Plan)
- Firestore: ~₹200-500/month (small-medium usage)
- Storage: ~₹50-200/month
- Functions: ~₹100-300/month
- **Total**: ~₹350-1000/month

### Netlify
- **Free tier**: 100GB bandwidth, 300 build minutes
- Pro plan: $19/month if needed

### Cashfree
- Transaction fee: ~2% per transaction
- No monthly fees

**Estimated Monthly Cost**: ₹350-1000 + Cashfree transaction fees

---

## Support

For issues:
1. Check Firebase Console logs
2. Check Netlify deploy logs
3. Review Firestore rules
4. Test in Firebase emulators locally
5. Create GitHub issue if needed

---

**Deployed by**: Burhan Sheikh  
**Last Updated**: February 22, 2026
