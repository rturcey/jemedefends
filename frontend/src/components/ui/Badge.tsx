import * as React from 'react';

function Badge({
  children,
  tone = 'blue',
}: React.PropsWithChildren<{
  tone?: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'red' | 'emerald';
}>) {
  const tones: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full border ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export default Badge;
