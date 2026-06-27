// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import coffeeRouter from './routes/coffee';
import paymentRouter from './routes/payment';
import orderRouter from './routes/order';
import adminRouter from './routes/admin';

dotenv.config();

// ── Prisma singleton (prevents too many connections on serverless) ──
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/coffee', coffeeRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);

// Export for Vercel serverless
export default app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
