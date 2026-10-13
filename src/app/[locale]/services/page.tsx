import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import styles from './services.module.css';
import { getServices } from '@/lib/firestore';
import MapSection from '@/components/MapSection';

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

  // Fetch services from Firestore ordered by order index
  const services = await getServices();

  return (
    <>
      <div className={`container ${styles.servicesPage}`}>
        <div className={styles.header}>
          <h1 className="animate-fade-in">{t('title')}</h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.05s' }}>{t('desc')}</p>
        </div>

        <div className={styles.grid}>
          {services.map((service, idx) => {
            const title = isTr ? service.title_tr : service.title_en;
            const desc = isTr ? service.desc_tr : service.desc_en;
            const features = (isTr ? service.features_tr : service.features_en)
              .split('\n')
              .map(f => f.trim())
              .filter(Boolean);

            return (
              <div 
                key={service.slug} 
                className={`glass-panel hover-lift animate-fade-in ${styles.card}`}
                style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}
              >
                <div className={styles.cardImage}>
                  {service.image ? (
                    <img src={service.image} alt={title} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span style={{ fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.6 }}>
                        UZMAN YP
                      </span>
                    </div>
                  )}
                </div>

                <h3>{title}</h3>
                <p>{desc}</p>
                
                <ul className={styles.featuresList}>
                  {features.map((feat: string, fIdx: number) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>

                <Link href={`/services/${service.slug}`} className={styles.cardLink}>
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
