import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {ArrowRight} from 'lucide-react';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import { getSetting } from '@/lib/settings';
import FaqAccordion from '@/components/FaqAccordion';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Hero'});
  const tAbout = await getTranslations({locale, namespace: 'About'});
  const tProjects = await getTranslations({locale, namespace: 'Projects'});
  const tFaq = await getTranslations({locale, namespace: 'Faq'});

  const recentProjects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  const faqs = await prisma.faq.findMany({
    orderBy: { order: 'asc' }
  });


  const heroTitle = await getSetting(`hero_title_${locale}`, t('title'));
  const heroSubtitle = await getSetting(`hero_subtitle_${locale}`, t('subtitle'));
  const heroCta = await getSetting(`hero_cta_${locale}`, t('cta'));
  
  const homeAboutTitle = await getSetting(`home_about_title_${locale}`, tAbout('title'));
  const homeAboutHistory = await getSetting(`home_about_history_${locale}`, tAbout('history'));
  const homeAboutVision = await getSetting(`home_about_vision_${locale}`, tAbout('vision'));
  const homeAboutBtn = await getSetting(`home_about_btn_${locale}`, locale === 'tr' ? 'Hakkımızda' : 'About Us');
  
  const homeProjectsTitle = await getSetting(`home_projects_title_${locale}`, tProjects('title'));
  const homeProjectsBtn = await getSetting(`home_projects_btn_${locale}`, locale === 'tr' ? 'Tümünü Gör' : 'View All');
  const homeProjectsEmpty = await getSetting(`home_projects_empty_${locale}`, locale === 'tr' ? 'Henüz proje eklenmemiş.' : 'No projects added yet.');

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className="animate-fade-in">{heroTitle}</h1>
          <p className="animate-fade-in" style={{animationDelay: '0.2s'}}>{heroSubtitle}</p>
          <div className={styles.heroActions + " animate-fade-in"} style={{animationDelay: '0.4s'}}>
            <Link href="/projects" className="btn btn-primary">
              {heroCta} <ArrowRight className={styles.icon} size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.introSection}>
        <div className={`container ${styles.grid2}`}>
          <div className="glass-panel" style={{padding: '3rem'}}>
            <h2>{homeAboutTitle}</h2>
            <p>{homeAboutHistory}</p>
            <Link href="/about" className="btn btn-secondary" style={{marginTop: '2rem'}}>
              {homeAboutBtn}
            </Link>
          </div>
          <div className={`glass-panel ${styles.visionBox}`}>
            <h3>{homeAboutVision}</h3>
          </div>
        </div>
      </section>

      {/* Projects Teaser */}
      <section className={styles.projectsTeaser}>
        <div className="container">
          <div className={styles.teaserHeader}>
            <h2>{homeProjectsTitle}</h2>
            <Link href="/projects" className="btn btn-secondary">
              {homeProjectsBtn}
            </Link>
          </div>
          <div className={styles.grid3}>
            {recentProjects.length === 0 ? (
              <p>{homeProjectsEmpty}</p>
            ) : null}
            {recentProjects.map((project, index) => (
              <div key={project.id} className={`glass-panel hover-lift ${styles.projectCard}`}>
                <div className={styles.projectImgPlaceholder}>
                  {project.image ? (
                    <img src={project.image} alt="Proje" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    `Görsel ${project.id}`
                  )}
                </div>
                <div className={styles.projectInfo}>
                  <h4>{locale === 'tr' ? project.title_tr : project.title_en}</h4>
                  <p>{locale === 'tr' ? project.desc_tr : project.desc_en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <FaqAccordion 
          title={tFaq('title')} 
          desc={tFaq('desc')} 
          items={faqs.map(item => ({
            id: item.id,
            question: locale === 'tr' ? item.question_tr : item.question_en,
            answer: locale === 'tr' ? item.answer_tr : item.answer_en
          }))} 
        />
      )}

    </div>
  );
}
