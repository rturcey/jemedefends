import Script from 'next/script';

export default function HomepageSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://jemedefends.fr/#organization',
        name: 'Je me défends',
        url: 'https://jemedefends.fr',
        logo: 'https://jemedefends.fr/logo.png',
        description:
          'Service gratuit de génération de lettres de mise en demeure basées sur la garantie légale de conformité',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'contact@jemedefends.fr',
          availableLanguage: 'French',
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'FR',
          addressLocality: 'Tarnos',
          addressRegion: 'Nouvelle-Aquitaine',
        },
        foundingDate: '2024',
        numberOfEmployees: '1-10',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://jemedefends.fr/#website',
        url: 'https://jemedefends.fr',
        name: 'Je me défends',
        description: 'Générateur gratuit de lettres de mise en demeure',
        publisher: { '@id': 'https://jemedefends.fr/#organization' },
        inLanguage: 'fr-FR',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://jemedefends.fr/guides?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://jemedefends.fr/#service',
        name: 'Génération de lettre de mise en demeure',
        provider: { '@id': 'https://jemedefends.fr/#organization' },
        description:
          'Service gratuit de génération de lettres basées sur la garantie légale de conformité du Code de la consommation français',
        serviceType: 'Legal Document Generation',
        areaServed: {
          '@type': 'Country',
          name: 'France',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services de mise en demeure',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Lettre gratuite',
              price: '0',
              priceCurrency: 'EUR',
              description: 'Contenu complet de la lettre de mise en demeure à imprimer',
              availability: 'https://schema.org/InStock',
            },
            {
              '@type': 'Offer',
              name: 'PDF professionnel',
              price: '2.99',
              priceCurrency: 'EUR',
              description: 'Lettre au format PDF avec logo et signature électronique',
              availability: 'https://schema.org/InStock',
            },
            {
              '@type': 'Offer',
              name: 'Envoi automatique',
              price: '12.99',
              priceCurrency: 'EUR',
              description: 'PDF + envoi en recommandé avec accusé de réception',
              availability: 'https://schema.org/InStock',
            },
          ],
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          reviewCount: '247',
          bestRating: '5',
          worstRating: '1',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://jemedefends.fr/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Est-ce vraiment gratuit ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Oui, vous obtenez gratuitement le contenu complet de la lettre avec les articles pertinents du Code de la consommation. Des options payantes sont disponibles pour le PDF professionnel et l'envoi automatique.",
            },
          },
          {
            '@type': 'Question',
            name: 'Combien de temps faut-il ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Moins de 3 minutes : diagnostic d'éligibilité puis génération immédiate de la lettre personnalisée.",
            },
          },
          {
            '@type': 'Question',
            name: 'Quelle est la base juridique ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Uniquement les articles pertinents du Code de la consommation français <LegalReference code="L217_3" /> <LegalReference code="L217_8" /> <LegalReference code="L217_10"/> Aucune invention, que du droit applicable.',
            },
          },
        ],
      },
    ],
  };

  return (
    <Script
      id="homepage-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}
