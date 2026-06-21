import {getTranslations} from 'next-intl/server';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import ProjectList from '@/components/ProjectList';
import MapSection from '@/components/MapSection';

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Projects'});

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div className={`container ${styles.projectsPage}`}>
        <div className={styles.header}>
          <h1 className="animate-fade-in">{t('title')}</h1>
          <p className="animate-fade-in" style={{animationDelay: '0.05s'}}>{t('desc')}</p>
        </div>
        
        <ProjectList projects={projects} locale={locale} />
      </div>
      <MapSection locale={locale} />
    </>
  );
}
