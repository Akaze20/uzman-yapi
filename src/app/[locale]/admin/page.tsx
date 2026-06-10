import {getTranslations} from 'next-intl/server';
import styles from './admin.module.css';

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Admin'});

  return (
    <div>
      <div className={styles.dashboardHeader}>
        <h1>{t('overview')}</h1>
        <p>Sitenizin içeriklerini buradan yönetebilirsiniz.</p>
      </div>

      <div className={styles.card}>
        <h3>{t('status')}</h3>
        <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>
          {t('statusDesc')}
          <br /><br />
          {t('mvpNotice')}
        </p>
      </div>
    </div>
  );
}
