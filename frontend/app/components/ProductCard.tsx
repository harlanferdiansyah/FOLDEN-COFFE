'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatRupiah } from '@/app/utils/formatPrice';
import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inStock?: boolean;
};

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '/coffee-hero.jpg',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/menu/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="glass"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          height: '100%',
          position: 'relative',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 48px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)';
        }}
      >
        {/* Out of stock overlay */}
        {product.inStock === false && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'inherit',
          }}>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem 1rem', borderRadius: '2rem' }}>
              Habis
            </span>
          </div>
        )}

        {/* Image */}
        <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
          <Image
            src={product.imageUrl || '/coffee-hero.jpg'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* Category badge */}
          {product.category && (
            <div style={{
              position: 'absolute', top: '0.75rem', left: '0.75rem',
              background: 'rgba(13,10,8,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(212,136,46,0.3)',
              color: 'var(--color-amber-light)',
              padding: '0.2rem 0.65rem',
              borderRadius: '1rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {product.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--color-cream)',
            lineHeight: 1.3,
          }}>
            {product.name}
          </h3>
          {product.description && (
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.82rem',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {product.description}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-amber-light)',
            }}>
              {formatRupiah(product.price)}
            </span>
            {showAddToCart && product.inStock !== false && (
              <button
                id={`add-cart-${product.id}`}
                onClick={handleAdd}
                style={{
                  background: added
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'linear-gradient(135deg, var(--color-amber), var(--color-gold))',
                  color: added ? '#22c55e' : 'var(--bg-primary)',
                  border: added ? '1px solid #22c55e' : 'none',
                  borderRadius: '2rem',
                  padding: '0.4rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {added ? '✓ Ditambah' : '+ Keranjang'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
