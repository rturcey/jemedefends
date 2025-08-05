'use client';
import * as React from 'react';

function ProgressDots({
  total,
  current, // index 0-based
  className = '',
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            'h-2 rounded-full transition-all',
            i === current ? 'w-6 bg-blue-700' : 'w-2 bg-gray-300',
          ].join(' ')}
        />
      ))}
    </div>
  );
}

export default ProgressDots;
