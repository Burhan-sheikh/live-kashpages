import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
  increment,
} from 'firebase/firestore';
import { db } from './config';
import { Shop, Review, Analytics, ShopStatus } from '@/types';

// ============================================
// SHOPS
// ============================================

/**
 * Create a new shop
 */
export async function createShop(shopData: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'shops'), {
      ...shopData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // Increment user's shop count
    await updateDoc(doc(db, 'users', shopData.ownerId), {
      shopCount: increment(1),
    });

    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
}

/**
 * Get shop by ID
 */
export async function getShop(shopId: string) {
  try {
    const shopDoc = await getDoc(doc(db, 'shops', shopId));
    
    if (shopDoc.exists()) {
      return { shop: { id: shopDoc.id, ...shopDoc.data() } as Shop, error: null };
    }
    
    return { shop: null, error: 'Shop not found' };
  } catch (error: any) {
    return { shop: null, error: error.message };
  }
}

/**
 * Get shop by slug
 */
export async function getShopBySlug(slug: string) {
  try {
    const q = query(
      collection(db, 'shops'),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const shopDoc = snapshot.docs[0];
      return { shop: { id: shopDoc.id, ...shopDoc.data() } as Shop, error: null };
    }
    
    return { shop: null, error: 'Shop not found' };
  } catch (error: any) {
    return { shop: null, error: error.message };
  }
}

/**
 * Get all shops for a user
 */
export async function getUserShops(userId: string) {
  try {
    const q = query(
      collection(db, 'shops'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const shops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shop));
    
    return { shops, error: null };
  } catch (error: any) {
    return { shops: [], error: error.message };
  }
}

/**
 * Get published shops (for homepage)
 */
export async function getPublishedShops(limitCount: number = 20) {
  try {
    const q = query(
      collection(db, 'shops'),
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const shops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shop));
    
    return { shops, error: null };
  } catch (error: any) {
    return { shops: [], error: error.message };
  }
}

/**
 * Update shop
 */
export async function updateShop(shopId: string, updates: Partial<Shop>) {
  try {
    await updateDoc(doc(db, 'shops', shopId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Publish shop
 */
export async function publishShop(shopId: string) {
  try {
    await updateDoc(doc(db, 'shops', shopId), {
      status: 'published',
      publishedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Unpublish shop
 */
export async function unpublishShop(shopId: string) {
  try {
    await updateDoc(doc(db, 'shops', shopId), {
      status: 'unpublished',
      updatedAt: Timestamp.now(),
    });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete shop
 */
export async function deleteShop(shopId: string, ownerId: string) {
  try {
    await deleteDoc(doc(db, 'shops', shopId));
    
    // Decrement user's shop count
    await updateDoc(doc(db, 'users', ownerId), {
      shopCount: increment(-1),
    });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// REVIEWS
// ============================================

/**
 * Get reviews for a shop
 */
export async function getShopReviews(shopId: string, onlyVisible: boolean = false) {
  try {
    const constraints: QueryConstraint[] = [
      where('shopId', '==', shopId),
      orderBy('createdAt', 'desc'),
    ];
    
    if (onlyVisible) {
      constraints.push(where('isVisible', '==', true));
    }
    
    const q = query(collection(db, 'reviews'), ...constraints);
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
    
    return { reviews, error: null };
  } catch (error: any) {
    return { reviews: [], error: error.message };
  }
}

/**
 * Create a review
 */
export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: Timestamp.now(),
    });
    
    return { id: docRef.id, error: null };
  } catch (error: any) {
    return { id: null, error: error.message };
  }
}

/**
 * Toggle review visibility
 */
export async function toggleReviewVisibility(reviewId: string, isVisible: boolean) {
  try {
    await updateDoc(doc(db, 'reviews', reviewId), {
      isVisible,
      updatedAt: Timestamp.now(),
    });
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete review
 */
export async function deleteReview(reviewId: string) {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Get analytics for a shop (use Cloud Function for authenticated access)
 */
export async function getShopAnalytics(shopId: string, startDate?: string, endDate?: string) {
  try {
    // This should call the Cloud Function instead of direct Firestore access
    // for better security and feature gating
    
    const constraints: QueryConstraint[] = [
      where('shopId', '==', shopId),
      orderBy('date', 'desc'),
      limit(90),
    ];
    
    if (startDate) {
      constraints.push(where('date', '>=', startDate));
    }
    if (endDate) {
      constraints.push(where('date', '<=', endDate));
    }
    
    const q = query(collection(db, 'analytics'), ...constraints);
    const snapshot = await getDocs(q);
    const analytics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Analytics));
    
    return { analytics, error: null };
  } catch (error: any) {
    return { analytics: [], error: error.message };
  }
}
