import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Trigger: Calculate average rating when review is created/updated/deleted
 * Updates the shop document with average rating and review count
 */
export const calculateAverageRating = functions.firestore
  .document('reviews/{reviewId}')
  .onWrite(async (change, context) => {
    try {
      const reviewData = change.after.exists ? change.after.data() : change.before.data();

      if (!reviewData) {
        return null;
      }

      const shopId = reviewData.shopId;

      // Get all visible reviews for this shop
      const reviewsSnapshot = await db.collection('reviews')
        .where('shopId', '==', shopId)
        .where('isVisible', '==', true)
        .get();

      let totalRating = 0;
      let reviewCount = 0;
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      reviewsSnapshot.forEach(doc => {
        const review = doc.data();
        totalRating += review.rating;
        reviewCount++;
        ratingCounts[review.rating as keyof typeof ratingCounts]++;
      });

      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

      // Update shop document with rating stats
      await db.collection('shops').doc(shopId).update({
        averageRating: parseFloat(averageRating.toFixed(1)),
        reviewCount,
        ratingDistribution: ratingCounts,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(`Updated ratings for shop ${shopId}: avg=${averageRating.toFixed(1)}, count=${reviewCount}`);

      return null;
    } catch (error) {
      functions.logger.error('Error calculating average rating:', error);
      return null;
    }
  });
