'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SectionChevronProps {
  targetId?: string;
  className?: string;
}

export default function SectionChevron({ targetId, className = '' }: SectionChevronProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Masquer le chevron une fois qu'on a commencé à scroller
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll d'une hauteur de viewport
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${className}`}
    >
      <button
        onClick={scrollToNext}
        className="group flex flex-col items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Faire défiler vers le bas"
      >
        <span className="text-xs font-medium">Découvrir</span>
        <ChevronDown className="w-6 h-6 animate-bounce group-hover:animate-none" />
      </button>
    </div>
  );
}
