import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';
import midtransClient from 'midtrans-client';

const router = Router();

// Midtrans Snap client
let snap: midtransClient.Snap | null = null;
try {
  if (process.env.MIDTRANS_SERVER_KEY) {
    snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
    });
  }
} catch (err) {
  console.warn('Midtrans Snap Client initialization failed:', err);
}

// Create new order
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const { items, total, deliveryInfo, paymentMethod } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items in order' });
  }

  if (typeof total !== 'number' || total <= 0) {
    return res.status(400).json({ error: 'Invalid total amount' });
  }

  try {
    // 1. Create order and order items in DB
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'pending',
        total: Number(total),
        paymentMethod: paymentMethod || undefined,
        items: {
          create: items.map((item: any) => ({
            productId: Number(item.productId),
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    let snapToken: string | null = null;

    // 2. Generate Midtrans Snap token if client is configured
    if (snap) {
      try {
        const parameter: midtransClient.TransactionParameter = {
          transaction_details: {
            order_id: `FOLDEN-ORDER-${order.id}-${Date.now()}`,
            gross_amount: Math.round(order.total),
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            email: req.user!.email,
            first_name: req.user!.name || req.user!.email,
            phone: deliveryInfo?.phone || undefined,
          },
        };

        const transaction = await snap.createTransaction(parameter);
        snapToken = transaction.token;

        // Save Snap token as paymentId (only once)
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentId: snapToken },
        });
      } catch (midtransError) {
        console.error('Midtrans Snap Token generation error:', midtransError);
        // Non-fatal: order is already created, proceed without snap token
      }
    }

    // Build receipt using already-included items from create
    const receipt = {
      orderId: order.id,
      status: order.status,
      total: order.total,
      items: order.items,
      paymentId: snapToken,
      deliveryInfo: deliveryInfo || null,
    };

    return res.status(201).json({ order, receipt, snapToken });
  } catch (error) {
    console.error('Failed to create order:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get logged-in user's orders
router.get('/my', verifyToken, async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json(orders);
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID (must belong to logged-in user, or admin)
router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const orderId = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (isNaN(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow access if the order belongs to the user or user is admin
    if (order.userId !== userId && !req.user?.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Midtrans payment notification webhook
router.post('/notification', async (req: Request, res: Response) => {
  try {
    if (!snap) {
      return res.status(503).json({ error: 'Midtrans not configured' });
    }

    const notification = await snap.transaction.notification(req.body);
    const { order_id, transaction_status, fraud_status } = notification;

    // Extract order ID from "FOLDEN-ORDER-<id>-<timestamp>"
    const parts = String(order_id).split('-');
    const orderId = Number(parts[2]);

    if (isNaN(orderId)) {
      console.error('Invalid order_id from Midtrans webhook:', order_id);
      return res.status(400).json({ error: 'Invalid order_id' });
    }

    let newStatus = 'pending';

    if (transaction_status === 'capture') {
      newStatus = fraud_status === 'accept' ? 'paid' : 'fraud';
    } else if (transaction_status === 'settlement') {
      newStatus = 'paid';
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
      newStatus = 'cancelled';
    } else if (transaction_status === 'pending') {
      newStatus = 'pending';
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });

    console.log(`Order ${orderId} status updated to: ${newStatus}`);
    return res.status(200).json({ message: 'Notification handled' });
  } catch (error) {
    console.error('Midtrans notification error:', error);
    return res.status(500).json({ error: 'Failed to handle notification' });
  }
});

export default router;
