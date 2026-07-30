import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSetting } from '@/lib/settings';
import ProjectList from '@/components/ProjectList';
import styles from '../services.module.css';
import { Phone } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';

  const service = await prisma.service.findUnique({
    where: { slug }
  });

  if (!service) return {};

  return {
    title: isTr 
      ? service.metaTitle_tr || `${service.title_tr} - Uzman YP` 
      : service.metaTitle_en || `${service.title_en} - Uzman YP`,
    description: isTr 
      ? service.metaDesc_tr || service.desc_tr 
      : service.metaDesc_en || service.desc_en,
    alternates: {
      canonical: `/${locale}/services/${slug}`
    }
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  
  const service = await prisma.service.findUnique({
    where: { slug }
  });

  if (!service) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Services' });
  const isTr = locale === 'tr';

  // Fetch category-specific projects from database
  const projects = await prisma.project.findMany({
    where: { category: slug },
    orderBy: { createdAt: 'desc' }
  });

  // Get contact info for CTA
  const whatsappNum = await getSetting('contact_phone', '+90 533 646 81 51');
  const cleanPhone = whatsappNum.replace(/\s+/g, '').replace('+', '');
  
  // Format WhatsApp Link
  const serviceTitle = isTr ? service.title_tr : service.title_en;
  const whatsappMsg = encodeURIComponent(
    isTr 
      ? `Merhaba, Uzman YP sitesinden ulaşıyorum. ${serviceTitle} hizmetiniz hakkında fiyat teklifi ve bilgi alabilir miyim?`
      : `Hello, I'm contacting you via Uzman YP website. Could I get information and a quote about your ${serviceTitle} service?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;

  const features = (isTr ? service.features_tr : service.features_en)
    .split('\n')
    .map(f => f.trim())
    .filter(Boolean);

  return (
    <div className={`container ${styles.detailPage}`}>
      <div className={styles.detailGrid}>
        <div className={`${styles.detailInfo} animate-fade-in`}>
          <h1>{serviceTitle}</h1>
          <p>{isTr ? service.desc_tr : service.desc_en}</p>

          <ul className={styles.detailFeatures}>
            {features.map((feat: string, idx: number) => (
              <li key={idx} className="animate-fade-in" style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}>
                {feat}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={18} />
              {t('whatsappQuote')}
            </a>
            <Link href="/contact" className="btn btn-secondary">
              {isTr ? 'Bize Yazın' : 'Contact Us'}
            </Link>
          </div>
        </div>

        <div className={`${styles.serviceVisual} animate-fade-in`} style={{ animationDelay: '0.15s' }}>
          {service.image ? (
            <img src={service.image} alt={serviceTitle} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid var(--border)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                UZMAN YP Mimarlık & İzolasyon
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Projects Grid for this Service */}
      <div className={styles.sectionHeader}>
        <h2>{t('viewProjects')}</h2>
      </div>

      <ProjectList projects={projects} locale={locale} />
    </div>
  );
}
