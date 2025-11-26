import * as React from 'react';

import Container from '@/components/ui/Container';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import LegalTOC, { type LegalTOCItem } from './LegalTOC';

export default function LegalLayout({
  title,
  subtitle,
  toc,
  children,
}: {
  title: string;
  subtitle?: string;
  toc?: LegalTOCItem[];
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative border-b border-gray-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/50"
        />
        <Container>
          <div className="px-4 py-10 sm:py-12">
            <Badge className="mb-3">Informations légales</Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">{subtitle}</p>
            )}
          </div>
        </Container>
      </section>

      <Container>
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
            {/* Content */}
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardContent className="pt-6 space-y-6">{children}</CardContent>
              </Card>
            </div>

            {/* TOC */}
            {toc && toc.length > 0 && (
              <aside>
                <LegalTOC toc={toc} />
              </aside>
            )}
          </div>
        </div>
      </Container>

      <Separator />
    </main>
  );
}
