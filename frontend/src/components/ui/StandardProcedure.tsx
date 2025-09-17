import React from 'react';

import TextWithLegalRefs from './TextWithLegalRefs';

export default function StandardProcedure() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Procédure recommandée</h3>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">
              1
            </span>
            <div>
              <strong>Rassemblez vos preuves :</strong> facture d'achat, photos du défaut,
              correspondances précédentes avec le vendeur
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">
              2
            </span>
            <div>
              <TextWithLegalRefs text="Demandez la réparation ou le remplacement (L.217-9)" />
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">
              3
            </span>
            <div>
              <TextWithLegalRefs text="En cas de refus ou délai dépassé, mise en demeure (L.217-11)" />
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-2 mt-0.5">
              4
            </span>
            <div>
              <TextWithLegalRefs text="Si échec définitif, demandez la réduction de prix ou résolution (L.217-13)" />
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
