'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../admin.module.css';

interface Project {
  id: number;
  title_tr: string;
  title_en: string;
  createdAt: string;
}

export default function AdminProjects() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const isTr = locale === 'tr';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm(t('confirmDelete'))) return;
    
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.dashboardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>{t('projects')}</h1>
          <p>Tüm projeleri yönetin</p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-primary">
          + {t('newProject')}
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>{t('loading')}</p>
        ) : projects.length === 0 ? (
          <p>{t('noProjects')}</p>
        ) : (
          <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border)'}}>
                <th style={{padding: '1rem'}}>{t('id')}</th>
                <th style={{padding: '1rem'}}>{t('titleTr')}</th>
                <th style={{padding: '1rem'}}>{t('titleEn')}</th>
                <th style={{padding: '1rem'}}>{t('date')}</th>
                <th style={{padding: '1rem'}}>{t('action')}</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} style={{borderBottom: '1px solid var(--border)'}}>
                  <td style={{padding: '1rem'}}>{p.id}</td>
                  <td style={{padding: '1rem'}}>{p.title_tr}</td>
                  <td style={{padding: '1rem'}}>{p.title_en}</td>
                  <td style={{padding: '1rem'}}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <Link href={`/admin/projects/${p.id}`} style={{color: 'var(--accent)', fontWeight: 'bold'}}>
                      {isTr ? 'Düzenle' : 'Edit'}
                    </Link>
                    <span style={{color: 'var(--border)'}}>|</span>
                    <button onClick={() => deleteProject(p.id)} style={{color: 'red', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 'bold', padding: 0}}>
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
