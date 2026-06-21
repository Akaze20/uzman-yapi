import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://uzman-yapi-kczv.vercel.app';
const LOCALES = ['tr', 'en'];
const STATIC_PAGES = ['', '/about', '/contact', '/projects', '/services'];
const SERVICES = ['alcipan', 'yangin-yalitimi', 'ses-yalitimi', 'dekorasyon'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Generate entries for static pages in all locales
  for (const locale of LOCALES) {
    for (const page of STATIC_PAGES) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  // 2. Generate entries for service pages in all locales
  for (const locale of LOCALES) {
    for (const service of SERVICES) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}/services/${service}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  // 3. Generate entries for dynamic projects in all locales
  try {
    const projects = await prisma.project.findMany({
      select: { id: true, updatedAt: true }
    });

    for (const locale of LOCALES) {
      for (const project of projects) {
        sitemapEntries.push({
          url: `${BASE_URL}/${locale}/projects`, // Since projects are currently viewed in a client lightbox/modal on the /projects page, the canonical page for a project is /projects.
          lastModified: project.updatedAt,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Failed to generate dynamic project sitemap entries:', error);
  }

  return sitemapEntries;
}
