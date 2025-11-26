'use client';

import * as React from 'react';
import { FlaskConical } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function TestDataButton({
                                         onFill,
                                       }: {
  onFill: (fn: (setAnswer: any) => void) => void;
}) {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="pt-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-2 text-xs"
        onClick={() =>
          onFill(setAnswer => {
            // Exemple de remplissage de test : adapte à tes steps
            setAnswer('seller', 'professional');
            setAnswer('usage', 'personal');
            setAnswer('problem', 'defect');
          })
        }
      >
        <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
        Remplir avec données de test
      </Button>
    </div>
  );
}
