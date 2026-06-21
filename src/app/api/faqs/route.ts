import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question_tr, question_en, answer_tr, answer_en, order } = body;

    if (!question_tr || !question_en || !answer_tr || !answer_en) {
      return NextResponse.json({ error: 'Question and answer are required for both languages' }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: {
        question_tr,
        question_en,
        answer_tr,
        answer_en,
        order: parseInt(order) || 0
      }
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
