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
          <Link href="/" onClick={closeMenu}>{t('home')}</Link>
          <Link href="/about" onClick={closeMenu}>{t('about')}</Link>
          
          <div className={styles.dropdown}>
            <Link href="/services" className={styles.dropdownToggle} onClick={closeMenu}>
              {t('services')}
            </Link>
            <div className={styles.dropdownMenu}>
              <Link href="/services/alcipan" onClick={closeMenu}>{tServices('alcipan.title')}</Link>
              <Link href="/services/yangin-yalitimi" onClick={closeMenu}>{tServices('yangin-yalitimi.title')}</Link>
              <Link href="/services/ses-yalitimi" onClick={closeMenu}>{tServices('ses-yalitimi.title')}</Link>
              <Link href="/services/dekorasyon" onClick={closeMenu}>{tServices('dekorasyon.title')}</Link>
            </div>
          </div>

          <Link href="/projects" onClick={closeMenu}>{t('projects')}</Link>
          <Link href="/contact" onClick={closeMenu}>{t('contact')}</Link>
          
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
