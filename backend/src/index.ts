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

const app = express();
app.use(cors());
app.use(express.json());

// Prisma client instance
export const prisma = new PrismaClient();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/coffee', coffeeRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/order', orderRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
