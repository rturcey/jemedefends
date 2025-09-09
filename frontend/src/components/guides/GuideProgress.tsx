'use client';

import React, { useState, useEffect } from 'react';

interface GuideProgressProps {
  className?: string;
}

export default function GuideProgress({ className = '' }: GuideProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const articleElement = document.querySelector('article');
      if (!articleElement) return;

      const articleTop = articleElement.offsetTop;
      const articleHeight = articleElement.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const calculatedProgress = Math.max(
        0,
        Math.min(100, ((scrollTop - articleTop + windowHeight) / articleHeight) * 100),
      );

      setProgress(calculatedProgress);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  if (progress <= 0) return null;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-blue-600 h-1 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progression de lecture"
        />
      </div>
    </div>
  );
}
