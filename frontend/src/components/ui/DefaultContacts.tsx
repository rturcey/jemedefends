import React from 'react';
import { Phone, ExternalLink } from 'lucide-react';

export default function DefaultContacts() {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-green-800">
          <div className="flex items-start">
            <Phone className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <strong>Info consommateur :</strong>
              <br />
              3939 (service gratuit + prix appel)
            </div>
          </div>
          <div className="flex items-start">
            <ExternalLink className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <strong>DGCCRF :</strong>
              <br />
              <a
                href="https://www.economie.gouv.fr/dgccrf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800"
              >
                economie.gouv.fr/dgccrf
              </a>
            </div>
          </div>
          <div className="flex items-start">
            <ExternalLink className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <strong>INC (Institut Conso) :</strong>
              <br />
              <a
                href="https://www.inc-conso.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800"
              >
                inc-conso.fr
              </a>
            </div>
          </div>
          <div className="flex items-start">
            <ExternalLink className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <strong>Associations locales :</strong>
              <br />
              <a
                href="https://www.economie.gouv.fr/dgccrf/coordonnees-des-associations-de-consommateurs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800"
              >
                Annuaire DGCCRF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
