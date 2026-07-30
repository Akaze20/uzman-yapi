'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../admin.module.css';

interface Service {
  id: number;
  slug: string;
  title_tr: string;
  title_en: string;
  image: string | null;
  order: number;
}

export default function AdminServices() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm(t('confirmDeleteService'))) return;
    
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.dashboardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>{t('services')}</h1>
          <p>{t('serviceListDesc')}</p>
        </div>
        <Link href="/admin/services/new" className="btn btn-primary">
          + {t('newService')}
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>{t('loading')}</p>
        ) : services.length === 0 ? (
          <p>{t('noServices')}</p>
        ) : (
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border)'}}>
                <th style={{padding: '1rem'}}>{t('id')}</th>
                <th style={{padding: '1rem'}}>Görsel</th>
                <th style={{padding: '1rem'}}>Slug / Kategori</th>
                <th style={{padding: '1rem'}}>Başlık (TR)</th>
                <th style={{padding: '1rem'}}>Başlık (EN)</th>
                <th style={{padding: '1rem'}}>Sıra</th>
                <th style={{padding: '1rem'}}>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => ( s && (
                <tr key={s.id} style={{borderBottom: '1px solid var(--border)'}}>
                  <td style={{padding: '1rem'}}>{s.id}</td>
                  <td style={{padding: '1rem'}}>
                    {s.image ? (
                      <img 
                        src={s.image} 
                        alt={s.title_tr} 
                        style={{width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)'}} 
                      />
                    ) : (
                      <div style={{
                        width: '60px', 
                        height: '40px', 
                        background: 'linear-gradient(135deg, rgba(229,57,53,0.1) 0%, rgba(0,0,0,0.5) 100%)', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}>
                        Yok
                      </div>
                    )}
                  </td>
                  <td style={{padding: '1rem'}}><code style={{backgroundColor: 'var(--secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px'}}>{s.slug}</code></td>
                  <td style={{padding: '1rem'}}>{s.title_tr}</td>
                  <td style={{padding: '1rem'}}>{s.title_en}</td>
                  <td style={{padding: '1rem'}}>{s.order}</td>
                  <td style={{padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <Link href={`/admin/services/${s.id}`} style={{color: 'var(--accent)', fontWeight: 'bold'}}>
                      {isTr ? 'Düzenle' : 'Edit'}
                    </Link>
                    <span style={{color: 'var(--border)'}}>|</span>
                    <button onClick={() => deleteService(s.id)} style={{color: 'red', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold', padding: 0}}>
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
