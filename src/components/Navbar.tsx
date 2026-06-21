import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const tServices = useTranslations('Services');

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          UZMAN <span>YP</span>
        </Link>
        
        <nav className={styles.navLinks}>
          <Link href="/">{t('home')}</Link>
          <Link href="/about">{t('about')}</Link>
          
          <div className={styles.dropdown}>
            <Link href="/services" className={styles.dropdownToggle}>
              {t('services')}
            </Link>
            <div className={styles.dropdownMenu}>
              <Link href="/services/alcipan">{tServices('alcipan.title')}</Link>
              <Link href="/services/yangin-yalitimi">{tServices('yangin-yalitimi.title')}</Link>
              <Link href="/services/ses-yalitimi">{tServices('ses-yalitimi.title')}</Link>
              <Link href="/services/dekorasyon">{tServices('dekorasyon.title')}</Link>
            </div>
          </div>

          <Link href="/projects">{t('projects')}</Link>
          <Link href="/contact">{t('contact')}</Link>
        </nav>

        <div className={styles.navActions}>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
