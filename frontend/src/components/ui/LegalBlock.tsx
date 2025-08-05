import * as React from 'react';

type Props = {
  code: string;
  title: string;
  lead?: string;
  bullets: string[];
};

function LegalBlock({ code, title, lead, bullets }: Props) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex items-center rounded-lg bg-blue-600 px-3 h-8 text-xs font-bold text-white whitespace-nowrap">
          {code}
        </span>
        <h3 className="text-lg font-extrabold tracking-tight">{title}</h3>
      </div>

      {lead ? <p className="mb-3 text-sm text-gray-700">{lead}</p> : null}

      <ul className="space-y-2 pl-0">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-gray-400" />
            <span className="text-sm leading-6 text-gray-800">{b}</span>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-blue-100" />
    </div>
  );
}
export default LegalBlock;
