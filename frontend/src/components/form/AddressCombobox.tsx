'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

type AddressSuggestion = {
  label: string;         // "10 rue ... 75000 Paris"
  line1: string;
  postalCode: string;
  city: string;
};

type AddressComboboxProps = {
  value: {
    line1?: string;
    postalCode?: string;
    city?: string;
  };
  onChange: (next: { line1: string; postalCode: string; city: string }) => void;
  searchAddresses: (q: string) => Promise<AddressSuggestion[]>; // branche ta lib existante
  disabled?: boolean;
  className?: string;
};

export function AddressCombobox({
                                  value,
                                  onChange,
                                  searchAddresses,
                                  disabled,
                                  className,
                                }: AddressComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [items, setItems] = React.useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    searchAddresses(query)
      .then(res => !cancelled && setItems(res))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [query, searchAddresses]);

  const pick = (it: AddressSuggestion) => {
    onChange({ line1: it.line1, postalCode: it.postalCode, city: it.city });
    setOpen(false);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full justify-start rounded-xl text-gray-700"
          >
            <MapPin className="mr-2 h-4 w-4 text-blue-700" />
            {value.line1 ? value.line1 : 'Rechercher une adresse'}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-[--radix-popover-trigger-width] rounded-xl">
          <Command>
            <CommandInput
              placeholder="Tape ton adresse…"
              value={query}
              onValueChange={setQuery}
              autoFocus
            />
            <CommandList>
              {loading && (
                <div className="p-3 text-sm text-gray-500">Recherche…</div>
              )}
              <CommandEmpty>Aucune adresse trouvée</CommandEmpty>
              {items.map((it, i) => (
                <CommandItem
                  key={i}
                  value={it.label}
                  onSelect={() => pick(it)}
                >
                  {it.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          value={value.line1 ?? ''}
          onChange={e => onChange({ line1: e.target.value, postalCode: value.postalCode ?? '', city: value.city ?? '' })}
          placeholder="Adresse"
          className="rounded-xl"
        />
        <Input
          value={value.postalCode ?? ''}
          onChange={e => onChange({ line1: value.line1 ?? '', postalCode: e.target.value, city: value.city ?? '' })}
          placeholder="Code postal"
          className="rounded-xl"
        />
        <Input
          value={value.city ?? ''}
          onChange={e => onChange({ line1: value.line1 ?? '', postalCode: value.postalCode ?? '', city: e.target.value })}
          placeholder="Ville"
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
