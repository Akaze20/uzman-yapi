'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function TopLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeRef = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const complete = useCallback(() => {
    clearTimers();
    if (!activeRef.current) return;

    setProgress(100);
    const fadeTimer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      activeRef.current = false;
    }, 200);
    timersRef.current.push(fadeTimer);
  }, [clearTimers]);

  const start = useCallback(() => {
    clearTimers();
    activeRef.current = true;
    setVisible(true);
    setProgress(20);

    const t1 = setTimeout(() => {
      if (activeRef.current) setProgress(55);
    }, 120);

    const t2 = setTimeout(() => {
      if (activeRef.current) setProgress(80);
    }, 280);

    // Hard safety limit: Never stay stuck for more than 900ms
    const safetyTimer = setTimeout(() => {
      complete();
    }, 900);

    timersRef.current.push(t1, t2, safetyTimer);
  }, [clearTimers, complete]);

  // Complete progress on any pathname change
  useEffect(() => {
    if (activeRef.current) {
      complete();
    }
  }, [pathname, complete]);

  // Complete on browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (activeRef.current) {
        complete();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [complete]);

  // Listen for clicks on internal navigation links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore right clicks, auxiliary clicks, and modified clicks (ctrl/cmd/alt/shift)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.defaultPrevented) {
        return;
      }

      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore anchor links, phone, mail, whatsapp, target blank, downloads
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.includes('wa.me') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        // Different origin -> external link
        if (targetUrl.origin !== currentUrl.origin) return;

        // Same page and same query string -> no navigation
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) {
          return;
        }

        start();
      } catch {
        if (href !== window.location.pathname) {
          start();
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      clearTimers();
    };
  }, [start, clearTimers]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 999999,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: 'var(--accent, #d9232d)',
          boxShadow: '0 0 10px rgba(217, 35, 45, 0.8), 0 0 5px rgba(217, 35, 45, 0.5)',
          transition: progress === 100 
            ? 'width 0.15s ease-out, opacity 0.2s ease-out' 
            : 'width 0.25s cubic-bezier(0.1, 0.5, 0.1, 1)',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
