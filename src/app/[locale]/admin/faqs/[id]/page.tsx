'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from '../../admin.module.css';

export default function EditFaq({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const t = useTranslations('Admin');
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    question_tr: '',
    question_en: '',
    answer_tr: '',
    answer_en: '',
    order: 0
  });

  useEffect(() => {
    fetchFaq();
  }, [id]);

  const fetchFaq = async () => {
    try {
      const res = await fetch(`/api/faqs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          question_tr: data.question_tr,
          question_en: data.question_en,
          answer_tr: data.answer_tr,
          answer_en: data.answer_en,
          order: data.order
        });
      } else {
        alert(t('errorOccurred'));
        router.push('/admin/faqs');
      }
    } catch (err) {
      console.error(err);
      alert(t('errorOccurred'));
      router.push('/admin/faqs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        router.push('/admin/faqs');
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
      <div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1>{t('editFaq')}</h1>
        <p>Sıkça sorulan sorunun detaylarını güncelleyin.</p>
      </div>

      <div className={styles.card} style={{maxWidth: '800px'}}>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('faqQuestionTr')}</label>
              <input 
                required type="text" 
                value={form.question_tr} onChange={e => setForm({...form, question_tr: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('faqQuestionEn')}</label>
              <input 
                required type="text" 
                value={form.question_en} onChange={e => setForm({...form, question_en: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('faqAnswerTr')}</label>
              <textarea 
                required rows={6}
                value={form.answer_tr} onChange={e => setForm({...form, answer_tr: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('faqAnswerEn')}</label>
              <textarea 
                required rows={6}
                value={form.answer_en} onChange={e => setForm({...form, answer_en: e.target.value})}
                style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'inherit'}}
              />
            </div>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>{t('faqOrder')}</label>
            <input 
              type="number" 
              value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
              style={{width: '100%', padding: '0.8rem', border: '1px solid var(--border)', borderRadius: '8px'}}
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{marginTop: '1.5rem'}}>
            {saving ? t('loading') : t('saveFaq')}
          </button>
        </form>
      </div>
    </div>
  );
}
