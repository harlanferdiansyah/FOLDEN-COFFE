'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { formatRupiah } from '@/app/utils/formatPrice';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalProducts: 9, totalOrders: 42, totalRevenue: 2850000, pendingOrders: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) { setLoading(false); return; }
    fetch(`${BACKEND}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => data && setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token]);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</p>
          <p style={{ color: 'var(--color-cream)', fontSize: '1.2rem', marginBottom: '1rem' }}>Login diperlukan</p>
          <Link href="/login" className="btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '110px 2rem 4rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>Admin Panel</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cream)' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Selamat datang, {user.name || user.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {[
            { icon: '☕', label: 'Total Produk', value: stats.totalProducts, color: 'var(--color-amber-light)' },
            { icon: '📦', label: 'Total Pesanan', value: stats.totalOrders, color: '#60a5fa' },
            { icon: '💰', label: 'Total Revenue', value: formatRupiah(stats.totalRevenue), color: '#4ade80', large: true },
            { icon: '⏳', label: 'Pending Order', value: stats.pendingOrders, color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: s.large ? '1.3rem' : '1.8rem',
                fontWeight: 800,
                color: s.color,
                marginBottom: '0.25rem',
              }}>
                {s.value}
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
            Aksi Cepat
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { href: '/admin/products', icon: '☕', title: 'Kelola Produk', desc: 'Tambah, edit, hapus menu kopi' },
              { href: '/orders', icon: '📦', title: 'Lihat Pesanan', desc: 'Monitor semua pesanan masuk' },
              { href: '/menu', icon: '🌐', title: 'Lihat Website', desc: 'Preview tampilan untuk pelanggan' },
            ].map(action => (
              <Link key={action.href} href={action.href} style={{ textDecoration: 'none' }}>
                <div
                  className="glass"
                  style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                  }}
                >
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{action.icon}</div>
                  <h3 style={{ color: 'var(--color-cream)', fontWeight: 600, marginBottom: '0.25rem' }}>{action.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Note */}
        <div style={{
          background: 'rgba(212,136,46,0.08)',
          border: '1px solid rgba(212,136,46,0.2)',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
        }}>
          <strong style={{ color: 'var(--color-amber-light)' }}>ℹ️ Mode Demo:</strong> Statistik menggunakan data dummy saat backend tidak terhubung. Sambungkan backend MySQL untuk data real-time.
        </div>
      </div>

      <Footer />
    </div>
  );
}
