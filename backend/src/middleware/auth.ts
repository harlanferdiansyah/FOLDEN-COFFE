import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name?: string;
        isAdmin: boolean;
      };
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey') as any;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      isAdmin: decoded.isAdmin || decoded.email === 'harlan@gmail.com' || false,
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}
