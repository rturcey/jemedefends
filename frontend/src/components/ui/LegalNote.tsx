import * as React from 'react';
import { ShieldAlert } from 'lucide-react';

function LegalNote({
  title = 'Délais & preuve – à connaître',
  items,
  disclaimer,
}: {
  title?: string;
  items: string[];
  disclaimer?: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-blue-700" />
        <h4 className="text-sm font-extrabold text-blue-900">{title}</h4>
      </div>
      <ul className="list-disc pl-5 text-sm text-blue-900/90 space-y-1">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
      {disclaimer ? <p className="mt-3 text-xs text-blue-900/70">{disclaimer}</p> : null}
    </div>
  );
}

export default LegalNote;
