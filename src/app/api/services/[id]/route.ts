import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.service.delete({
      where: { id: serviceId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = parseInt(id, 10);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

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

    const service = await prisma.service.update({
      where: { id: serviceId },
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

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}
