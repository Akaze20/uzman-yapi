import styles from './page.module.css';

export default function Loading() {
  return (
    <div className={`container ${styles.projectsPage}`}>
      <div className={styles.header}>
        {/* Skeleton for Title */}
        <div style={{
          width: '250px',
          height: '3.5rem',
          backgroundColor: 'var(--border)',
          margin: '0 auto 1.5rem',
          borderRadius: '4px',
          animation: 'pulse 1.5s infinite ease-in-out'
        }} />
        {/* Skeleton for Subtitle */}
        <div style={{
          width: '400px',
          maxWidth: '80%',
          height: '1.2rem',
          backgroundColor: 'var(--border)',
          margin: '0 auto',
          borderRadius: '4px',
          animation: 'pulse 1.5s infinite ease-in-out',
          animationDelay: '0.1s'
        }} />
      </div>

      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`card ${styles.card}`} style={{ border: '1px solid var(--border)' }}>
            {/* Image Placeholder Skeleton */}
            <div style={{
              height: '200px',
              backgroundColor: 'var(--border)',
              animation: 'pulse 1.5s infinite ease-in-out'
            }} />
            
            {/* Card Content Skeleton */}
            <div className={styles.cardContent}>
              <div style={{
                width: '60%',
                height: '1.3rem',
                backgroundColor: 'var(--border)',
                marginBottom: '1rem',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }} />
              <div style={{
                width: '100%',
                height: '0.95rem',
                backgroundColor: 'var(--border)',
                marginBottom: '0.5rem',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }} />
              <div style={{
                width: '90%',
                height: '0.95rem',
                backgroundColor: 'var(--border)',
                borderRadius: '4px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }} />
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}} />
    </div>
  );
}
