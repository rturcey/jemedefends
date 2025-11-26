import { Shield, FileText, HelpCircle, BookOpen, FileQuestion } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/#problemes', label: 'Problèmes courants', icon: <FileQuestion className="w-5 h-5" /> },
  { href: '/#process', label: 'Processus', icon: <FileText className="w-5 h-5" /> },
  { href: '/#fiabilite', label: 'Confiance', icon: <Shield className="w-5 h-5" /> },
  { href: '/guides', label: 'Guides', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/faq', label: 'FAQ', icon: <HelpCircle className="w-5 h-5" /> },
];
