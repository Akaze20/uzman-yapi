import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

export interface ServiceItem {
  id: number;
  slug: string;
  title_tr: string;
  title_en: string;
  desc_tr: string;
  desc_en: string;
  image?: string | null;
  features_tr: string;
  features_en: string;
  metaTitle_tr?: string | null;
  metaTitle_en?: string | null;
  metaDesc_tr?: string | null;
  metaDesc_en?: string | null;
  order?: number;
}

export interface ProjectItem {
  id: number | string;
  title_tr: string;
  title_en: string;
  desc_tr: string;
  desc_en: string;
  image?: string | null;
  images?: string | null;
  category: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FaqItem {
  id: number | string;
  question_tr: string;
  question_en: string;
  answer_tr: string;
  answer_en: string;
  order?: number;
}

let settingsCache: Record<string, string> | null = null;
let settingsCacheTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

async function loadAllSettings(): Promise<Record<string, string>> {
  const now = Date.now();
  if (settingsCache && (now - settingsCacheTime < CACHE_TTL)) {
    return settingsCache;
  }
  try {
    const snap = await getDocs(collection(db, 'settings'));
    const map: Record<string, string> = {};
    snap.docs.forEach(d => {
      const val = d.data()?.value;
      if (typeof val === 'string') map[d.id] = val;
    });
    settingsCache = map;
    settingsCacheTime = now;
    return map;
  } catch (err) {
    console.error('Failed to load settings:', err);
    return settingsCache || {};
  }
}

export async function getSetting(key: string, defaultValue: string): Promise<string> {
  const all = await loadAllSettings();
  const val = all[key];
  if (val && val.trim() !== '') return val;
  return defaultValue;
}

export async function getSettings(keys: Record<string, string>): Promise<Record<string, string>> {
  const all = await loadAllSettings();
  const result: Record<string, string> = {};
  for (const [key, defaultValue] of Object.entries(keys)) {
    const val = all[key];
    result[key] = (val && val.trim() !== '') ? val : defaultValue;
  }
  return result;
}

let servicesCache: ServiceItem[] | null = null;
let servicesCacheTime = 0;

export async function getServices(): Promise<ServiceItem[]> {
  const now = Date.now();
  if (servicesCache && (now - servicesCacheTime < CACHE_TTL)) {
    return servicesCache;
  }
  try {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ ...(d.data() as ServiceItem), slug: d.id }));
    servicesCache = list;
    servicesCacheTime = now;
    return list;
  } catch (error) {
    console.error('Error fetching services from Firestore:', error);
    return servicesCache || [];
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  try {
    const snap = await getDoc(doc(db, 'services', slug));
    if (snap.exists()) {
      return { ...(snap.data() as ServiceItem), slug: snap.id };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error);
    return null;
  }
}

export async function getProjects(category?: string, limitCount?: number): Promise<ProjectItem[]> {
  try {
    let constraints: any[] = [];
    if (category) {
      constraints.push(where('category', '==', category));
    }
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    const q = query(collection(db, 'projects'), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  } catch (error) {
    console.error('Error fetching faqs:', error);
    return [];
  }
}

export async function saveContact(data: { name: string; phone: string; email?: string | null; message?: string | null }) {
  return addDoc(collection(db, 'contacts'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp()
  });
}
