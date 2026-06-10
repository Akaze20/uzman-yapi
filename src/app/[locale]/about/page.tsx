import {getTranslations} from 'next-intl/server';
import styles from './page.module.css';
import { getSetting } from '@/lib/settings';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'About'});

  const aboutTitle = await getSetting(`about_title_${locale}`, t('title'));
  const aboutHistory = await getSetting(`about_history_${locale}`, t('history'));
  const aboutVision = await getSetting(`about_vision_${locale}`, t('vision'));

  return (
    <div className={`container ${styles.aboutPage}`}>
      <div className={styles.header}>
        <h1 className="animate-fade-in">{aboutTitle}</h1>
      </div>
      
      <div className={`glass-panel ${styles.contentBox} animate-fade-in`} style={{animationDelay: '0.05s'}}>
        <h2>Tarihçemiz</h2>
        <p>{aboutHistory}</p>
      </div>

      <div className={`glass-panel ${styles.contentBox} animate-fade-in`} style={{animationDelay: '0.1s', marginTop: '2rem'}}>
        <h2>Vizyonumuz</h2>
        <p>{aboutVision}</p>
      </div>
    </div>
  );
}
