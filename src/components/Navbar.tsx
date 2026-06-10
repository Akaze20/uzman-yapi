import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('Navigation');

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          UZMAN <span>YAPI</span>
        </Link>
        
        <nav className={styles.navLinks}>
          <Link href="/">{t('home')}</Link>
          <Link href="/about">{t('about')}</Link>
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
