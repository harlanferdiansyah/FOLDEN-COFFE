'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { formatRupiah } from '@/app/utils/formatPrice';
import { Product } from '@/app/components/ProductCard';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const CATEGORIES = ['Espresso', 'Milk Based', 'Cold Coffee', 'Non Coffee'];

const EMPTY_FORM = { name: '', description: '', price: '', imageUrl: '', category: 'Espresso', inStock: true };

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showMsg = (msg: string, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(null), 3000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(null), 3000); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/coffee`);
      const data = await res.json();
      setProducts(Array.isArray(data) && data.length > 0 ? data : SAMPLE_PRODUCTS);
    } catch {
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      imageUrl: p.imageUrl || '',
      category: p.category || 'Espresso',
      inStock: p.inStock !== false,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      imageUrl: form.imageUrl || '/coffee-hero.jpg',
      category: form.category,
      inStock: form.inStock,
    };
    try {
      const url = editId ? `${BACKEND}/api/coffee/${editId}` : `${BACKEND}/api/coffee`;
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showMsg(editId ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!');
        setShowForm(false);
        await fetchProducts();
      } else {
        // Demo mode: update local state
        if (editId) {
          setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...payload, id: editId } : p));
        } else {
          const newId = Math.max(...products.map(p => p.id), 0) + 1;
          setProducts(prev => [...prev, { ...payload, id: newId }]);
        }
        showMsg(editId ? 'Produk diupdate (demo)!' : 'Produk ditambahkan (demo)!');
        setShowForm(false);
      }
    } catch {
      if (editId) {
        setProducts(prev => prev.map(p => p.id === editId ? { ...p, ...payload, id: editId } : p));
      } else {
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        setProducts(prev => [...prev, { ...payload, id: newId }]);
      }
      showMsg(editId ? 'Produk diupdate (demo)!' : 'Produk ditambahkan (demo)!');
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${BACKEND}/api/coffee/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      // Whether or not backend succeeds, remove locally
      setProducts(prev => prev.filter(p => p.id !== id));
      showMsg('Produk berhasil dihapus!');
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id));
      showMsg('Produk dihapus (demo)!');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '110px 2rem 4rem' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          <Link href="/admin" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Admin</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-amber-light)' }}>Produk</span>
        </nav>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--color-cream)' }}>
              Kelola Produk
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>{products.length} produk terdaftar</p>
          </div>
          <button id="add-product-btn" onClick={openAdd} className="btn-primary">
            + Tambah Produk
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.875rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '0.875rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            ✓ {success}
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3].map(i => <div key={i} className="glass" style={{ height: '80px', opacity: 0.4 }} />)}
          </div>
        ) : (
          <div className="glass" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Produk', 'Kategori', 'Harga', 'Stok', 'Aksi'].map(h => (
                    <th key={h} style={{
                      padding: '1rem 1.25rem',
                      textAlign: 'left',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{
                    borderBottom: i < products.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                          <Image
                            src={p.imageUrl || '/coffee-hero.jpg'}
                            alt={p.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p style={{ color: 'var(--color-cream)', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</p>
                          {p.description && (
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px', textOverflow: 'ellipsis' }}>
                              {p.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        background: 'rgba(212,136,46,0.1)',
                        border: '1px solid rgba(212,136,46,0.2)',
                        color: 'var(--color-amber-light)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {p.category || 'Lainnya'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ color: 'var(--color-amber-light)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                        {formatRupiah(p.price)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        color: p.inStock !== false ? '#4ade80' : '#f87171',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}>
                        {p.inStock !== false ? '● Tersedia' : '● Habis'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          id={`edit-${p.id}`}
                          onClick={() => openEdit(p)}
                          style={{
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.3)',
                            color: '#60a5fa',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          id={`delete-${p.id}`}
                          onClick={() => setDeleteId(p.id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="glass" style={{
            width: '100%', maxWidth: '500px',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)', fontSize: '1.4rem' }}>
                {editId ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <button onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.3rem' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>Nama Produk *</label>
                <input id="form-name" required className="input-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Espresso Classic" />
              </div>
              <div>
                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>Deskripsi</label>
                <textarea id="form-desc" className="input-field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi produk..." style={{ resize: 'vertical', minHeight: '72px' }} />
              </div>
              <div>
                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>Harga (IDR) *</label>
                <input id="form-price" required type="number" min="0" className="input-field" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="25000" />
              </div>
              <div>
                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>URL Gambar</label>
                <input id="form-image" className="input-field" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="/coffee-espresso.jpg" />
              </div>
              <div>
                <label style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>Kategori</label>
                <select id="form-category" className="input-field" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ appearance: 'none' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input id="form-instock" type="checkbox" checked={form.inStock} onChange={e => setForm(f => ({ ...f, inStock: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-amber)', cursor: 'pointer' }} />
                <label htmlFor="form-instock" style={{ color: 'var(--color-text)', fontSize: '0.9rem', cursor: 'pointer' }}>Tersedia (in stock)</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1, fontSize: '0.9rem', padding: '0.75rem' }}>
                  Batal
                </button>
                <button id="form-submit" type="submit" className="btn-primary" disabled={saving} style={{ flex: 1, fontSize: '0.9rem', padding: '0.75rem', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Menyimpan...' : editId ? 'Update Produk' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId !== null && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div className="glass" style={{ width: '100%', maxWidth: '380px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
              Hapus Produk?
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setDeleteId(null)} className="btn-outline" style={{ flex: 1, fontSize: '0.9rem', padding: '0.75rem' }}>
                Batal
              </button>
              <button
                id="confirm-delete-btn"
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1,
                  background: 'rgba(239,68,68,0.15)',
                  border: '1.5px solid rgba(239,68,68,0.4)',
                  color: '#f87171',
                  padding: '0.75rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Sample for demo
const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: 'Espresso Classic', price: 25000, imageUrl: '/coffee-espresso.jpg', category: 'Espresso', description: 'Shot espresso pekat dengan crema sempurna.', inStock: true },
  { id: 2, name: 'Cappuccino', price: 35000, imageUrl: '/coffee-cappuccino.jpg', category: 'Milk Based', description: 'Espresso, steamed milk, dan foam.', inStock: true },
  { id: 3, name: 'Latte', price: 30000, imageUrl: '/coffee-latte.jpg', category: 'Milk Based', description: 'Lembut, creamy, dengan latte art.', inStock: true },
  { id: 4, name: 'Cold Brew', price: 32000, imageUrl: '/coffee-coldbrew.jpg', category: 'Cold Coffee', description: 'Diseduh dingin 12 jam.', inStock: true },
  { id: 5, name: 'Matcha Latte', price: 38000, imageUrl: '/coffee-matcha.jpg', category: 'Non Coffee', description: 'Matcha premium Jepang.', inStock: true },
];
