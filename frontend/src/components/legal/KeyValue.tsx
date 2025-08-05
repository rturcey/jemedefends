'use client';
import * as React from 'react';

function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-b-0">
      <dt className="font-medium text-gray-900 text-sm mb-1 sm:mb-0 sm:w-1/3">{label}</dt>
      <dd className="text-gray-700 text-sm sm:w-2/3">{value}</dd>
    </div>
  );
}

export default KeyValue;
