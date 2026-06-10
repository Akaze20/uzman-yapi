import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import styles from './admin.module.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Admin'});

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Uzman Yapı</h2>
              <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.7 }}>{t('title')}</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
        <nav className={styles.sidebarNav}>
          <Link href="/admin">{t('overview')}</Link>
          <Link href="/admin/projects">{t('projects')}</Link>
          <Link href="/admin/settings">{t('siteSettings')}</Link>
          <Link href="/" target="_blank">{t('goToSite')}</Link>
        </nav>
      </aside>
      <main className={styles.adminMain}>
        {children}
      </main>
    </div>
  );
}
