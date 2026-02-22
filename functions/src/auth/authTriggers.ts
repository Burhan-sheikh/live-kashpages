import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Trigger: Create user document when new user signs up
 * This runs automatically when a new Firebase Auth user is created
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const userDoc = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      plan: 'free', // Default plan
      planExpiresAt: null,
      shopCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(user.uid).set(userDoc);

    functions.logger.info(`User document created for: ${user.email}`, { uid: user.uid });
    
    return { success: true };
  } catch (error) {
    functions.logger.error('Error creating user document:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user document');
  }
});

/**
 * Trigger: Clean up user data when account is deleted
 * Deletes all shops, reviews, analytics owned by the user
 */
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    const batch = db.batch();

    // Delete user document
    const userRef = db.collection('users').doc(user.uid);
    batch.delete(userRef);

    // Delete all shops owned by user
    const shopsSnapshot = await db.collection('shops')
      .where('ownerId', '==', user.uid)
      .get();

    for (const doc of shopsSnapshot.docs) {
      batch.delete(doc.ref);

      // Delete reviews for this shop
      const reviewsSnapshot = await db.collection('reviews')
        .where('shopId', '==', doc.id)
        .get();

      for (const reviewDoc of reviewsSnapshot.docs) {
        batch.delete(reviewDoc.ref);
      }

      // Delete analytics for this shop
      const analyticsSnapshot = await db.collection('analytics')
        .where('shopId', '==', doc.id)
        .get();

      for (const analyticsDoc of analyticsSnapshot.docs) {
        batch.delete(analyticsDoc.ref);
      }
    }

    // Delete payment records
    const paymentsSnapshot = await db.collection('payments')
      .where('userId', '==', user.uid)
      .get();

    for (const doc of paymentsSnapshot.docs) {
      batch.delete(doc.ref);
    }

    await batch.commit();

    functions.logger.info(`User data cleaned up for: ${user.uid}`);
    
    return { success: true };
  } catch (error) {
    functions.logger.error('Error deleting user data:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete user data');
  }
});
