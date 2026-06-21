import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import styles from './services.module.css';
import { Layers, Flame, VolumeX, Paintbrush } from 'lucide-react';
import MapSection from '@/components/MapSection';

const CATEGORIES = [
  { slug: 'alcipan', icon: Layers },
  { slug: 'yangin-yalitimi', icon: Flame },
  { slug: 'ses-yalitimi', icon: VolumeX },
  { slug: 'dekorasyon', icon: Paintbrush }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Services' });
  
  return {
    title: `${t('title')} - Uzman YP Mimari Yapı Dekorasyon`,
    description: t('desc'),
    alternates: {
      canonical: `/${locale}/services`
    }
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Services' });
  const isTr = locale === 'tr';

  return (
    <>
      <div className={`container ${styles.servicesPage}`}>
        <div className={styles.header}>
          <h1 className="animate-fade-in">{t('title')}</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.05s' }}>{t('desc')}</p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            // Features array from JSON translation
            const features = isTr 
              ? t.raw(`${cat.slug}.features`) as string[]
              : t.raw(`${cat.slug}.features`) as string[];

            return (
              <div 
                key={cat.slug} 
                className={`glass-panel hover-lift animate-fade-in ${styles.card}`}
                style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
              >
                <div className={styles.cardIcon}>
                  <Icon size={40} />
                </div>
                <h3>{t(`${cat.slug}.title`)}</h3>
                <p>{t(`${cat.slug}.desc`)}</p>
                
                <ul className={styles.featuresList}>
                  {features.map((feat: string, fIdx: number) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>

                <Link href={`/services/${cat.slug}`} className={styles.cardLink}>
                  {isTr ? 'Detayları ve Projeleri Gör →' : 'View Details & Projects →'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <MapSection locale={locale} />
    </>
  );
}
