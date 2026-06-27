// app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('authToken');
    if (stored) {
      const decoded = parseJwt(stored);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.userId, email: decoded.email, name: decoded.name, isAdmin: decoded.isAdmin });
        setToken(stored);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${BACKEND}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login gagal');
    }
    const data = await res.json();
    localStorage.setItem('authToken', data.token);
    const decoded = parseJwt(data.token);
    setUser({ id: data.user.id, email: data.user.email, name: data.user.name, isAdmin: decoded?.isAdmin });
    setToken(data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${BACKEND}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registrasi gagal');
    }
    const data = await res.json();
    localStorage.setItem('authToken', data.token);
    const decoded = parseJwt(data.token);
    setUser({ id: data.user.id, email: data.user.email, name: data.user.name, isAdmin: decoded?.isAdmin });
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
