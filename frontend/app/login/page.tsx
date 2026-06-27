// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 shadow-lg w-96">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Login to Folden Coffe</h1>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="rounded px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="rounded px-3 py-2 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
}
