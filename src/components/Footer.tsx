import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import styles from './Footer.module.css';

interface FooterProps {
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
}

export default function Footer({ contactAddress, contactPhone, contactEmail, contactWhatsapp }: FooterProps) {
  const tNav = useTranslations('Navigation');
  const tContact = useTranslations('Contact');
  const tHero = useTranslations('Hero');

  const sanitizedWhatsapp = contactWhatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.brand}>
          <h2>UZMAN <span>YAPI</span></h2>
          <p>{tHero('title')}</p>
        </div>
        
        <div className={styles.links}>
          <h3>{tNav('quickLinks')}</h3>
          <ul>
            <li><Link href="/">{tNav('home')}</Link></li>
            <li><Link href="/about">{tNav('about')}</Link></li>
            <li><Link href="/projects">{tNav('projects')}</Link></li>
            <li><Link href="/contact">{tNav('contact')}</Link></li>
          </ul>
        </div>
        
        <div className={styles.contactInfo}>
          <h3>{tContact('title')}</h3>
          <p><strong>{tContact('email')}:</strong> {contactEmail}</p>
          <p><strong>{tContact('phone')}:</strong> {contactPhone}</p>
          {contactWhatsapp && (
            <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${sanitizedWhatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: '600' }}>{contactWhatsapp}</a></p>
          )}
          <p style={{ whiteSpace: 'pre-line' }}><strong>{tContact('address')}:</strong> {contactAddress}</p>
        </div>
      </div>
      <div className={styles.copyright}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} UZMAN YP MİMARİ YAPI DEKORASYON SAN. ve TİC. LTD. ŞTİ. {tContact('copyrightText')}</p>
        </div>
      </div>
    </footer>
  );
}
