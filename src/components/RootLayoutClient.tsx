'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface RootLayoutClientProps {
  children: React.ReactNode;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
}

export default function RootLayoutClient({
  children,
  contactAddress,
  contactPhone,
  contactEmail,
  contactWhatsapp
}: RootLayoutClientProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.split('/').includes('admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  const sanitizedWhatsapp = contactWhatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${sanitizedWhatsapp}`;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer
        contactAddress={contactAddress}
        contactPhone={contactPhone}
        contactEmail={contactEmail}
        contactWhatsapp={contactWhatsapp}
      />
      {/* Floating WhatsApp Button */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="WhatsApp ile İletişime Geçin"
        style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
          zIndex: 1500,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1) translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.4)';
        }}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.475 1.332 4.992l-1.35 4.928 5.048-1.324c1.468.801 3.125 1.222 4.811 1.222 5.506 0 9.988-4.482 9.988-9.988s-4.482-9.988-9.988-9.988zm6.549 14.19c-.269.757-1.562 1.488-2.148 1.551-.575.062-1.15.297-3.69-.703-3.25-1.28-5.326-4.588-5.488-4.805-.162-.217-1.311-1.742-1.311-3.327 0-1.584.827-2.361 1.121-2.671.294-.31.638-.387.851-.387.213 0 .426.002.612.011.196.009.462-.074.722.56.269.654.919 2.253.998 2.416.079.162.131.353.023.57-.109.217-.162.353-.324.543-.162.19-.34.426-.486.57-.162.162-.33.339-.142.665.188.324.834 1.365 1.794 2.222.959.857 1.769 1.121 2.099 1.285.33.162.52.136.711-.082.19-.217.827-.959 1.047-1.285.22-.326.438-.271.739-.162.302.109 1.919.905 2.25 1.068.33.162.55.244.629.38.079.136.079.789-.19 1.546z"/>
        </svg>
      </a>
    </>
  );
}
