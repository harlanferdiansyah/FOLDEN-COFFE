'use client';

import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/orders', label: 'Pesanan' },
  ];

  return (
    <nav
      id="navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(13,10,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.4rem' }}>☕</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #f5a623, #c9963a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Folden Coffe
          </span>
        </div>
      </Link>

      {/* Desktop Links */}
      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', alignItems: 'center' }}
          className="hidden-mobile">
        {navLinks.map(link => (
          <li key={link.href}>
            <Link href={link.href} style={{
              color: pathname === link.href ? 'var(--color-amber-light)' : 'var(--color-text)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.2s',
              borderBottom: pathname === link.href ? '2px solid var(--color-amber)' : '2px solid transparent',
              paddingBottom: '2px',
            }}>
              {link.label}
            </Link>
          </li>
        ))}
        {user?.isAdmin && (
          <li>
            <Link href="/admin" style={{
              color: 'var(--color-amber)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}>
              Admin
            </Link>
          </li>
        )}
      </ul>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Cart */}
        <Link href="/cart" id="cart-btn" style={{
          position: 'relative',
          textDecoration: 'none',
          color: 'var(--color-text)',
          fontSize: '1.3rem',
          padding: '0.4rem',
          borderRadius: '0.5rem',
          transition: 'color 0.2s',
          display: 'flex',
          alignItems: 'center',
        }}>
          🛒
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--color-amber)',
              color: 'var(--bg-primary)',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 700,
            }}>
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>

        {/* Auth */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Hi, {user.name?.split(' ')[0] || 'User'}
            </span>
            <button
              id="logout-btn"
              onClick={logout}
              className="btn-outline"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn-primary" id="login-btn"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
