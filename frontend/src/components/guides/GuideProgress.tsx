'use client';

import clsx from 'clsx';
import React from 'react';

interface GuideProgressProps {
  className?: string;
}

export default function GuideProgress({ className = '' }: GuideProgressProps) {
  const [progress, setProgress] = React.useState(0);
  const [mobileHeaderVisible, setMobileHeaderVisible] = React.useState(false);

  // 🔔 listen to header visibility (mobile)
  React.useEffect(() => {
    const onHeader = (e: Event) => {
      const ce = e as CustomEvent<{ visible: boolean }>;
      if (typeof ce.detail?.visible === 'boolean') {
        setMobileHeaderVisible(ce.detail.visible);
      }
    };
    window.addEventListener('toc:header', onHeader as EventListener);
    return () => window.removeEventListener('toc:header', onHeader as EventListener);
  }, []);

  // compute progress
  React.useEffect(() => {
    const update = () => {
      const article = document.querySelector('article');
      if (!article) return;
      const top = article.getBoundingClientRect().top + window.scrollY;
      const height = article.offsetHeight;
      const winH = window.innerHeight;
      const y = window.scrollY;

      const pct = Math.max(0, Math.min(100, ((y - top + winH) / height) * 100));
      setProgress(pct);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  if (progress <= 0) return null;

  return (
    <div
      className={clsx(
        // desktop: always visible; mobile: only when header is visible
        'fixed top-12 lg:top-[5rem] left-0 right-0 z-40',
        mobileHeaderVisible ? 'block sm:block' : 'hidden sm:block',
        className,
      )}
    >
      <div className="w-full h-1 bg-gray-200">
        <div
          className="h-1 bg-blue-600 transition-all duration-300 ease-out"
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
