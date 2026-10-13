"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Navbar.module.css';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const tServices = useTranslations('Services');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          UZMAN <span>YP</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/" prefetch={true} onClick={closeMenu}>{t('home')}</Link>
          <Link href="/about" prefetch={true} onClick={closeMenu}>{t('about')}</Link>
          
          <div className={styles.dropdown}>
            <Link href="/services" prefetch={true} className={styles.dropdownToggle} onClick={closeMenu}>
              {t('services')}
            </Link>
            <div className={styles.dropdownMenu}>
              <Link href="/services/alcipan" prefetch={true} onClick={closeMenu}>{tServices('alcipan.title')}</Link>
              <Link href="/services/yangin-yalitimi" prefetch={true} onClick={closeMenu}>{tServices('yangin-yalitimi.title')}</Link>
              <Link href="/services/ses-yalitimi" prefetch={true} onClick={closeMenu}>{tServices('ses-yalitimi.title')}</Link>
              <Link href="/services/dekorasyon" prefetch={true} onClick={closeMenu}>{tServices('dekorasyon.title')}</Link>
            </div>
          </div>

          <Link href="/projects" prefetch={true} onClick={closeMenu}>{t('projects')}</Link>
          <Link href="/contact" prefetch={true} onClick={closeMenu}>{t('contact')}</Link>
          
          <div className={styles.mobileNavActions}>
            <LanguageSwitcher />
          </div>
        </nav>

        <div className={styles.navActions}>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
