import { ExternalLink } from 'lucide-react';
import React from 'react';

export default function DefaultAlternatives() {
  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-orange-900 mb-3">Si le vendeur ne répond pas</h3>
        <div className="space-y-3 text-sm text-orange-800">
          <div>
            <strong>Médiation :</strong> Contactez le médiateur du secteur
            <a
              href="https://www.economie.gouv.fr/mediation-conso"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-orange-600 hover:text-orange-800"
            >
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          </div>
          <div>
            <strong>SignalConso :</strong> Signalez le litige aux autorités
            <a
              href="https://signal.conso.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-orange-600 hover:text-orange-800"
            >
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          </div>
          <div>
            <strong>Action en justice :</strong> Tribunal judiciaire ou de proximité selon le
            montant
          </div>
        </div>
      </div>
    </div>
  );
}
