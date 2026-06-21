export default function GlobalLoading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background)',
      zIndex: 9999,
      gap: '1rem'
    }}>
      <div className="spinner" />
      <span style={{
        color: 'var(--text-muted)',
        fontSize: '0.95rem',
        letterSpacing: '1px',
        animation: 'pulse 1.5s infinite ease-in-out'
      }}>
        Lütfen Bekleyin...
      </span>
      <style dangerouslySetInnerHTML={{ __html: `
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid var(--border);
          border-radius: 50%;
          border-top-color: var(--accent);
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}} />
    </div>
  );
}
