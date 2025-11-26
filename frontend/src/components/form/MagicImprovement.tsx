'use client';

import * as React from 'react';
import { Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function MagicImprovement({
                                           initialValue,
                                           onApply,
                                           disabled,
                                         }: {
  initialValue: string;
  onApply: (value: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => setValue(initialValue), [initialValue]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" disabled={disabled} className="gap-2">
          <Wand2 className="w-4 h-4 text-blue-600" />
          Améliorer le texte
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Amélioration assistée</DialogTitle>
          <DialogDescription className="text-sm">
            Nous reformulons pour plus de clarté, sans ajouter d’éléments juridiques.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            className="min-h-[180px]"
          />
          <p className="text-xs text-gray-500">
            Aucun conseil juridique personnalisé. Vous restez responsable du contenu.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            onClick={() => onApply(value)}
            className="min-w-[140px]"
          >
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
