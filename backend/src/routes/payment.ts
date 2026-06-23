import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Handle Midtrans webhook notifications
router.post('/notification', async (req: Request, res: Response) => {
  const notification = req.body;
  
  if (!notification || !notification.order_id) {
    return res.status(400).json({ error: 'Invalid notification data' });
  }

  try {
    // Extract actual DB order ID from order_id: FOLDEN-ORDER-{orderId}-{timestamp}
    const orderIdMatch = notification.order_id.match(/FOLDEN-ORDER-(\d+)/);
    if (!orderIdMatch) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    const orderId = Number(orderIdMatch[1]);
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let orderStatus = 'pending';

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatus = 'pending';
      } else if (fraudStatus === 'accept') {
        orderStatus = 'paid';
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = 'paid';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      orderStatus = 'cancelled';
    } else if (transactionStatus === 'pending') {
      orderStatus = 'pending';
    }

    // Update order status in DB
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        paymentId: notification.transaction_id || null,
      },
    });

    res.json({ status: 'OK' });
  } catch (error) {
    console.error('Failed to handle Midtrans notification:', error);
    res.status(500).json({ error: 'Notification processing failed' });
  }
});

export default router;
