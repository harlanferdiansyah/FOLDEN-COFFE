'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { formatRupiah } from '@/app/utils/formatPrice';
import { useCart } from '@/app/context/CartContext';
import { Product } from '@/app/components/ProductCard';

const BACKEND = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://backend-six-sooty-55.vercel.app'
  : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');

const SIZES = [
  { label: 'Small', extra: 0 },
  { label: 'Medium', extra: 5000 },
  { label: 'Large', extra: 10000 },
];

const SAMPLE: Record<number, Product> = {
  1: { id: 1, name: 'Espresso Classic', price: 25000, imageUrl: '/coffee-espresso.jpg', category: 'Espresso', description: 'Shot espresso pekat dengan crema sempurna. Bold, powerful, dan membangunkan hari Anda. Dibuat dari biji Arabica premium single origin Sumatera Utara dengan kadar air yang sempurna.' },
  2: { id: 2, name: 'Cappuccino', price: 35000, imageUrl: '/coffee-cappuccino.jpg', category: 'Milk Based', description: 'Perpaduan espresso, steamed milk, dan foam yang harmonis dan memanjakan. Rasio 1:1:1 yang sempurna antara espresso, milk, dan foam.' },
  3: { id: 3, name: 'Latte', price: 30000, imageUrl: '/coffee-latte.jpg', category: 'Milk Based', description: 'Lembut, creamy, dengan latte art indah yang memanjakan mata. Susu segar dari peternak lokal dipadukan dengan espresso double shot kami.' },
  4: { id: 4, name: 'Cold Brew', price: 32000, imageUrl: '/coffee-coldbrew.jpg', category: 'Cold Coffee', description: 'Diseduh dingin 12 jam penuh, menghasilkan kopi yang smooth dan rendah asam. Kesegaran dalam setiap tegukan tanpa rasa pahit berlebih.' },
  5: { id: 5, name: 'Matcha Latte', price: 38000, imageUrl: '/coffee-matcha.jpg', category: 'Non Coffee', description: 'Matcha premium grade ceremonial dari Kyoto, Jepang, dipadukan dengan susu segar. Sehat, enak, dan aesthetic sempurna.' },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const id = Number(params.id);

  useEffect(() => {
    fetch(`${BACKEND}/api/coffee/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) setProduct(data);
        else setProduct(SAMPLE[id] ?? null);
      })
      .catch(() => setProduct(SAMPLE[id] ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price + selectedSize.extra,
      imageUrl: product.imageUrl || '/coffee-hero.jpg',
      size: selectedSize.label,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Navbar />
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>Memuat...</p>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <Navbar />
      <p style={{ color: 'var(--color-cream)', fontSize: '1.2rem' }}>Produk tidak ditemukan</p>
      <Link href="/menu" className="btn-primary">Kembali ke Menu</Link>
    </div>
  );

  const totalPrice = (product.price + selectedSize.extra) * qty;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '110px 2rem 4rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/menu" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Menu</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-amber-light)' }}>{product.name}</span>
        </nav>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }}
          className="detail-grid"
        >
          {/* Image */}
          <div className="animate-fade-up" style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}>
              <Image
                src={product.imageUrl || '/coffee-hero.jpg'}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            {product.category && (
              <div className="badge badge-amber" style={{ position: 'absolute', top: '1.25rem', left: '1.25rem' }}>
                {product.category}
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="animate-fade-up animate-delay-1">
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--color-cream)',
              marginBottom: '0.5rem',
              lineHeight: 1.2,
            }}>
              {product.name}
            </h1>
            <div className="divider" />
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, fontSize: '0.98rem', marginBottom: '2rem' }}>
              {product.description || 'Minuman kopi premium dari biji terpilih.'}
            </p>

            {/* Price */}
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Harga mulai dari</p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'var(--color-amber-light)',
              }}>
                {formatRupiah(product.price)}
              </p>
            </div>

            {/* Size selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <p style={{ color: 'var(--color-cream)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Pilih Ukuran
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {SIZES.map(size => (
                  <button
                    key={size.label}
                    id={`size-${size.label.toLowerCase()}`}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '0.6rem',
                      border: selectedSize.label === size.label
                        ? '2px solid var(--color-amber)' : '1.5px solid rgba(255,255,255,0.12)',
                      background: selectedSize.label === size.label
                        ? 'rgba(212,136,46,0.15)' : 'rgba(255,255,255,0.04)',
                      color: selectedSize.label === size.label ? 'var(--color-amber-light)' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: selectedSize.label === size.label ? 600 : 400,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>{size.label}</div>
                    {size.extra > 0 && <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>+{formatRupiah(size.extra)}</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: 'var(--color-cream)', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                Jumlah
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  id="qty-minus"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: '38px', height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--color-text)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >−</button>
                <span style={{ color: 'var(--color-cream)', fontWeight: 700, fontSize: '1.2rem', minWidth: '30px', textAlign: 'center' }}>
                  {qty}
                </span>
                <button
                  id="qty-plus"
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: '38px', height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--color-text)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >+</button>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  = {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            {/* Add to cart */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                className={added ? '' : 'btn-primary'}
                style={{
                  flex: 1,
                  fontSize: '1rem',
                  padding: '0.875rem 1.5rem',
                  background: added ? 'rgba(34, 197, 94, 0.15)' : undefined,
                  color: added ? '#22c55e' : undefined,
                  border: added ? '1.5px solid #22c55e' : undefined,
                  borderRadius: added ? '2rem' : undefined,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {added ? '✓ Ditambahkan ke Keranjang!' : '🛒 Tambah ke Keranjang'}
              </button>
              <Link href="/cart" className="btn-outline" style={{ padding: '0.875rem 1.5rem', fontSize: '0.9rem' }}>
                Lihat Keranjang
              </Link>
            </div>

            {/* Info tags */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              {['🌱 Bahan Organik', '⚗️ Artisan Roasted', '🚀 Pengiriman Cepat'].map(tag => (
                <span key={tag} style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.8rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '1rem',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
