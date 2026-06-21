'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../admin.module.css';

interface Faq {
  id: number;
  question_tr: string;
  question_en: string;
  order: number;
  createdAt: string;
}

export default function AdminFaqs() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaq = async (id: number) => {
    if (!confirm(t('confirmDeleteFaq'))) return;
    
    try {
      await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      fetchFaqs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.dashboardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>{t('faqs')}</h1>
          <p>{t('faqListDesc')}</p>
        </div>
        <Link href="/admin/faqs/new" className="btn btn-primary">
          + {t('newFaq')}
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>{t('loading')}</p>
        ) : faqs.length === 0 ? (
          <p>{t('noFaqs')}</p>
        ) : (
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border)'}}>
                <th style={{padding: '1rem'}}>{t('id')}</th>
                <th style={{padding: '1rem'}}>{t('faqQuestionTr')}</th>
                <th style={{padding: '1rem'}}>{t('faqQuestionEn')}</th>
                <th style={{padding: '1rem'}}>{t('faqOrder')}</th>
                <th style={{padding: '1rem'}}>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((f) => (
                <tr key={f.id} style={{borderBottom: '1px solid var(--border)'}}>
                  <td style={{padding: '1rem'}}>{f.id}</td>
                  <td style={{padding: '1rem'}}>{f.question_tr}</td>
                  <td style={{padding: '1rem'}}>{f.question_en}</td>
                  <td style={{padding: '1rem'}}>{f.order}</td>
                  <td style={{padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <Link href={`/admin/faqs/${f.id}`} style={{color: 'var(--accent)', fontWeight: 'bold'}}>
                      {isTr ? 'Düzenle' : 'Edit'}
                    </Link>
                    <span style={{color: 'var(--border)'}}>|</span>
                    <button onClick={() => deleteFaq(f.id)} style={{color: 'red', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold', padding: 0}}>
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
