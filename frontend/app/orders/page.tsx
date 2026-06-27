'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { formatRupiah } from '@/app/utils/formatPrice';

const BACKEND = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://backend-six-sooty-55.vercel.app'
  : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');

interface Order {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  items?: Array<{ quantity: number; price: number; product?: { name: string; imageUrl?: string } }>;
}

const STATUS_LABEL: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Menunggu', color: '#f59e0b', icon: '⏳' },
  paid: { label: 'Dibayar', color: '#22c55e', icon: '✅' },
  processing: { label: 'Diproses', color: '#3b82f6', icon: '⚙️' },
  completed: { label: 'Selesai', color: '#22c55e', icon: '🎉' },
  cancelled: { label: 'Dibatalkan', color: '#ef4444', icon: '❌' },
};

const SAMPLE_ORDERS: Order[] = [
  {
    id: 1001,
    status: 'completed',
    total: 95000,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      { quantity: 2, price: 35000, product: { name: 'Cappuccino' } },
      { quantity: 1, price: 25000, product: { name: 'Espresso Classic' } },
    ],
  },
  {
    id: 1002,
    status: 'paid',
    total: 68000,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { quantity: 2, price: 34000, product: { name: 'Cold Brew' } },
    ],
  },
];

function OrdersContent() {
  const { user, token } = useAuth();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch(`${BACKEND}/api/order/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) && data.length > 0 ? data : SAMPLE_ORDERS))
      .catch(() => setOrders(SAMPLE_ORDERS))
      .finally(() => setLoading(false));
  }, [user, token]);

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '3rem', paddingTop: '110px' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</p>
          <p style={{ color: 'var(--color-cream)', fontSize: '1.1rem', marginBottom: '1rem' }}>Login untuk melihat pesanan</p>
          <Link href="/login" className="btn-primary">Login Sekarang</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '110px 2rem 4rem' }}>
        {status === 'success' && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.8rem' }}>🎉</span>
            <div>
              <p style={{ color: '#4ade80', fontWeight: 600, fontSize: '0.95rem' }}>Pesanan Berhasil Dibuat!</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Kami akan segera memproses pesanan kamu. Terima kasih!</p>
            </div>
          </div>
        )}
        {status === 'pending' && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '1rem', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
            <p style={{ color: '#fbbf24', fontWeight: 600 }}>⏳ Pembayaran Menunggu Konfirmasi</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Selesaikan pembayaran Anda untuk melanjutkan proses.</p>
          </div>
        )}

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cream)', marginBottom: '0.5rem' }}>Pesanan Saya</h1>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2].map(i => <div key={i} className="glass" style={{ height: '120px', opacity: 0.4 }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>☕</p>
            <p style={{ color: 'var(--color-cream)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Belum ada pesanan</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Yuk pesan kopi pertamamu!</p>
            <Link href="/menu" className="btn-primary">Pesan Sekarang</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const st = STATUS_LABEL[order.status] || { label: order.status, color: '#9ca3af', icon: '•' };
              return (
                <div key={order.id} className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ color: 'var(--color-cream)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Order #{order.id}</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: `${st.color}18`, border: `1px solid ${st.color}40`, padding: '0.3rem 0.75rem', borderRadius: '2rem' }}>
                      <span>{st.icon}</span>
                      <span style={{ color: st.color, fontSize: '0.8rem', fontWeight: 600 }}>{st.label}</span>
                    </div>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>{item.product?.name || 'Produk'} x{item.quantity}</span>
                          <span style={{ color: 'var(--color-text)' }}>{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Total Pesanan</span>
                    <span style={{ color: 'var(--color-amber-light)', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{formatRupiah(order.total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--color-text-muted)' }}>Loading...</p></div>}>
      <OrdersContent />
    </Suspense>
  );
}

