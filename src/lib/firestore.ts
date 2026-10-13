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

export async function getSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const snap = await getDoc(doc(db, 'settings', key));
    if (snap.exists()) {
      const data = snap.data();
      if (data && typeof data.value === 'string' && data.value.trim() !== '') {
        return data.value;
      }
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return defaultValue;
  }
}

export async function getSettings(keys: Record<string, string>): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const [key, defaultValue] of Object.entries(keys)) {
    result[key] = await getSetting(key, defaultValue);
  }
  return result;
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as ServiceItem), slug: d.id }));
  } catch (error) {
    console.error('Error fetching services from Firestore:', error);
    return [];
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
