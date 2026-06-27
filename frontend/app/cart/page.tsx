'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useCart } from '@/app/context/CartContext';
import { formatRupiah } from '@/app/utils/formatPrice';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          gap: '1.25rem',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '5rem', opacity: 0.4 }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-cream)' }}>
            Keranjang Kosong
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '360px' }}>
            Belum ada kopi yang kamu pilih. Yuk cari kopi favoritmu!
          </p>
          <Link href="/menu" className="btn-primary" id="go-to-menu-btn" style={{ marginTop: '0.5rem' }}>
            Jelajahi Menu ☕
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '110px 2rem 4rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-cream)' }}>
              Keranjang Kamu
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {totalItems} item dipilih
            </p>
          </div>
          <button
            id="clear-cart-btn"
            onClick={clearCart}
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            Hapus Semua
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }} className="cart-grid">
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item, idx) => (
              <div key={`${item.id}-${item.size ?? 'default'}`} className="glass" style={{ padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                {/* Image */}
                <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                  <Image
                    src={item.imageUrl || '/coffee-hero.jpg'}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>
                    {item.name}
                  </h3>
                  {item.size && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>Ukuran: {item.size}</p>
                  )}
                  <p style={{ color: 'var(--color-amber-light)', fontWeight: 700, fontSize: '0.95rem', marginTop: '0.25rem' }}>
                    {formatRupiah(item.price)}
                  </p>
                </div>

                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <button
                    id={`qty-minus-${idx}`}
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                    style={{
                      width: '30px', height: '30px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem',
                    }}
                  >−</button>
                  <span style={{ color: 'var(--color-cream)', fontWeight: 700, width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                  <button
                    id={`qty-plus-${idx}`}
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                    style={{
                      width: '30px', height: '30px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem',
                    }}
                  >+</button>
                </div>

                {/* Subtotal */}
                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <p style={{ color: 'var(--color-cream)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  id={`remove-${idx}`}
                  onClick={() => removeFromCart(item.id, item.size)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '0.25rem',
                    borderRadius: '0.25rem',
                    transition: 'color 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-cream)', marginBottom: '1.5rem' }}>
              Ringkasan Pesanan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.name} {item.size ? `(${item.size})` : ''} ×{item.quantity}</span>
                  <span style={{ color: 'var(--color-text)' }}>{formatRupiah(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Subtotal</span>
                <span style={{ color: 'var(--color-text)', fontSize: '0.9rem' }}>{formatRupiah(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Ongkir</span>
                <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>Gratis</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--color-cream)', fontWeight: 700, fontSize: '1rem' }}>Total</span>
                <span style={{ color: 'var(--color-amber-light)', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary" id="checkout-btn" style={{ display: 'block', textAlign: 'center', fontSize: '0.95rem', padding: '0.875rem' }}>
              Lanjut ke Pembayaran →
            </Link>
            <Link href="/menu" style={{
              display: 'block', textAlign: 'center', color: 'var(--color-text-muted)',
              fontSize: '0.85rem', marginTop: '1rem', textDecoration: 'none',
            }}>
              ← Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
