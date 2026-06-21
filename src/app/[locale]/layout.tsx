import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import '../globals.css';
import RootLayoutClient from '@/components/RootLayoutClient';
import { getSetting } from '@/lib/settings';
import LocalSchema from '@/components/LocalSchema';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Uzman YP | Alçıpan, Yangın Yalıtımı ve Ses İzolasyonu',
  description: 'İstanbul Güngören merkezli alçıpan, asma tavan, pasif yangın durdurucu bariyerler, ses yalıtımı ve iç mimari tadilat hizmetlerinde uzman inşaat ekibi.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  const {setRequestLocale} = await import('next-intl/server');
  setRequestLocale(locale);

  const messages = await getMessages();

  // Load contact settings to display dynamically in the footer
  const contactAddress = await getSetting(
    `contact_address_${locale}`,
    locale === 'tr' 
      ? 'Güneştepe Mah. Uğur Sk. No:16/A\nGüngören / İstanbul' 
      : 'Gunestepe Mah. Ugur Sk. No:16/A\nGungoren / Istanbul'
  );
  const contactPhone = await getSetting('contact_phone', '+90 533 646 81 51');
  const contactWhatsapp = await getSetting('contact_whatsapp', '+90 533 646 81 51');
  const contactEmail = await getSetting('contact_email', 'info@dengeyapi.com.tr');

  return (
    <html lang={locale}>
      <head>
        <LocalSchema />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <RootLayoutClient
            contactAddress={contactAddress}
            contactPhone={contactPhone}
            contactEmail={contactEmail}
            contactWhatsapp={contactWhatsapp}
          >
            {children}
          </RootLayoutClient>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
