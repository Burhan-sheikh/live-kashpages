import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import * as crypto from 'crypto';

const db = admin.firestore();

/**
 * HTTP Function: Handle Cashfree payment webhook
 * Verifies payment and upgrades user to Pro plan
 */
export const handlePaymentWebhook = functions.https.onRequest(async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    
    if (!signature || !timestamp) {
      res.status(400).send('Missing webhook headers');
      return;
    }

    // Verify Cashfree signature (implement based on Cashfree docs)
    // const isValid = verifyCashfreeSignature(req.body, signature, timestamp);
    // if (!isValid) {
    //   res.status(401).send('Invalid signature');
    //   return;
    // }

    const paymentData = req.body;

    functions.logger.info('Payment webhook received:', paymentData);

    // Handle different payment events
    if (paymentData.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order_id, customer_details, payment_amount } = paymentData.data;

      // Get user ID from order metadata
      const orderDoc = await db.collection('orders').doc(order_id).get();
      
      if (!orderDoc.exists) {
        functions.logger.error('Order not found:', order_id);
        res.status(404).send('Order not found');
        return;
      }

      const orderData = orderDoc.data();
      const userId = orderData?.userId;

      if (!userId) {
        functions.logger.error('User ID not found in order');
        res.status(400).send('Invalid order data');
        return;
      }

      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Update user to Pro plan
      await db.collection('users').doc(userId).update({
        plan: 'pro',
        planExpiresAt: admin.firestore.Timestamp.fromDate(expiryDate),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create payment record
      await db.collection('payments').add({
        userId,
        orderId: order_id,
        amount: payment_amount,
        currency: 'INR',
        status: 'success',
        plan: 'pro',
        validUntil: admin.firestore.Timestamp.fromDate(expiryDate),
        paymentMethod: paymentData.data.payment_method || 'unknown',
        customerEmail: customer_details?.customer_email || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update order status
      await db.collection('orders').doc(order_id).update({
        status: 'completed',
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(`User ${userId} upgraded to Pro plan until ${expiryDate}`);
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    functions.logger.error('Error processing payment webhook:', error);
    res.status(500).send('Internal server error');
  }
});

/**
 * HTTP Function: Verify payment status
 * Called by frontend to confirm payment completion
 */
export const verifyPayment = functions.https.onCall(async (data, context) => {
  try {
    // Check authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    const { orderId } = data;

    if (!orderId) {
      throw new functions.https.HttpsError('invalid-argument', 'orderId is required');
    }

    // Get order from database
    const orderDoc = await db.collection('orders').doc(orderId).get();

    if (!orderDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Order not found');
    }

    const orderData = orderDoc.data();

    // Verify user owns this order
    if (orderData?.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'You do not own this order');
    }

    // Check if already completed
    if (orderData?.status === 'completed') {
      return {
        success: true,
        status: 'completed',
        message: 'Payment already processed',
      };
    }

    // Verify with Cashfree API (optional - webhook should handle this)
    // const cashfreeResponse = await verifyCashfreePayment(orderId);

    return {
      success: true,
      status: orderData?.status || 'pending',
      orderId,
    };
  } catch (error) {
    functions.logger.error('Error verifying payment:', error);
    throw new functions.https.HttpsError('internal', 'Failed to verify payment');
  }
});

/**
 * Helper: Verify Cashfree webhook signature
 * Implement based on Cashfree documentation
 */
function verifyCashfreeSignature(payload: any, signature: string, timestamp: string): boolean {
  // TODO: Implement Cashfree signature verification
  // This is a placeholder - implement according to Cashfree docs
  return true;
}
