import {getTranslations} from 'next-intl/server';
import styles from './page.module.css';
import {MapPin, Phone, Mail, Send, MessageCircle} from 'lucide-react';
import { getSetting } from '@/lib/settings';
import MapSection from '@/components/MapSection';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Contact'});

  const contactTitle = await getSetting(`contact_title_${locale}`, t('title'));
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
    <>
      <div className={`container ${styles.contactPage}`}>
        <div className={styles.header}>
          <h1 className="animate-fade-in">{contactTitle}</h1>
        </div>
        
        <div className={styles.grid}>
          <div className={`glass-panel ${styles.infoPanel} animate-fade-in`} style={{animationDelay: '0.2s'}}>
            <h2>İletişim Bilgilerimiz</h2>
            <div className={styles.infoItem}>
              <MapPin className={styles.icon} />
              <div>
                <strong>{t('address')}:</strong>
                <p style={{ whiteSpace: 'pre-line' }}>{contactAddress}</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Phone className={styles.icon} />
              <div>
                <strong>{t('phone')}:</strong>
                <p>{contactPhone}</p>
              </div>
            </div>
            {contactWhatsapp && (
              <div className={styles.infoItem}>
                <MessageCircle className={styles.icon} style={{ color: '#25D366' }} />
                <div>
                  <strong>WhatsApp:</strong>
                  <p>
                    <a 
                      href={`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'underline' }}
                    >
                      {contactWhatsapp}
                    </a>
                  </p>
                </div>
              </div>
            )}
            <div className={styles.infoItem}>
              <Mail className={styles.icon} />
              <div>
                <strong>{t('email')}:</strong>
                <p>{contactEmail}</p>
              </div>
            </div>
          </div>

          <div className={`glass-panel ${styles.formPanel} animate-fade-in`} style={{animationDelay: '0.4s'}}>
            <h2>Bize Yazın</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Adınız Soyadınız</label>
                <input type="text" placeholder="Ad Soyad" />
              </div>
              <div className={styles.formGroup}>
                <label>{t('email')}</label>
                <input type="email" placeholder="ornek@email.com" />
              </div>
              <div className={styles.formGroup}>
                <label>Mesajınız</label>
                <textarea rows={5} placeholder="Mesajınızı buraya yazın..."></textarea>
              </div>
              <button type="button" className={`btn btn-primary ${styles.submitBtn}`}>
                {t('send')} <Send size={18} style={{marginLeft: '8px'}} />
              </button>
            </form>
          </div>
        </div>
      </div>
      <MapSection locale={locale} />
    </>
  );
}
