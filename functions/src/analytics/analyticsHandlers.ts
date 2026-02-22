import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * HTTP Function: Track analytics event
 * Increments view/click counters for a shop
 */
export const trackAnalytics = functions.https.onCall(async (data, context) => {
  try {
    const { shopId, eventType } = data;

    // Validate input
    if (!shopId || !eventType) {
      throw new functions.https.HttpsError('invalid-argument', 'shopId and eventType are required');
    }

    const validEvents = ['view', 'whatsapp_click', 'phone_click', 'location_click'];
    if (!validEvents.includes(eventType)) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid event type');
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const analyticsId = `${shopId}_${today}`;

    const analyticsRef = db.collection('analytics').doc(analyticsId);

    // Use transaction to safely increment counters
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(analyticsRef);

      if (!doc.exists) {
        // Create new analytics document for today
        transaction.set(analyticsRef, {
          shopId,
          date: today,
          views: eventType === 'view' ? 1 : 0,
          whatsappClicks: eventType === 'whatsapp_click' ? 1 : 0,
          phoneClicks: eventType === 'phone_click' ? 1 : 0,
          locationClicks: eventType === 'location_click' ? 1 : 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Increment existing counter
        const increment: any = {
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (eventType === 'view') increment.views = admin.firestore.FieldValue.increment(1);
        if (eventType === 'whatsapp_click') increment.whatsappClicks = admin.firestore.FieldValue.increment(1);
        if (eventType === 'phone_click') increment.phoneClicks = admin.firestore.FieldValue.increment(1);
        if (eventType === 'location_click') increment.locationClicks = admin.firestore.FieldValue.increment(1);

        transaction.update(analyticsRef, increment);
      }
    });

    return { success: true };
  } catch (error) {
    functions.logger.error('Error tracking analytics:', error);
    throw new functions.https.HttpsError('internal', 'Failed to track analytics');
  }
});

/**
 * HTTP Function: Get shop analytics with date range
 * Authenticated users only - must be shop owner
 */
export const getShopAnalytics = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { shopId, startDate, endDate } = data;

    // Validate input
    if (!shopId) {
      throw new functions.https.HttpsError('invalid-argument', 'shopId is required');
    }

    // Verify user owns this shop
    const shopDoc = await db.collection('shops').doc(shopId).get();
    if (!shopDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Shop not found');
    }

    if (shopDoc.data()?.ownerId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'You do not own this shop');
    }

    // Query analytics
    let query = db.collection('analytics').where('shopId', '==', shopId);

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }
    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const snapshot = await query.orderBy('date', 'desc').limit(90).get(); // Max 90 days

    const analyticsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate totals
    const totals = {
      views: 0,
      whatsappClicks: 0,
      phoneClicks: 0,
      locationClicks: 0,
    };

    analyticsData.forEach((item: any) => {
      totals.views += item.views || 0;
      totals.whatsappClicks += item.whatsappClicks || 0;
      totals.phoneClicks += item.phoneClicks || 0;
      totals.locationClicks += item.locationClicks || 0;
    });

    return {
      success: true,
      data: analyticsData,
      totals,
    };
  } catch (error) {
    functions.logger.error('Error getting analytics:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get analytics');
  }
});
