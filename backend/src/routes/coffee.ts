import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Get all coffee products (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const coffees = await prisma.product.findMany();
    res.json(coffees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coffees' });
  }
});

// Get single coffee by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const coffee = await prisma.product.findUnique({ where: { id: Number(id) } });
    if (!coffee) return res.status(404).json({ error: 'Coffee not found' });
    res.json(coffee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch coffee' });
  }
});

// Create new coffee (admin only)
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const { name, description, price, imageUrl, category, inStock } = req.body;
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
  try {
    const coffee = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        category,
        inStock: inStock !== false,
      },
    });
    res.status(201).json(coffee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coffee' });
  }
});

// Update coffee (admin only)
router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, imageUrl, category, inStock } = req.body;
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
  try {
    const coffee = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        category,
        inStock: inStock !== false,
      },
    });
    res.json(coffee);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coffee' });
  }
});

// Delete coffee (admin only)
router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coffee' });
  }
});

export default router;
