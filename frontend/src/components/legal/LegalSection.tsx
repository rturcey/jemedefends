'use client';
import * as React from 'react';

import {Reveal} from '@/components/ui';

function LegalSection({
                          title,
                          id,
                          children,
                      }: React.PropsWithChildren<{ title: string; id: string }>) {
    return (
        <section id={id}
                 className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">{title}</h2>
            <div
                className="text-justify text-gray-700 text-sm md:text-base leading-relaxed space-y-3">
                {children}
            </div>
        </section>
    );
}

export default LegalSection;
