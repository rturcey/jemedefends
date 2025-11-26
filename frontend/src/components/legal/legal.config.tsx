// src/components/legal/legal.config.ts
import {
  Building2,
  Server,
  Lock,
  Scale,
  AlertTriangle,
  BadgeCheck,
  Cookie,
  Handshake,
  CreditCard,
  Mail,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import * as React from 'react';

export type LegalSectionItem = {
  id: string;
  title: string;
  icon: React.ReactNode;
};

export const MENTIONS_SECTIONS: LegalSectionItem[] = [
  { id: 'editeur', title: 'Éditeur du site', icon: <Building2 className="w-4 h-4" /> },
  { id: 'hebergeur', title: 'Hébergeur', icon: <Server className="w-4 h-4" /> },
  { id: 'donnees', title: 'Données personnelles', icon: <Lock className="w-4 h-4" /> },
  { id: 'propriete', title: 'Propriété intellectuelle', icon: <Scale className="w-4 h-4" /> },
  { id: 'responsabilite', title: 'Responsabilité', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'credits', title: 'Crédits', icon: <BadgeCheck className="w-4 h-4" /> },
];

export const PRIVACY_SECTIONS: LegalSectionItem[] = [
  { id: 'collecte', title: 'Collecte des données', icon: <Lock className="w-4 h-4" /> },
  { id: 'finalites', title: 'Finalités & bases légales', icon: <Scale className="w-4 h-4" /> },
  { id: 'hebergement', title: 'Hébergement', icon: <Server className="w-4 h-4" /> },
  { id: 'duree', title: 'Durée de conservation', icon: <Clock className="w-4 h-4" /> },
  { id: 'droits', title: 'Vos droits RGPD', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'cookies', title: 'Cookies', icon: <Cookie className="w-4 h-4" /> },
  { id: 'transparence', title: 'Engagement transparence', icon: <Handshake className="w-4 h-4" /> },
];

// Optionnel si tu veux des "callouts" standardisés
export const LEGAL_CALLOUT_ICONS = {
  info: <BadgeCheck className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  payment: <CreditCard className="w-4 h-4" />,
  mail: <Mail className="w-4 h-4" />,
};
