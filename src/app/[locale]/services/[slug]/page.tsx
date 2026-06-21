import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSetting } from '@/lib/settings';
import ProjectList from '@/components/ProjectList';
import styles from '../services.module.css';
import { Layers, Flame, VolumeX, Paintbrush, Phone } from 'lucide-react';
import { Link } from '@/i18n/routing';

const CATEGORIES = ['alcipan', 'yangin-yalitimi', 'ses-yalitimi', 'dekorasyon'];

const ICON_MAP = {
  alcipan: Layers,
  'yangin-yalitimi': Flame,
  'ses-yalitimi': VolumeX,
  dekorasyon: Paintbrush
};

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!CATEGORIES.includes(slug)) return {};

  const t = await getTranslations({ locale, namespace: 'Services' });
  
  return {
    title: t(`${slug}.metaTitle`),
    description: t(`${slug}.metaDesc`),
    alternates: {
      canonical: `/${locale}/services/${slug}`
    }
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  
  if (!CATEGORIES.includes(slug)) {
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
  const whatsappNum = await getSetting('contact_phone', '+905321234567');
  const cleanPhone = whatsappNum.replace(/\s+/g, '').replace('+', '');
  
  // Format WhatsApp Link
  const serviceTitle = t(`${slug}.title`);
  const whatsappMsg = encodeURIComponent(
    isTr 
      ? `Merhaba, Uzman YP sitesinden ulaşıyorum. ${serviceTitle} hizmetiniz hakkında fiyat teklifi ve bilgi alabilir miyim?`
      : `Hello, I'm contacting you via Uzman YP website. Could I get information and a quote about your ${serviceTitle} service?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappMsg}`;

  const IconComponent = ICON_MAP[slug as keyof typeof ICON_MAP];
  const features = t.raw(`${slug}.features`) as string[];

  return (
    <div className={`container ${styles.detailPage}`}>
      <div className={styles.detailGrid}>
        <div className={`${styles.detailInfo} animate-fade-in`}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--border)', marginBottom: '1.5rem', color: 'var(--accent)' }}>
            <IconComponent size={48} />
          </div>
          <h1>{serviceTitle}</h1>
          <p>{t(`${slug}.desc`)}</p>

          <ul className={styles.detailFeatures}>
            {features.map((feat: string, idx: number) => (
              <li key={idx} className="animate-fade-in" style={{ animationDelay: `${0.1 + (idx * 0.05)}s` }}>
                {feat}</li>
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
          {/* A premium, abstract builder visual for each service category */}
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
            <IconComponent size={80} style={{ color: 'var(--border)', opacity: 0.5 }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              UZMAN YP Mimarlık & İzolasyon
            </span>
          </div>
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
