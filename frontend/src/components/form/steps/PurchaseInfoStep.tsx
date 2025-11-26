'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UnifiedDialog } from '@/components/form/UnifiedDialog';
import { Button } from '@/components/ui/button';
import type { StepProps } from '@/types/form';
import { API_ENDPOINTS } from '@/types/api';
import { Pen } from 'lucide-react';

export default function PurchaseInfoStep({ data, onFieldChange }: StepProps) {
  const d = (data ?? {}) as any;

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [proposal, setProposal] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const normalizeProductName = async () => {
    setLoading(true);
    setError(null);
    setProposal(null);

    try {
      const res = await fetch(API_ENDPOINTS.normalizeProductName, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raw_name: d.product_name,
          declared_type: d.product_condition === 'digital' ? 'service' : 'bien',
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Erreur');
      setProposal(json.product_name_formatted?.group_noun || json.raw_name);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="product_name">Nom du produit / service</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="product_name"
            value={d.product_name ?? ''}
            onChange={e => onFieldChange('product_name', e.target.value)}
            placeholder="Ex : iPhone 14, abonnement Netflix…"
            className="rounded-xl"
          />
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setOpen(true);
              normalizeProductName();
            }}
            disabled={!d.product_name?.trim()}
          >
            <Pen className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="purchase_date">Date d’achat</Label>
          <Input
            id="purchase_date"
            type="date"
            value={d.purchase_date ?? ''}
            onChange={e => onFieldChange('purchase_date', e.target.value)}
            className="rounded-xl mt-1"
          />
        </div>
        <div>
          <Label htmlFor="product_price">Prix payé (€)</Label>
          <Input
            id="product_price"
            value={d.product_price ?? ''}
            onChange={e => onFieldChange('product_price', e.target.value.replace(/[^\d.,]/g, ''))}
            className="rounded-xl mt-1"
            placeholder="Ex : 499"
          />
        </div>
      </div>

      <div>
        <Label>Type / état</Label>
        <RadioGroup
          className="grid gap-2 mt-2"
          value={d.product_condition ?? ''}
          onValueChange={v => onFieldChange('product_condition', v)}
        >
          <Label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer">
            <RadioGroupItem value="digital" />
            Service numérique (app, SaaS, abonnement…)
          </Label>
          <Label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer">
            <RadioGroupItem value="new" />
            Neuf
          </Label>
          <Label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer">
            <RadioGroupItem value="used" />
            Occasion / reconditionné
          </Label>
        </RadioGroup>
      </div>

      <UnifiedDialog
        open={open}
        onOpenChange={setOpen}
        title="Amélioration automatique"
        description="On te propose une formulation plus juridique et neutre."
      >
        <div className="space-y-3">
          {loading && <div className="text-sm text-gray-600">Analyse…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {!loading && !error && (
            <>
              <div className="p-3 rounded-xl border bg-blue-50 text-sm">
                <span className="font-semibold">Suggestion :</span>{' '}
                {proposal ?? <span className="italic">Aucune suggestion</span>}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  className="rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  className="rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={!proposal}
                  onClick={() => {
                    onFieldChange('product_name', proposal);
                    setOpen(false);
                  }}
                >
                  Accepter
                </Button>
              </div>
            </>
          )}
        </div>
      </UnifiedDialog>
    </div>
  );
}
