'use client';

import * as React from 'react';
import Script from 'next/script';

function HowToJsonLd({ data }: { data: unknown }) {
  return (
    <Script
      id="elig-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default HowToJsonLd;
