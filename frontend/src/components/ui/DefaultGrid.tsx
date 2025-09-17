// src/components/ui/DefaultGrid.tsx
import React from 'react';

interface DefaultGridProps {
  items: React.ReactNode[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function DefaultGrid({ items, columns = 2, className = '' }: DefaultGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="h-full flex flex-col p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:bg-gray-100/70 transition-colors"
        >
          <div className="flex-1">{item}</div>
        </div>
      ))}
    </div>
  );
}
