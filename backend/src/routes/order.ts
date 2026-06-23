import { Router, Response } from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';
import midtransClient from 'midtrans-client';

const router = Router();

// Midtrans Snap client
let snap: any = null;
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
router.post('/', verifyToken, async (req: any, res: Response) => {
  const { items, total } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items in order' });
  }

  try {
    // 1. Create order and order items in DB
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'pending',
        total: Number(total),
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

    let snapToken = null;

    // 2. Generate Midtrans Snap token if Midtrans client is configured
    if (snap) {
      try {
        const parameter = {
          transaction_details: {
            order_id: `FOLDEN-ORDER-${order.id}-${Date.now()}`,
            gross_amount: Math.round(order.total),
          },
          credit_card: {
            secure: true,
          },
          customer_details: {
            email: req.user.email,
            first_name: req.user.name || req.user.email,
          },
        };

        const transaction = await snap.createTransaction(parameter);
        snapToken = transaction.token;

        // Save Snap token inside paymentId or store metadata
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentId: transaction.token },
        });
      } catch (midtransError) {
        console.error('Midtrans Snap Token generation error:', midtransError);
      }
    }

    res.status(201).json({ order, snapToken });
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get logged-in user's orders
router.get('/my', verifyToken, async (req: any, res: Response) => {
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
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
