import { Router, Response } from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Get admin stats
router.get('/stats', verifyToken, async (req: any, res: Response) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin only' });
  }

  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();
    
    // Sum of paid or completed orders total
    const revenueResult = await prisma.order.aggregate({
      where: {
        status: {
          in: ['paid', 'completed', 'success'],
        },
      },
      _sum: {
        total: true,
      },
    });
    const totalRevenue = revenueResult._sum.total || 0;

    const pendingOrders = await prisma.order.count({
      where: {
        status: 'pending',
      },
    });

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
    });
  } catch (error) {
    console.error('Failed to fetch admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

export default router;
