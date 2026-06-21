export default function LocalSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "name": "Uzman YP Mimari Yapı Dekorasyon",
    "alternateName": "Uzman YP Alçıpan ve İzolasyon",
    "description": "İstanbul Güngören merkezli alçıpan, asma tavan, pasif yangın durdurucu bariyerler, ses yalıtımı ve iç mimari tadilat hizmetleri sunan uzman inşaat ekibi.",
    "url": "https://uzman-yapi-kczv.vercel.app",
    "logo": "https://uzman-yapi-kczv.vercel.app/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-532-123-45-67",
      "contactType": "customer service",
      "areaServed": "TR",
      "availableLanguage": ["Turkish", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Güneştepe Mah. Uğur Sk. No:16/A",
      "addressLocality": "Güngören",
      "addressRegion": "İstanbul",
      "postalCode": "34164",
      "addressCountry": "TR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.0254,
      "longitude": 28.8726
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://github.com/Akaze20/uzman-yapi"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
