'use client';

import React, { useState } from 'react';
import { Code2, Settings } from 'lucide-react';
import DevPanel from './DevPanel';

export default function DevToolbar() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // N'afficher qu'en développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toolbar fixe */}
      <div className="fixed top-4 left-4 z-40 flex flex-col gap-2">
        <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-lg transition-colors"
          title="Panneau développeur"
        >
          <Code2 className="w-4 h-4" />
        </button>
      </div>

      {/* Panneau */}
      <DevPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
}
