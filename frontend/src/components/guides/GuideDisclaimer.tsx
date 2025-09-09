// src/components/guides/GuideDisclaimer.tsx
// Disclaimer juridique visible et conforme

'use client';

import React from 'react';

interface GuideDisclaimerProps {
  children: React.ReactNode;
  className?: string;
}

export default function GuideDisclaimer({ children, className = '' }: GuideDisclaimerProps) {
  return <div className={`mt-12 mb-8 ${className}`}>{children}</div>;
}
