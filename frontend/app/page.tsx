'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard, { Product } from '@/app/components/ProductCard';
import { useEffect, useState } from 'react';
import { formatRupiah } from '@/app/utils/formatPrice';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const testimonials = [
  { name: 'Rina Andita', text: 'Kopinya luar biasa! Espresso paling nikmat yang pernah aku coba. Wajib datang lagi!', rating: 5, avatar: '👩' },
  { name: 'Budi Santoso', text: 'Suasana cozy, kopi berkualitas, dan pelayanan ramah. Jadi langganan tetap sejak setahun lalu.', rating: 5, avatar: '👨' },
  { name: 'Sari Dewi', text: 'Matcha latte-nya addictive banget. Bahan-bahannya fresh dan rasanya konsisten.', rating: 5, avatar: '👩‍🦱' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND}/api/coffee`)
      .then(r => r.json())
      .then(data => {
        setFeaturedProducts(Array.isArray(data) ? data.slice(0, 3) : []);
      })
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 2rem',
        }}
      >
        {/* Background gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 50%, rgba(107,58,31,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,136,46,0.15) 0%, transparent 50%)',
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '15%', right: '8%',
          width: '420px', height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,136,46,0.12) 0%, transparent 70%)',
          animation: 'pulse-amber 4s ease-in-out infinite',
        }} />

        <div style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          paddingTop: '5rem',
          position: 'relative',
          zIndex: 1,
        }}
          className="hero-grid"
        >
          {/* Left text */}
          <div className="animate-fade-up">
            <div className="badge badge-amber" style={{ marginBottom: '1.5rem' }}>
              ✦ Premium Coffee Experience
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: 'var(--color-cream)',
              marginBottom: '1.5rem',
            }}>
              Rasakan Seni{' '}
              <span style={{
                background: 'linear-gradient(135deg, #f5a623, #c9963a, #f5e6d0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Kopi Sejati
              </span>
            </h1>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
              maxWidth: '440px',
            }}>
              Setiap tegukan adalah cerita. Biji kopi terpilih dari perkebunan terbaik, disajikan dengan passion oleh barista kami.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/menu" className="btn-primary" id="hero-menu-btn" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Jelajahi Menu ↗
              </Link>
              <Link href="#story" className="btn-outline" id="hero-story-btn" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Tentang Kami
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { val: '9', label: 'Menu Kopi' },
                { val: '10', label: 'Pelanggan' },
                { val: '5★', label: 'Rating' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-amber-light)' }}>{s.val}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right image */}
          <div className="animate-fade-up animate-delay-2" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              position: 'relative',
              width: '420px',
              height: '480px',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,136,46,0.15)',
            }}>
              <Image
                src="/coffee-hero.jpg"
                alt="Kopi Premium Folden Coffe"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, transparent 60%, rgba(13,10,8,0.5))',
              }} />
            </div>

            {/* Floating card */}
            <div className="glass animate-fade-up animate-delay-3" style={{
              position: 'absolute',
              bottom: '40px',
              left: '-20px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '200px',
            }}>
              <span style={{ fontSize: '2rem' }}>☕</span>
              <div>
                <p style={{ color: 'var(--color-cream)', fontWeight: 600, fontSize: '0.9rem' }}>Baru Diseduh</p>
                <p style={{ color: 'var(--color-amber-light)', fontSize: '0.8rem' }}>Espresso Speciale</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          opacity: 0.5,
          animation: 'fadeUp 1s ease 1s both',
        }}>
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--color-amber), transparent)' }} />
        </div>
      </section>

      {/* Story Section */}
      <section id="story" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}
          className="hero-grid"
        >
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              height: '400px',
              position: 'relative',
              boxShadow: 'var(--shadow-card)',
            }}>
              <Image src="/coffee-espresso.jpg" alt="Proses kopi Folden" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="glass" style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              padding: '1.25rem',
              textAlign: 'center',
              width: '120px',
            }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-amber-light)' }}>8+</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Tahun Berpengalaman</p>
            </div>
          </div>
          <div>
            <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>Cerita Kami</div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Dari Biji ke Cangkir</h2>
            <div className="divider" />
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '1.25rem' }}>
              Folden Coffe lahir dari kecintaan mendalam pada seni kopi. Kami percaya bahwa secangkir kopi yang sempurna dimulai dari pemilihan biji yang teliti, proses roasting yang presisi, dan barista yang berdedikasi.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '2rem' }}>
              Setiap menu kami dikurasi dengan cermat, menggabungkan cita rasa lokal Indonesia dengan teknik kopi internasional untuk pengalaman yang tak terlupakan.
            </p>
            <Link href="/menu" className="btn-primary">Lihat Menu Lengkap</Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{
        padding: '5rem 2rem',
        background: 'rgba(0,0,0,0.3)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>Menu Unggulan</div>
            <h2 className="section-title">Pilihan Terbaik Kami</h2>
            <div className="divider" style={{ margin: '0.75rem auto 0' }} />
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="product-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass" style={{ height: '360px', opacity: 0.4 }}>
                  <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)' }} />
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ height: '1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '0.5rem', width: '70%' }} />
                    <div style={{ height: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', width: '90%' }} />
                    <div style={{ height: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="product-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            /* Fallback sample products */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="product-grid">
              {[
                { id: 1, name: 'Espresso Classic', price: 25000, imageUrl: '/coffee-espresso.jpg', category: 'Espresso', description: 'Shot espresso pekat dengan crema sempurna, bold dan powerful.' },
                { id: 2, name: 'Cappuccino', price: 35000, imageUrl: '/coffee-cappuccino.jpg', category: 'Milk Based', description: 'Perpaduan espresso, steamed milk, dan foam yang harmonis.' },
                { id: 3, name: 'Latte', price: 30000, imageUrl: '/coffee-latte.jpg', category: 'Milk Based', description: 'Lembut, creamy, dengan latte art yang memanjakan mata.' },
              ].map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/menu" className="btn-outline" id="view-all-menu-btn">
              Lihat Semua Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>Keunggulan Kami</div>
          <h2 className="section-title">Kenapa Folden Coffe?</h2>
          <div className="divider" style={{ margin: '0.75rem auto 0' }} />
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            { icon: '🌱', title: 'Biji Terpilih', desc: 'Biji kopi single origin dari petani lokal terbaik di Sumatera, Jawa, dan Sulawesi.' },
            { icon: '🔥', title: 'Roasting Artisan', desc: 'Proses roasting in-house dengan suhu presisi untuk mempertahankan profil rasa terbaik.' },
            { icon: '⚗️', title: 'Teknik Modern', desc: 'Barista bersertifikasi dengan peralatan espresso profesional grade.' },
            { icon: '🚀', title: 'Pengiriman Cepat', desc: 'Order online dan kopi segar tiba di pintu Anda dalam waktu 30 menit.' },
          ].map(item => (
            <div key={item.title} className="glass" style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ color: 'var(--color-cream)', fontWeight: 600, marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '5rem 2rem', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge badge-amber" style={{ marginBottom: '1rem' }}>Testimoni</div>
            <h2 className="section-title">Apa Kata Mereka</h2>
            <div className="divider" style={{ margin: '0.75rem auto 0' }} />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {testimonials.map((t) => (
              <div key={t.name} className="glass" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: 'var(--color-amber-light)', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ color: 'var(--color-text)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{t.avatar}</span>
                  <div>
                    <p style={{ color: 'var(--color-cream)', fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>Pelanggan Setia</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, rgba(107,58,31,0.4), rgba(61,31,10,0.6))',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(212,136,46,0.1) 0%, transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Siap Memesan Kopi Terbaik?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '2rem' }}>
            Order sekarang dan nikmati kopi premium langsung di rumah Anda.
          </p>
          <Link href="/menu" className="btn-primary" id="cta-order-btn" style={{ fontSize: '1rem', padding: '0.875rem 2.5rem' }}>
            Pesan Sekarang ☕
          </Link>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
