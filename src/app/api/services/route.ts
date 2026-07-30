import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      slug, 
      title_tr, 
      title_en, 
      desc_tr, 
      desc_en, 
      image, 
      features_tr, 
      features_en,
      metaTitle_tr,
      metaTitle_en,
      metaDesc_tr,
      metaDesc_en,
      order 
    } = body;

    if (!slug || !title_tr || !title_en) {
      return NextResponse.json({ error: 'Slug and titles in both languages are required' }, { status: 400 });
    }

    const service = await prisma.service.create({
      data: {
        slug: slug.trim().toLowerCase(),
        title_tr,
        title_en,
        desc_tr: desc_tr || '',
        desc_en: desc_en || '',
        image,
        features_tr: features_tr || '',
        features_en: features_en || '',
        metaTitle_tr,
        metaTitle_en,
        metaDesc_tr,
        metaDesc_en,
        order: parseInt(String(order || 0), 10)
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
