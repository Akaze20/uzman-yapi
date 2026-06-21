'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import styles from '../../admin.module.css';

export default function NewFaq() {
  const router = useRouter();
  const t = useTranslations('Admin');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    question_tr: '',
    question_en: '',
    answer_tr: '',
    answer_en: '',
    order: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
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
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1>{t('newFaq')}</h1>
        <p>Sitenize yeni bir sıkça sorulan soru ve cevabı ekleyin.</p>
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

          <button type="submit" disabled={loading} className="btn btn-primary" style={{marginTop: '1.5rem'}}>
            {loading ? t('loading') : t('saveFaq')}
          </button>
        </form>
      </div>
    </div>
  );
}
