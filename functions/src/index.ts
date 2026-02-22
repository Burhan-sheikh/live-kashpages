import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Import sub-modules
import { onUserCreate, onUserDelete } from './auth/authTriggers';
import { trackAnalytics, getShopAnalytics } from './analytics/analyticsHandlers';
import { handlePaymentWebhook, verifyPayment } from './payments/paymentHandlers';
import { calculateAverageRating } from './reviews/reviewTriggers';

// Export all functions
export {
  // Auth triggers
  onUserCreate,
  onUserDelete,
  
  // Analytics
  trackAnalytics,
  getShopAnalytics,
  
  // Payments
  handlePaymentWebhook,
  verifyPayment,
  
  // Reviews
  calculateAverageRating
};
