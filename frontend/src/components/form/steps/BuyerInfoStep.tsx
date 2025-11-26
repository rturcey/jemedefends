'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressCombobox } from '@/components/form/AddressCombobox';
import type { StepProps } from '@/types/form';
import { normalizeName } from '@/lib/validation';
import { SearchAddressApi } from '@/lib/address'; // branche ta fonction existante

export default function BuyerInfoStep({ data, onFieldChange, validation }: StepProps) {
  const d = (data ?? {}) as any;

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="buyer_name">Prénom et nom</Label>
        <Input
          id="buyer_name"
          value={d.buyer_name ?? ''}
          onChange={e => onFieldChange('buyer_name', e.target.value)}
          onBlur={() => {
            const v = (d.buyer_name ?? '').trim();
            if (v) onFieldChange('buyer_name', normalizeName(v));
            validation?.markInteracted?.('buyer_name');
          }}
          placeholder="Ex : Jean Dupont"
          className="rounded-xl mt-1"
        />
      </div>

      <AddressCombobox
        value={{
          line1: d.buyer_address_line_1,
          postalCode: d.buyer_postal_code,
          city: d.buyer_city,
        }}
        onChange={addr => {
          onFieldChange('buyer_address_line_1', addr.line1);
          onFieldChange('buyer_postal_code', addr.postalCode);
          onFieldChange('buyer_city', addr.city);
        }}
        searchAddresses={SearchAddressApi}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="buyer_email">Email (facultatif)</Label>
          <Input
            id="buyer_email"
            type="email"
            value={d.buyer_email ?? ''}
            onChange={e => onFieldChange('buyer_email', e.target.value)}
            className="rounded-xl mt-1"
            placeholder="vous@email.com"
          />
        </div>
        <div>
          <Label htmlFor="buyer_phone">Téléphone (facultatif)</Label>
          <Input
            id="buyer_phone"
            type="tel"
            value={d.buyer_phone ?? ''}
            onChange={e => onFieldChange('buyer_phone', e.target.value)}
            className="rounded-xl mt-1"
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>
    </div>
  );
}
