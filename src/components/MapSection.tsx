import styles from './MapSection.module.css';

interface MapSectionProps {
  locale: string;
}

export default function MapSection({ locale }: MapSectionProps) {
  return (
    <section className={styles.mapSection}>
      <div className={styles.mapContainer}>
        <iframe 
          src="https://maps.google.com/maps?width=100%25&height=450&hl=tr&q=G%C3%BCne%C5%9Ftepe%20Mah.%20U%C4%9Fur%20Sk.%20No:16/A%20G%C3%BCng%C3%B6ren%20/%20%C4%B0stanbul+(Uzman%20YP)&t=&z=15&ie=UTF8&iwloc=B&output=embed"
          width="100%" 
          height="100%" 
          style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className={styles.mapOverlay}>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=G%C3%BCne%C5%9Ftepe+Mahallesi+U%C4%9Fur+Sokak+No+16+G%C3%BCng%C3%B6ren+%C4%B0stanbul"
            target="_blank" 
            rel="noopener noreferrer"
            className={`btn btn-primary ${styles.mapBtn}`}
          >
            {locale === 'tr' ? 'HARİTADA GÖSTER' : 'VIEW ON MAP'}
          </a>
        </div>
      </div>
    </section>
  );
}
