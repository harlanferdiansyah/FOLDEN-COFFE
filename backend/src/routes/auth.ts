// src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = Router();

// Fallback demo user (sementara sebelum database cloud aktif)
const DEMO_USER = {
  id: 1,
  email: 'harlan@gmail.com',
  password: 'laann',
  name: 'Harlan',
};

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });
    const isAdmin = email.endsWith('@admin.com') || email === 'harlan@gmail.com';
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, isAdmin },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error: any) {
    // Fallback: kalo database error, register pake akun demo
    if (email === DEMO_USER.email) {
      const token = jwt.sign(
        { userId: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name, isAdmin: true },
        process.env.JWT_SECRET || 'supersecretkey',
        { expiresIn: '7d' }
      );
      return res.json({ token, user: { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name } });
    }
    return res.status(500).json({ error: 'Database tidak tersedia. Coba lagi nanti.' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Cek fallback demo user
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        const token = jwt.sign(
          { userId: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name, isAdmin: true },
          process.env.JWT_SECRET || 'supersecretkey',
          { expiresIn: '7d' }
        );
        return res.json({ token, user: { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name } });
      }
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      // Cek fallback demo user
      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        const token = jwt.sign(
          { userId: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name, isAdmin: true },
          process.env.JWT_SECRET || 'supersecretkey',
          { expiresIn: '7d' }
        );
        return res.json({ token, user: { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name } });
      }
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const isAdmin = user.email.endsWith('@admin.com') || user.email === 'harlan@gmail.com';
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, isAdmin },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });

  } catch (error: any) {
    // Fallback kalo database error
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const token = jwt.sign(
        { userId: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name, isAdmin: true },
        process.env.JWT_SECRET || 'supersecretkey',
        { expiresIn: '7d' }
      );
      return res.json({ token, user: { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name } });
    }
    return res.status(500).json({ error: 'Database tidak tersedia. Coba lagi nanti.' });
  }
});

export default router;
