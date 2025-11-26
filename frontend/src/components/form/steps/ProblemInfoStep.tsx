'use client';

import * as React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UnifiedDialog } from '@/components/form/UnifiedDialog';
import { Button } from '@/components/ui/button';
import MagicImprovement from '@/components/form/MagicImprovement';
import type { StepProps } from '@/types/form';

type Props = StepProps & { onSubmit: () => void };

export default function ProblemInfoStep({ data, onFieldChange, onSubmit, isSubmitting }: Props) {
  const d = (data ?? {}) as any;
  const defectDescription = d.defect_description ?? '';
  const isDigital = d.product_condition === 'digital';

  const [open, setOpen] = React.useState(false);

  const hasMinimumText = defectDescription.trim().length >= 20;
  const hasRemedyPreference = Boolean(d.remedy_preference);

  const remedyOptions = isDigital
    ? [
        { value: 'repairs', label: 'Correction' },
        { value: 'termination', label: 'Résiliation' },
      ]
    : [
        { value: 'repairs', label: 'Réparation' },
        { value: 'replacement', label: 'Remplacement' },
      ];

  return (
    <div className="space-y-5">
      <div>
        <Label>Que souhaitez-vous ?</Label>
        <RadioGroup
          className="grid gap-2 mt-2"
          value={d.remedy_preference ?? ''}
          onValueChange={v => onFieldChange('remedy_preference', v)}
        >
          {remedyOptions.map(o => (
            <Label
              key={o.value}
              className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer"
            >
              <RadioGroupItem value={o.value} />
              {o.label}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="defect_description">Décrivez le problème</Label>
        <Textarea
          id="defect_description"
          rows={5}
          value={defectDescription}
          onChange={e => onFieldChange('defect_description', e.target.value)}
          placeholder="Ex : écran qui s’éteint, service inaccessible…"
          className="rounded-xl mt-1"
        />

        {hasMinimumText && (
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(true)}
              className="rounded-xl"
            >
              Améliorer mon texte
            </Button>
          </div>
        )}
      </div>

      <UnifiedDialog
        open={open}
        onOpenChange={setOpen}
        title="Amélioration automatique"
        description="Choisis la formulation qui te convient."
      >
        <MagicImprovement
          initialValue={defectDescription ?? ''}
          onApply={(txt: string) => onFieldChange('defect_description', txt)}
          disabled={isSubmitting}
        />
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            className="rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>
        </div>
      </UnifiedDialog>

      {/* Le shell gère le bouton "Générer" via onNext, mais on bloque si incomplet */}
      <div className="hidden" aria-hidden>
        {/* “canNext” géré dans FormGenerator via validation */}
      </div>
    </div>
  );
}
