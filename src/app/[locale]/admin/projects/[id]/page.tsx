'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from '../../admin.module.css';

export default function EditProject({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const router = useRouter();
  const t = useTranslations('Admin');
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState<Record<number, boolean>>({});
  const [form, setForm] = useState({
    title_tr: '',
    title_en: '',
    desc_tr: '',
    desc_en: '',
    image: ''
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) {
        alert(t('errorOccurred'));
        router.push('/admin/projects');
        return;
      }
      const data = await res.json();
      setForm({
        title_tr: data.title_tr || '',
        title_en: data.title_en || '',
        desc_tr: data.desc_tr || '',
        desc_en: data.desc_en || '',
        image: data.image || ''
      });
      if (data.images) {
        setGalleryImages(data.images.split(',').map((img: string) => img.trim()).filter(Boolean));
      }
    } catch (err) {
      console.error(err);
      alert(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddGalleryImage = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    const updatedUploading = { ...galleryUploading };
    delete updatedUploading[index];
    setGalleryUploading(updatedUploading);
  };

  const handleGalleryImageChange = (index: number, value: string) => {
    const updated = [...galleryImages];
    updated[index] = value;
    setGalleryImages(updated);
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

  const handleGalleryFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGalleryUploading(prev => ({ ...prev, [index]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        handleGalleryImageChange(index, data.url);
      } else {
        alert('Görsel yüklenirken bir hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      alert('Görsel yükleme hatası.');
    } finally {
      setGalleryUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleRemoveUploadedImage = () => {
    setForm(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...form,
        images: galleryImages.filter(img => img.trim() !== '').join(',')
      };

      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        router.push('/admin/projects');
      } else {
        alert(t('errorOccurred'));
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
        <h1>Proje Düzenle</h1>
        <p>Proje detaylarını, kapak ve galeri görsellerini güncelleyin.</p>
      </div>

      <div className={styles.card} style={{maxWidth: '800px'}}>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('titleTr')}</label>
              <input 
                required type="text" 
                value={form.title_tr} onChange={e => setForm({...form, title_tr: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('titleEn')}</label>
              <input 
                required type="text" 
                value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('descTr')}</label>
              <textarea 
                required rows={6}
                value={form.desc_tr} onChange={e => setForm({...form, desc_tr: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('descEn')}</label>
              <textarea 
                required rows={6}
                value={form.desc_en} onChange={e => setForm({...form, desc_en: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
            </div>
          </div>

          {/* Cover Photo File Upload */}
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>Kapak Görseli</label>
            
            {form.image ? (
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px' }}>
                <img 
                  src={form.image} 
                  alt="Kapak Önizleme" 
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
                  {uploading ? 'Yükleniyor...' : 'Kapak Görselini Bilgisayardan Seçmek İçin Buraya Tıklayın'}
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  PNG, JPG veya JPEG formatları desteklenir.
                </p>
              </div>
            )}
            
            {/* Optional URL input in case they want to link directly */}
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

          {/* Multiple Gallery Images section */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Galeri Görselleri (İlave Fotoğraflar)</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1rem' }}>
              {galleryImages.map((img, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.8rem', 
                  border: '1px dashed var(--border)', 
                  padding: '1rem', 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', minWidth: '80px' }}>Fotoğraf {index + 1}:</span>
                    
                    {img && (
                      <img 
                        src={img} 
                        alt={`Önizleme ${index + 1}`} 
                        style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} 
                      />
                    )}
                    
                    <input 
                      type="text" 
                      placeholder="Görsel URL veya bilgisayardan yükleyin..."
                      value={img} 
                      onChange={e => handleGalleryImageChange(index, e.target.value)}
                      style={{ flex: 1, padding: '0.6rem 0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                    
                    <button 
                      type="button" 
                      onClick={() => handleRemoveGalleryImage(index)}
                      style={{ 
                        padding: '0.6rem 1.2rem', 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Sil
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingLeft: '85px' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                      <button 
                        type="button"
                        style={{
                          padding: '0.4rem 1rem',
                          backgroundColor: 'var(--secondary)',
                          color: 'var(--primary)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        {galleryUploading[index] ? 'Yükleniyor...' : 'Bilgisayardan Seç'}
                      </button>
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={galleryUploading[index]}
                        onChange={e => handleGalleryFileUpload(index, e)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          opacity: 0,
                          cursor: 'pointer',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                    {galleryUploading[index] && <span style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Dosya yükleniyor, lütfen bekleyin...</span>}
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              onClick={handleAddGalleryImage}
              style={{ 
                padding: '0.6rem 1.2rem', 
                backgroundColor: 'var(--secondary)', 
                color: 'var(--primary)', 
                border: '1px solid var(--border)', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              + Fotoğraf Ekle
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{marginTop: '1.5rem'}}>
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
            <button 
              type="button" 
              onClick={() => router.push('/admin/projects')}
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
