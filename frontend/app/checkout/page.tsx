'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { formatRupiah } from '@/app/utils/formatPrice';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ name: user?.name || '', phone: '', address: '', city: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('GOPAY'); // default method

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '80vh', gap: '1rem', textAlign: 'center',
        }}>
          <p style={{ fontSize: '4rem' }}>🛒</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-cream)' }}>
            Keranjang Kosong
          </h2>
          <Link href="/menu" className="btn-primary">Kembali ke Menu</Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '80vh', gap: '1rem', textAlign: 'center',
        }}>
          <p style={{ fontSize: '4rem' }}>🔐</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-cream)' }}>
            Masuk Terlebih Dahulu
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Kamu perlu login untuk melanjutkan checkout.</p>
          <Link href="/login" className="btn-primary">Login Sekarang</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };



  // Helper to wait for Midtrans Snap to be ready
  const waitForSnap = (): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).snap) {
        resolve();
        return;
      }
      // Poll for snap up to 10 seconds
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if ((window as any).snap) {
          clearInterval(interval);
          resolve();
        } else if (attempts >= 50) {
          clearInterval(interval);
          resolve(); // resolve anyway, will fail gracefully
        }
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        items: items.map(i => ({
          productId: i.id,
          quantity: i.quantity,
          price: i.price,
          size: i.size,
        })),
        total: totalPrice,
        deliveryInfo: { ...form },
        paymentMethod,
      };

      // Place order via backend
      const res = await fetch(`${BACKEND}/api/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();

        // If Midtrans snap token returned, open snap
        if (data.snapToken) {
          await waitForSnap();
          if (typeof window !== 'undefined' && (window as any).snap) {
            (window as any).snap.pay(data.snapToken, {
              onSuccess: () => router.push('/orders?status=success'),
              onPending: () => router.push('/orders?status=pending'),
              onError: () => {
                setError('Pembayaran gagal. Silakan coba lagi.');
                setLoading(false);
              },
              onClose: () => router.push('/orders'),
            });
          } else {
            // Fallback: Snap not loaded
            router.push('/orders?status=success');
          }
        } else {
          router.push('/orders?status=success');
        }
      } else {
        const errData = await res.json().catch(() => ({ error: 'Gagal membuat pesanan' }));
        setError(errData.error || 'Gagal membuat pesanan');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    } finally {
      // Don't set loading false here if Snap is still open; Snap handles its own UI
      if (!(window as any)?.snap) {
        setLoading(false);
      }
    }
  };

  const shipping = 0; // free shipping
  const total = totalPrice + shipping;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '110px 2rem 4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cream)', marginBottom: '0.5rem' }}>
          Checkout
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
          Isi detail pengiriman untuk menyelesaikan pesanan
        </p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.875rem 1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }} className="checkout-grid">
            {/* Form */}
            <div className="glass" style={{ padding: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                📍 Detail Pengiriman
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>Nama Penerima *</label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Nama lengkap"
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>No. HP *</label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="08xxxxxxxxxx"
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>Alamat *</label>
                  <input
                    id="checkout-address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Jl. Nama Jalan No. xx"
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>Kota *</label>
                  <input
                    id="checkout-city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Jakarta"
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>Catatan (opsional)</label>
                  <textarea
                    id="checkout-notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Misal: tanpa gula, tambah es..."
                    className="input-field"
                    style={{ resize: 'vertical', minHeight: '80px' }}
                  />
                </div>
                {/* Payment Method */}
                <div>
                  <label style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>Metode Pembayaran</label>
                  <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="input-field"
                  >
                    <option value="GOPAY">GoPay</option>
                    <option value="DANA">Dana</option>
                    <option value="SHOPEEPAY">ShopeePay</option>
                    <option value="QRIS">QRIS</option>
                    <option value="ATM">ATM Transfer</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div className="glass" style={{ padding: '1.75rem', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                  🛒 Ringkasan Pesanan
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <Image src={item.imageUrl || '/coffee-hero.jpg'} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</p>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{item.size && `${item.size} · `}×{item.quantity}</p>
                      </div>
                      <span style={{ color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 600 }}>
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Subtotal</span>
                    <span style={{ color: 'var(--color-text)', fontSize: '0.88rem' }}>{formatRupiah(totalPrice)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Ongkir</span>
                    <span style={{ color: '#22c55e', fontSize: '0.88rem' }}>Gratis 🎉</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: 'var(--color-cream)', fontWeight: 700 }}>Total</span>
                    <span style={{ color: 'var(--color-amber-light)', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
                      {formatRupiah(total)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                id="pay-btn"
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  fontSize: '1rem',
                  padding: '1rem',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '⏳ Memproses...' : '💳 Bayar Sekarang'}
              </button>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem' }}>
                🔒 Pembayaran aman dengan Midtrans
              </p>
            </div>
          </div>
        </form>
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
