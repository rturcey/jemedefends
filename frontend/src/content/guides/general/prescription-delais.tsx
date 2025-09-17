// prescription-delais.tsx
// Guide migré automatiquement - Ne pas modifier la structure
import React from 'react';

import {
  Badge,
  Button,
  ErrorAlert,
  LegalNote,
  TextWithLegalRefs,
  StandardProcedure,
  DefaultAlternatives,
  DefaultContacts,
  DefaultGrid,
} from '@/components/ui';
import type { LegalArticleId } from '@/legal/registry';
import type { GuidePage } from '@/types/guides';

export const GUIDE_PRESCRIPTION_DELAIS: GuidePage = {
  metadata: {
    title: 'Prescription et délais en droit de la consommation (2025)',
    seo: {
      title: 'Prescription délais consommation : ne ratez plus vos recours (2025)',
      description:
        'Délais pour agir en consommation : 2 ans garantie légale, 2 ans vices cachés après découverte, 5 ans responsabilité. Interruption et suspension.',
      keywords: [
        'prescription délais consommation',
        'délai action garantie légale',
        'prescription vices cachés',
        'interruption prescription',
        'délai recours consommateur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Prescription et délais en droit de la consommation (2025)',
        url: '/guides/prescription-delais',
      },
    ],
  },
  sections: [
    {
      id: 'intro',
      title: 'L’essentiel',
      content: (
        <div className="space-y-3">
          <ErrorAlert type="info" className="text-sm sm:text-base">
            Exigez la <strong>mise en conformité</strong> (réparation ou remplacement). En cas
            d’échec : <strong>réduction du prix</strong> ou <strong>résolution</strong>. Tous frais
            incombent au vendeur.
          </ErrorAlert>
          <div className="flex flex-wrap gap-2">
            <Badge>Présomption 24&nbsp;mois</Badge>
            <Badge>Frais vendeur</Badge>
            <Badge>≤&nbsp;30&nbsp;jours</Badge>
          </div>
          <LegalNote
            title="Références légales"
            explanation="Articles détectés automatiquement dans ce guide."
            examples={['1648', 'L.217-7', 'L.612-4']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'delais-prescription',
      title: 'Délais de prescription par type d\\',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• 2 ans à compter de la livraison`} />,
                <TextWithLegalRefs text={`• 1 an minimum pour l'occasion (pro)`} />,
                <TextWithLegalRefs text={`• Point de départ : délivrance conforme`} />,
                <TextWithLegalRefs text={`• Présomption : défaut pendant 24 mois`} />,
                <TextWithLegalRefs text={`• Livraison échelonnée : dernier élément`} />,
                <TextWithLegalRefs text={`• Installation complexe : mise en service`} />,
                <TextWithLegalRefs text={`• Découverte tardive : pas d'extension`} />,
                <TextWithLegalRefs text={`• Réparation sous garantie : nouveau délai`} />,
                <TextWithLegalRefs text={`• 2 ans après découverte du vice`} />,
                <TextWithLegalRefs text={`• Point de départ : connaissance certaine`} />,
                <TextWithLegalRefs text={`• Preuve : date de découverte à établir`} />,
                <TextWithLegalRefs text={`• Délai butoir : 20 ans après la vente`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`La prescription éteint le droit d'agir en justice après un certain délai. En droit de la consommation, les délais varient selon le fondement juridique invoqué.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Garantie légale de conformité 📅 Délai principal (Art. L.217-7) • 2 ans à compter de la livraison • 1 an minimum pour l'occasion (pro) • Point de départ : délivrance conforme • Présomption : défaut pendant 24 mois 🔍 Cas particuliers • Livraison échelonnée : dernier élément • Installation complexe : mise en service • Découverte tardive : pas d'extension • Réparation sous garantie : nouveau délai 🔍 Vices cachés (Code civil) ⏰ Délai de découverte (Art. 1648) • 2 ans après découverte du vice • Point de départ : connaissance certaine • Preuve : date de découverte à établir • Délai butoir : 20 ans après la vente 📋 Appréciation découverte • Manifestation claire : du défaut • Expertise : confirmant le vice • Impossibilité d'ignorer : évidence • Pas de soupçons : certitude requise ⚖️ Action en responsabilité 🎯 Délai général (Art. 2224 C.civ) • 5 ans après fait dommageable • Point de départ : dommage + auteur connus • Applications : défaut produit dangereux • Cumul possible : avec garantie légale 💥 Responsabilité produits défectueux • 3 ans : après connaissance dommage + défaut • 10 ans : à compter mise en circulation • Producteur : responsabilité automatique • Dommages corporels : régime spécial 📋 Autres délais spéciaux 💳 Crédit consommation • 2 ans : vices du consentement • 5 ans : nullité du contrat • Point de départ : signature 🏠 Démarchage domicile • 14 jours : rétractation • 1 an : si info manquante • 3 mois : + 14 jours si régularisation 🌐 Vente distance • 14 jours : rétractation • 12 mois : si info manquante • Service : exécution immédiate possible`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'interruption-suspension',
      title: 'Interruption et suspension de la prescription',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Citation en justice : assignation au fond`} />,
                <TextWithLegalRefs text={`• Requête : procédure simplifiée`} />,
                <TextWithLegalRefs text={`• Référé : même conservatoire`} />,
                <TextWithLegalRefs text={`• Déclaration : greffe compétent`} />,
                <TextWithLegalRefs text={`• Commandement : huissier de justice`} />,
                <TextWithLegalRefs text={`• Reconnaissance expresse : écrite du débiteur`} />,
                <TextWithLegalRefs text={`• Paiement partiel : reconnaissance implicite`} />,
                <TextWithLegalRefs text={`• Demande délai : reconnaissance de la dette`} />,
                <TextWithLegalRefs text={`• Offre transaction : selon les termes`} />,
                <TextWithLegalRefs text={`• Saisine médiateur : consommation agréé`} />,
                <TextWithLegalRefs text={`• Durée : jusqu'à fin de médiation`} />,
                <TextWithLegalRefs text={`• Maximum : 90 jours généralement`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⏹️ Interruption de la prescription L'interruption efface le délai écoulé et fait courir un nouveau délai intégral.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Actes judiciaires (Art. 2241 C.civ) • Citation en justice : assignation au fond • Requête : procédure simplifiée • Référé : même conservatoire • Déclaration : greffe compétent • Commandement : huissier de justice 📞 Actes de reconnaissance (Art. 2240) • Reconnaissance expresse : écrite du débiteur • Paiement partiel : reconnaissance implicite • Demande délai : reconnaissance de la dette • Offre transaction : selon les termes ⏸️ Suspension de la prescription La suspension arrête temporairement le délai qui reprend ensuite où il s'était arrêté.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🤝 Médiation (Art. L.612-4) • Saisine médiateur : consommation agréé • Durée : jusqu'à fin de médiation • Maximum : 90 jours généralement • Notification : au professionnel ⚖️ Autres causes suspension • Force majeure : impossibilité absolue • Conciliation : devant conciliateur • Expertise : judiciaire ordonnée • Procédure collective : du débiteur 🎯 Stratégie pour préserver vos droits 📅 Calendrier délais • Noter : date livraison exacte • Calculer : échéance -3 mois • Alertes : rappels automatiques • Documents : classement chronologique ✍️ Actes conservatoires • Mise en demeure : LRAR systématique • Médiation : si délai proche • Citation : en urgence si nécessaire • Référé : mesures conservatoires 🔍 Preuves de dates • Factures : avec mentions légales • Bons livraison : signés datés • Emails : horodatages serveur • Photos : métadonnées EXIF`}
            />
          </p>
        </div>
      ),
    },
    { id: 'procedure', title: 'Procédure type', content: <StandardProcedure /> },
    { id: 'alternatives', title: 'Si ça bloque', content: <DefaultAlternatives /> },
    { id: 'contacts', title: 'Contacts utiles', content: <DefaultContacts /> },
    {
      id: 'cta',
      title: 'Passer à l’action',
      content: (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <a href="/eligibilite">🚀 Générer ma mise en demeure</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/guides">📚 Voir tous les guides</a>
          </Button>
        </div>
      ),
    },
  ],
  legal: {
    mainArticles: [
      '1648' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.612-4' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
