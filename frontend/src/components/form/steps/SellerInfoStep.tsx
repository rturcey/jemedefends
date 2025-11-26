'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressCombobox } from '@/components/form/AddressCombobox';
import type { StepProps } from '@/types/form';
import { normalizeName } from '@/lib/validation';
import { SearchAddressApi } from '@/lib/address';

export default function SellerInfoStep({ data, onFieldChange, validation }: StepProps) {
  const d = (data ?? {}) as any;

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="seller_name">Nom du vendeur</Label>
        <Input
          id="seller_name"
          value={d.seller_name ?? ''}
          onChange={e => onFieldChange('seller_name', e.target.value)}
          onBlur={() => {
            const v = (d.seller_name ?? '').trim();
            if (v) onFieldChange('seller_name', normalizeName(v));
            validation?.markInteracted?.('seller_name');
          }}
          placeholder="Ex : Fnac, Darty, Marie Martin…"
          className="rounded-xl mt-1"
        />
      </div>

      <AddressCombobox
        value={{
          line1: d.seller_address_line_1,
          postalCode: d.seller_postal_code,
          city: d.seller_city,
        }}
        onChange={addr => {
          onFieldChange('seller_address_line_1', addr.line1);
          onFieldChange('seller_postal_code', addr.postalCode);
          onFieldChange('seller_city', addr.city);
        }}
        searchAddresses={SearchAddressApi}
      />
    </div>
  );
}
