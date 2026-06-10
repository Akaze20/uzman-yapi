'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/routing';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, {locale: newLocale});
  };

  return (
    <div className={styles.switcher}>
      <button 
        className={`${styles.langBtn} ${locale === 'tr' ? styles.active : ''}`}
        onClick={() => switchLanguage('tr')}
      >
        TR
      </button>
      <span className={styles.divider}>|</span>
      <button 
        className={`${styles.langBtn} ${locale === 'en' ? styles.active : ''}`}
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
