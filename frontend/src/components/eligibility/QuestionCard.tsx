'use client';

import * as React from 'react';

interface QuestionCardProps {
  title: string;
  help?: string;
  children: React.ReactNode;
}

function QuestionCard({ title, help, children }: QuestionCardProps) {
  return (
    <section className="step-section p-0" role="tabpanel" aria-labelledby="question-title">
      {/* Header avec icône - EXACT MÊME STYLE que FormGenerator steps */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 id="question-title" className="text-lg md:text-xl font-bold text-gray-900">
            {title}
          </h2>
          {help && <p className="text-sm text-gray-600 mt-0.5">{help}</p>}
        </div>
      </div>

      {/* Contenu des options */}
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export default QuestionCard;
