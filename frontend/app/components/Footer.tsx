import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(0,0,0,0.6)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '3rem 2rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
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
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Kopi premium handcrafted dari biji terbaik dunia, disajikan dengan penuh cinta untuk para pecinta kopi sejati.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ color: 'var(--color-cream)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Navigasi
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Menu' },
                { href: '/cart', label: 'Keranjang' },
                { href: '/orders', label: 'Pesanan Saya' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-amber-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'var(--color-cream)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Kontak
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>📍 Jakarta, Indonesia</li>
              <li style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>📧 hello@foldencoffe.id</li>
              <li style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>📱 +62 812-3456-7890</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ color: 'var(--color-cream)', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>
              Jam Buka
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Senin – Jumat: 07:00 – 22:00</li>
              <li style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sabtu – Minggu: 08:00 – 23:00</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            © 2026 Folden Coffe. Semua hak dilindungi.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
            Made with ☕ & ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
