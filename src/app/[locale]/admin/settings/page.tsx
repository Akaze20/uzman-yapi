'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../admin.module.css';

type ActiveTab = 'hero' | 'about' | 'contact';

export default function AdminSettings() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<ActiveTab>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    hero_title_tr: '',
    hero_title_en: '',
    hero_subtitle_tr: '',
    hero_subtitle_en: '',
    hero_cta_tr: '',
    hero_cta_en: '',
    home_about_title_tr: '',
    home_about_title_en: '',
    home_about_history_tr: '',
    home_about_history_en: '',
    home_about_vision_tr: '',
    home_about_vision_en: '',
    home_about_btn_tr: '',
    home_about_btn_en: '',
    home_projects_title_tr: '',
    home_projects_title_en: '',
    home_projects_btn_tr: '',
    home_projects_btn_en: '',
    home_projects_empty_tr: '',
    home_projects_empty_en: '',
    about_title_tr: '',
    about_title_en: '',
    about_history_tr: '',
    about_history_en: '',
    about_vision_tr: '',
    about_vision_en: '',
    contact_title_tr: '',
    contact_title_en: '',
    contact_address_tr: '',
    contact_address_en: '',
    contact_phone: '',
    contact_whatsapp: '',
    contact_email: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Ayarlar başarıyla kaydedildi!');
      } else {
        alert('Ayarlar kaydedilirken bir hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      alert('Sistem hatası!');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <p>{t('loading')}</p>;
  }

  const isTr = locale === 'tr';

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1>{t('siteSettings')} ({locale.toUpperCase()})</h1>
        <p>
          Sitenizdeki statik sayfaların yazılarını ve iletişim bilgilerini düzenleyin.
          Sol üstteki <strong>TR / EN</strong> seçeneğini değiştirerek ilgili dilin ayarlarını düzenleyebilirsiniz.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          type="button"
          onClick={() => setActiveTab('hero')} 
          style={{
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'hero' ? 'var(--accent)' : 'var(--border)',
            color: activeTab === 'hero' ? 'white' : 'var(--foreground)',
            fontWeight: '500',
            transition: 'all 0.3s'
          }}
        >
          Ana Sayfa (Hero)
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('about')} 
          style={{
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'about' ? 'var(--accent)' : 'var(--border)',
            color: activeTab === 'about' ? 'white' : 'var(--foreground)',
            fontWeight: '500',
            transition: 'all 0.3s'
          }}
        >
          Hakkımızda
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('contact')} 
          style={{
            padding: '0.8rem 1.5rem', 
            borderRadius: '8px', 
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'contact' ? 'var(--accent)' : 'var(--border)',
            color: activeTab === 'contact' ? 'white' : 'var(--foreground)',
            fontWeight: '500',
            transition: 'all 0.3s'
          }}
        >
          İletişim Bilgileri
        </button>
      </div>

      <div className={styles.card} style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2>Ana Sayfa Ayarları - {isTr ? 'Türkçe Ayarları' : 'English Settings'}</h2>
              
              {/* Giriş (Hero) Bölümü */}
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>1. Giriş Alanı (Hero)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Giriş Başlığı (TR)' : 'Hero Title (EN)'}
                    </label>
                    <input 
                      type="text" 
                      value={isTr ? settings.hero_title_tr : settings.hero_title_en} 
                      onChange={e => handleInputChange(isTr ? 'hero_title_tr' : 'hero_title_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Giriş Alt Başlığı (TR)' : 'Hero Subtitle (EN)'}
                    </label>
                    <textarea 
                      rows={4}
                      value={isTr ? settings.hero_subtitle_tr : settings.hero_subtitle_en} 
                      onChange={e => handleInputChange(isTr ? 'hero_subtitle_tr' : 'hero_subtitle_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Buton Metni (TR)' : 'CTA Button Text (EN)'}
                    </label>
                    <input 
                      type="text" 
                      value={isTr ? settings.hero_cta_tr : settings.hero_cta_en} 
                      onChange={e => handleInputChange(isTr ? 'hero_cta_tr' : 'hero_cta_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Kısa Tanıtım Bölümü */}
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>2. Kısa Hakkımızda Alanı (Giriş Altı)</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Bölüm Başlığı (TR)' : 'Section Title (EN)'}
                    </label>
                    <input 
                      type="text" 
                      value={isTr ? settings.home_about_title_tr : settings.home_about_title_en} 
                      onChange={e => handleInputChange(isTr ? 'home_about_title_tr' : 'home_about_title_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Bölüm Açıklaması (TR)' : 'Section Description (EN)'}
                    </label>
                    <textarea 
                      rows={5}
                      value={isTr ? settings.home_about_history_tr : settings.home_about_history_en} 
                      onChange={e => handleInputChange(isTr ? 'home_about_history_tr' : 'home_about_history_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Sağ Kutu / Vizyon Metni (TR)' : 'Right Box / Vision Text (EN)'}
                    </label>
                    <textarea 
                      rows={3}
                      value={isTr ? settings.home_about_vision_tr : settings.home_about_vision_en} 
                      onChange={e => handleInputChange(isTr ? 'home_about_vision_tr' : 'home_about_vision_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Detay Buton Metni (TR)' : 'More Button Text (EN)'}
                    </label>
                    <input 
                      type="text" 
                      value={isTr ? settings.home_about_btn_tr : settings.home_about_btn_en} 
                      onChange={e => handleInputChange(isTr ? 'home_about_btn_tr' : 'home_about_btn_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Öne Çıkan Projeler Bölümü */}
              <div>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>3. Projeler Önizleme Alanı</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Bölüm Başlığı (TR)' : 'Section Title (EN)'}
                    </label>
                    <input 
                      type="text" 
                      value={isTr ? settings.home_projects_title_tr : settings.home_projects_title_en} 
                      onChange={e => handleInputChange(isTr ? 'home_projects_title_tr' : 'home_projects_title_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? '"Tümünü Gör" Buton Metni (TR)' : '"View All" Button Text (EN)'}
                    </label>
                    <input 
                      type="text" 
                      value={isTr ? settings.home_projects_btn_tr : settings.home_projects_btn_en} 
                      onChange={e => handleInputChange(isTr ? 'home_projects_btn_tr' : 'home_projects_btn_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      {isTr ? 'Boş Liste Mesajı (TR)' : 'Empty List Message (EN)'}
                    </label>
                    <input 
                      type="text" 
                      value={isTr ? settings.home_projects_empty_tr : settings.home_projects_empty_en} 
                      onChange={e => handleInputChange(isTr ? 'home_projects_empty_tr' : 'home_projects_empty_en', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2>Hakkımızda Sayfa İçeriği - {isTr ? 'Türkçe Ayarları' : 'English Settings'}</h2>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {isTr ? 'Hakkımızda Sayfa Başlığı (TR)' : 'About Page Title (EN)'}
                </label>
                <input 
                  type="text" 
                  value={isTr ? settings.about_title_tr : settings.about_title_en} 
                  onChange={e => handleInputChange(isTr ? 'about_title_tr' : 'about_title_en', e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {isTr ? 'Tarihçemiz Metni (TR)' : 'History Text (EN)'}
                </label>
                <textarea 
                  rows={6}
                  value={isTr ? settings.about_history_tr : settings.about_history_en} 
                  onChange={e => handleInputChange(isTr ? 'about_history_tr' : 'about_history_en', e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {isTr ? 'Vizyonumuz Metni (TR)' : 'Vision Text (EN)'}
                </label>
                <textarea 
                  rows={4}
                  value={isTr ? settings.about_vision_tr : settings.about_vision_en} 
                  onChange={e => handleInputChange(isTr ? 'about_vision_tr' : 'about_vision_en', e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h2>İletişim Bilgileri - {isTr ? 'Türkçe Ayarları' : 'English Settings'}</h2>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {isTr ? 'İletişim Sayfa Başlığı (TR)' : 'Contact Page Title (EN)'}
                </label>
                <input 
                  type="text" 
                  value={isTr ? settings.contact_title_tr : settings.contact_title_en} 
                  onChange={e => handleInputChange(isTr ? 'contact_title_tr' : 'contact_title_en', e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  {isTr ? 'Fiziksel Adres (TR)' : 'Physical Address (EN)'}
                </label>
                <textarea 
                  rows={3}
                  value={isTr ? settings.contact_address_tr : settings.contact_address_en} 
                  onChange={e => handleInputChange(isTr ? 'contact_address_tr' : 'contact_address_en', e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Ortak İletişim Bilgileri (Global)</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Telefon Numarası</label>
                    <input 
                      type="text" 
                      value={settings.contact_phone} 
                      onChange={e => handleInputChange('contact_phone', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>WhatsApp Numarası</label>
                    <input 
                      type="text" 
                      placeholder="+90 530 123 45 67"
                      value={settings.contact_whatsapp} 
                      onChange={e => handleInputChange('contact_whatsapp', e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>E-posta Adresi</label>
                  <input 
                    type="email" 
                    value={settings.contact_email} 
                    onChange={e => handleInputChange('contact_email', e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={saving} 
            className="btn btn-primary" 
            style={{ marginTop: '1rem', alignSelf: 'flex-start', padding: '1rem 3rem' }}
          >
            {saving ? 'Kaydediliyor...' : t('saveProject')}
          </button>
        </form>
      </div>
    </div>
  );
}
