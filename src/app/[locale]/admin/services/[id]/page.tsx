'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from '../../admin.module.css';

export default function EditService({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const router = useRouter();
  const t = useTranslations('Admin');
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    title_tr: '',
    title_en: '',
    desc_tr: '',
    desc_en: '',
    image: '',
    features_tr: '',
    features_en: '',
    metaTitle_tr: '',
    metaTitle_en: '',
    metaDesc_tr: '',
    metaDesc_en: '',
    order: 0
  });

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/services/${id}`);
      if (!res.ok) {
        alert(t('errorOccurred'));
        router.push('/admin/services');
        return;
      }
      const data = await res.json();
      setForm({
        slug: data.slug || '',
        title_tr: data.title_tr || '',
        title_en: data.title_en || '',
        desc_tr: data.desc_tr || '',
        desc_en: data.desc_en || '',
        image: data.image || '',
        features_tr: data.features_tr || '',
        features_en: data.features_en || '',
        metaTitle_tr: data.metaTitle_tr || '',
        metaTitle_en: data.metaTitle_en || '',
        metaDesc_tr: data.metaDesc_tr || '',
        metaDesc_en: data.metaDesc_en || '',
        order: data.order || 0
      });
    } catch (err) {
      console.error(err);
      alert(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
      } else {
        alert('Görsel yüklenirken bir hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      alert('Yükleme başarısız.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveUploadedImage = () => {
    setForm(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug.trim()) {
      alert('Kategori Slug adresi boş olamaz.');
      return;
    }
    setSaving(true);
    
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        router.push('/admin/services');
      } else {
        const errData = await res.json();
        alert(errData.error || t('errorOccurred'));
      }
    } catch (err) {
      console.error(err);
      alert(t('errorOccurred'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1>{t('editService')}</h1>
        <p>Hizmet alanı detaylarını, görselini ve özelliklerini güncelleyin.</p>
      </div>

      <div className={styles.card} style={{maxWidth: '800px'}}>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Hizmet Slug / Benzersiz Kodu</label>
              <input 
                required type="text" 
                placeholder="örn: alcipan, ses-yalitimi"
                value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '')})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
              <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Sadece küçük harf, rakam ve tire (-) içerebilir. Projelerle eşleşmede bu kod kullanılır.</span>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Sıralama Numarası</label>
              <input 
                required type="number" 
                value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value, 10) || 0})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Hizmet Adı (TR)</label>
              <input 
                required type="text" 
                placeholder="Alçıpan ve Asma Tavan..."
                value={form.title_tr} onChange={e => setForm({...form, title_tr: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Hizmet Adı (EN)</label>
              <input 
                required type="text" 
                placeholder="Drywall & Suspended Ceiling..."
                value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Açıklama (TR)</label>
              <textarea 
                required rows={5}
                placeholder="Hizmet hakkında detaylı açıklama..."
                value={form.desc_tr} onChange={e => setForm({...form, desc_tr: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Açıklama (EN)</label>
              <textarea 
                required rows={5}
                placeholder="Detailed description in English..."
                value={form.desc_en} onChange={e => setForm({...form, desc_en: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
            </div>
          </div>

          {/* Features Input: Textarea splitting by newline */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Hizmet Özellikleri (TR)</label>
              <textarea 
                rows={5}
                placeholder="Örn:&#10;Bölme Duvar Sistemleri&#10;Metal Asma Tavan Yapımı&#10;Boya Badana İşleri"
                value={form.features_tr} onChange={e => setForm({...form, features_tr: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
              <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Her satıra bir özellik yazın.</span>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Hizmet Özellikleri (EN)</label>
              <textarea 
                rows={5}
                placeholder="Örn:&#10;Partition Wall Systems&#10;Metal Suspended Ceiling&#10;Gypsum Plastering"
                value={form.features_en} onChange={e => setForm({...form, features_en: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
              <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Her satıra bir özellik yazın.</span>
            </div>
          </div>

          {/* Photo File Upload */}
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Hizmet Görseli</label>
            
            {form.image ? (
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px' }}>
                <img 
                  src={form.image} 
                  alt="Hizmet Önizleme" 
                  style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} 
                />
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'green', fontWeight: '500', marginBottom: '0.5rem' }}>Görsel Yüklendi ✓</p>
                  <button 
                    type="button" 
                    onClick={handleRemoveUploadedImage}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#ef4444', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Görseli Kaldır
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ 
                border: '2px dashed var(--border)', 
                padding: '2rem', 
                borderRadius: '12px', 
                textAlign: 'center', 
                backgroundColor: 'var(--secondary)',
                position: 'relative'
              }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    opacity: 0, 
                    cursor: 'pointer' 
                  }} 
                />
                <p style={{ margin: 0, fontWeight: '500' }}>
                  {uploading ? 'Yükleniyor...' : 'Hizmet Görselini Bilgisayardan Seçmek İçin Buraya Tıklayın'}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  PNG, JPG veya JPEG formatları desteklenir. Eski simge ikonları kaldırılıp bu görsel kullanılacaktır.
                </p>
              </div>
            )}
            
            <div style={{ marginTop: '0.8rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Veya doğrudan görsel URL'si girin:</span>
              <input 
                type="text" 
                placeholder="https://..."
                value={form.image} 
                onChange={e => setForm({...form, image: e.target.value})}
                style={{width: '100%', padding: '0.6rem 0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem', marginTop: '0.4rem'}}
              />
            </div>
          </div>

          {/* SEO Metadata Fields */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Arama Motoru Optimizasyonu (SEO) Bilgileri</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>SEO Başlığı (TR)</label>
                <input 
                  type="text" 
                  placeholder="İstanbul Alçıpan Ustası & Asma Tavan Yapımı"
                  value={form.metaTitle_tr} onChange={e => setForm({...form, metaTitle_tr: e.target.value})}
                  style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>SEO Başlığı (EN)</label>
                <input 
                  type="text" 
                  placeholder="Istanbul Drywall Installer & Suspended Ceilings"
                  value={form.metaTitle_en} onChange={e => setForm({...form, metaTitle_en: e.target.value})}
                  style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
                />
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>SEO Açıklaması (TR)</label>
                <textarea 
                  rows={3}
                  placeholder="Arama sonuçlarında başlığın altında görünecek özet metin..."
                  value={form.metaDesc_tr} onChange={e => setForm({...form, metaDesc_tr: e.target.value})}
                  style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '500'}}>SEO Açıklaması (EN)</label>
                <textarea 
                  rows={3}
                  placeholder="SEO description in English..."
                  value={form.metaDesc_en} onChange={e => setForm({...form, metaDesc_en: e.target.value})}
                  style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{marginTop: '1.5rem'}}>
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/admin/services')}
              className="btn btn-secondary" 
              style={{marginTop: '1.5rem', border: '1px solid var(--border)'}}
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
