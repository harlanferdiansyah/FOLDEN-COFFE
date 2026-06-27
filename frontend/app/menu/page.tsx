'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard, { Product } from '@/app/components/ProductCard';

const BACKEND = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://backend-six-sooty-55.vercel.app'
  : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso Classic', price: 25000, imageUrl: '/coffee-espresso.jpg', category: 'Espresso', description: 'Shot espresso pekat dengan crema sempurna. Bold, powerful, dan membangunkan hari Anda.', inStock: true },
  { id: 2, name: 'Cappuccino', price: 35000, imageUrl: '/coffee-cappuccino.jpg', category: 'Milk Based', description: 'Perpaduan espresso, steamed milk, dan foam yang harmonis dan memanjakan.', inStock: true },
  { id: 3, name: 'Latte', price: 30000, imageUrl: '/coffee-latte.jpg', category: 'Milk Based', description: 'Lembut, creamy, dengan latte art indah. Pilihan sempurna untuk memulai hari.', inStock: true },
  { id: 4, name: 'Cold Brew', price: 32000, imageUrl: '/coffee-coldbrew.jpg', category: 'Cold Coffee', description: 'Diseduh dingin 12 jam, smooth dan rendah asam. Kesegaran dalam setiap tegukan.', inStock: true },
  { id: 5, name: 'Matcha Latte', price: 38000, imageUrl: '/coffee-matcha.jpg', category: 'Non Coffee', description: 'Matcha premium Jepang dengan susu segar. Sehat, enak, dan aesthetic.', inStock: true },
  { id: 6, name: 'Americano', price: 28000, imageUrl: '/coffee-espresso.jpg', category: 'Espresso', description: 'Espresso dicampur air panas, menghasilkan kopi yang kuat namun lebih mild.', inStock: true },
  { id: 7, name: 'Flat White', price: 33000, imageUrl: '/coffee-latte.jpg', category: 'Milk Based', description: 'Ristretto shots dengan microfoam susu creamy. Kuat tapi smooth.', inStock: true },
  { id: 8, name: 'Cold Matcha', price: 40000, imageUrl: '/coffee-matcha.jpg', category: 'Non Coffee', description: 'Matcha dingin dengan susu oat, disajikan dengan es yang menyegarkan.', inStock: true },
  { id: 9, name: 'Vietnamese Drip', price: 27000, imageUrl: '/coffee-coldbrew.jpg', category: 'Cold Coffee', description: 'Kopi robusta Vietnam yang khas, diseduh drip dengan kondensasi manis.', inStock: false },
];

const CATEGORIES = ['Semua', 'Espresso', 'Milk Based', 'Cold Coffee', 'Non Coffee'];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${BACKEND}/api/coffee`)
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) && data.length > 0 ? data : SAMPLE_PRODUCTS);
      })
      .catch(() => setProducts(SAMPLE_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = activeCategory === 'Semua' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        || (p.description || '').toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Header */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '3rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(107,58,31,0.3) 0%, transparent 60%)',
      }}>
        <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>Menu Lengkap</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          color: 'var(--color-cream)',
          marginBottom: '1rem',
        }}>
          Pilihan Kopi Kami
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Dari espresso klasik hingga kreasi modern, temukan kopi sempurna untuk setiap momen.
        </p>

        {/* Search */}
        <div style={{ maxWidth: '420px', margin: '0 auto', position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '1rem', top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem',
          }}>🔍</span>
          <input
            id="menu-search"
            type="text"
            placeholder="Cari kopi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </section>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
        padding: '0 2rem 2.5rem',
        flexWrap: 'wrap',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`cat-${cat.replace(' ', '-').toLowerCase()}`}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '2rem',
              border: activeCategory === cat ? '1.5px solid var(--color-amber)' : '1.5px solid rgba(255,255,255,0.1)',
              background: activeCategory === cat ? 'rgba(212,136,46,0.15)' : 'rgba(255,255,255,0.04)',
              color: activeCategory === cat ? 'var(--color-amber-light)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontWeight: activeCategory === cat ? 600 : 400,
              fontSize: '0.88rem',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass" style={{ height: '360px', opacity: 0.4 }}>
                <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ height: '1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '0.5rem', width: '70%' }} />
                  <div style={{ height: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }} />
                  <div style={{ height: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>☕</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem' }}>
              Tidak ada menu yang ditemukan.
            </p>
            <button onClick={() => { setSearch(''); setActiveCategory('Semua'); }}
              className="btn-outline" style={{ marginTop: '1.5rem' }}>
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Menampilkan {filtered.length} menu
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
