import styles from './MapSection.module.css';

interface MapSectionProps {
  locale: string;
}

export default function MapSection({ locale }: MapSectionProps) {
  return (
    <section className={styles.mapSection}>
      <div className={styles.mapContainer}>
        <iframe 
          src="https://maps.google.com/maps?q=G%C3%BCne%C5%9Ftepe%20Mahallesi%20U%C4%9Fur%20Sokak%20No%2016%20G%C3%BCng%C3%B6ren%20%C4%B0stanbul&t=&z=16&ie=UTF8&iwloc=&output=embed"
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className={styles.mapOverlay}>
          <a 
            href="https://www.google.com/maps/place/G%C3%BCne%C5%9Ftepe+Mah.+U%C4%9Fur+Sk.+No+16+G%C3%BCng%C3%B6ren+%C4%B0stanbul"
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {locale === 'tr' ? 'HARİTADA GÖSTER' : 'VIEW ON MAP'}
          </a>
        </div>
      </div>
    </section>
  );
}
