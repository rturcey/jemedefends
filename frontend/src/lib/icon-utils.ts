// frontend/src/lib/icon-utils.ts
// Version complète intégrée avec le système YAML existant

import React from 'react';
import {
    AlertCircle,
    AlertTriangle,
    Archive,
    Award,
    BarChart3,
    Battery,
    BookOpen,
    Briefcase,
    Building,
    Calendar,
    Camera,
    Car,
    CheckCircle,
    ChevronRight,
    Clock, Computer,
    DollarSign,
    Download,
    Euro,
    Eye,
    FileText,
    Gamepad2,
    Globe,
    Hammer,
    Headphones,
    Heart,
    HelpCircle,
    Home,
    Info,
    Laptop,
    Lightbulb,
    Lock,
    Mail,
    MapPin,
    MessageSquare,
    Music,
    Palette,
    Phone,
    RefreshCw,
    RotateCcw,
    Scale,
    Scissors,
    Search,
    Settings,
    Shield,
    Shirt,
    Signal,
    Smartphone,
    Star,
    Target,
    TrendingUp,
    Users,
    Video,
    Wifi,
    Wrench,
    Zap,
} from 'lucide-react';

// ✅ IMPORT DE LA SOURCE DE VÉRITÉ EXISTANTE
import {getCategoryFromSlug} from './guide-utils';

/**
 * Type pour les tailles d'icônes
 */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Obtient les classes CSS pour une taille d'icône
 */
function getIconClasses(size: IconSize = 'md'): string {
    const sizeClasses: Record<IconSize, string> = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8',
    };
    return sizeClasses[size];
}

/**
 * ✅ REGISTRE COMPLET DES ICÔNES LUCIDE REACT
 * Mapping nom string → composant React (pour YAML)
 *
 * Lucide exporte des composants React qui acceptent des props SVG.
 */
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const LUCIDE_ICON_REGISTRY: Record<string, IconComponent> = {
    // Catégories principales
    Smartphone,
    Laptop,
    Home,
    Car,
    Shirt,
    Headphones,
    Scale,
    BookOpen,

    // Actions & UI
    Shield,
    Settings,
    Phone,
    BarChart3,
    MessageSquare,
    ChevronRight,
    Download,
    Zap,
    Search,
    CheckCircle,
    Info,
    Clock,
    FileText,

    // Alertes & États
    AlertTriangle,
    AlertCircle,
    DollarSign,
    MapPin,
    RefreshCw,
    Mail,
    RotateCcw,
    Euro,

    // Organisations & Personnes
    Users,
    Building,
    HelpCircle,
    Calendar,
    Archive,
    Briefcase,

    // Performance & Métriques
    Target,
    TrendingUp,
    Award,
    Star,
    Heart,
    Eye,

    // Sécurité & Réseau
    Lock,
    Globe,
    Wifi,
    Signal,

    // Média & Création
    Camera,
    Video,
    Music,
    Gamepad2,
    Palette,
    Lightbulb,

    // Outils & Réparation
    Wrench,
    Hammer,
    Scissors,

    // Énergie / statut
    Battery,
};

/**
 * ✅ RÉSOUT UNE ICÔNE DEPUIS UN NOM STRING (pour YAML)
 * Utilisé par les sections avec `icon: "Shield"`
 */
export function getIconFromName(
    iconName: string,
    size: IconSize = 'md',
    className?: string,
): React.ReactNode {
    const IconComponent = LUCIDE_ICON_REGISTRY[iconName];
    const classes = className || getIconClasses(size);

    if (IconComponent) {
        return React.createElement(IconComponent, {className: classes});
    }

    return React.createElement(BookOpen, {className: classes});
}

/**
 * ✅ OBTIENT UNE ICÔNE SELON LE NOM DE CATÉGORIE
 */
export function getIconForCategory(
    categoryName: string,
    size: IconSize = 'md',
    className?: string,
): React.ReactNode {
    const classes = className || getIconClasses(size);

    const iconMap: Record<string, React.ReactNode> = {
        'High-Tech': React.createElement(Smartphone, {className: classes}),
        Automobile: React.createElement(Car, {className: classes}),
        Maison: React.createElement(Home, {className: classes}),
        Électroménager: React.createElement(Home, {className: classes}),
        Général: React.createElement(Scale, {className: classes}),
        Juridique: React.createElement(Scale, {className: classes}),
        Textile: React.createElement(Shirt, {className: classes}),
        'Audio/Vidéo': React.createElement(Headphones, {className: classes}),
        Informatique: React.createElement(Computer, {className: classes}),
    };

    return iconMap[categoryName] ?? React.createElement(BookOpen, {className: classes});
}

/**
 * ✅ OBTIENT UNE ICÔNE À PARTIR D'UN SLUG (utilise la source de vérité)
 */
export function getIconForSlug(
    slug: string,
    size: IconSize = 'md',
    className?: string,
): React.ReactNode {
    const category = getCategoryFromSlug(slug);
    return getIconForCategory(category.name, size, className);
}

/**
 * ✅ OBTIENT UNE CATÉGORIE AVEC SON ICÔNE (combine source de vérité + icône)
 */
export function getCategoryWithIcon(
    slug: string,
    size: IconSize = 'md',
): {
    name: string;
    color: string;
    emoji: string;
    icon: React.ReactNode;
} {
    const category = getCategoryFromSlug(slug);
    return {...category, icon: getIconForCategory(category.name, size)};
}

/**
 * ✅ ICÔNES POUR CONTEXTES SPÉCIFIQUES (FAQ, etc.)
 */
export function getContextualIcon(
    context: string,
    size: IconSize = 'md',
    className?: string,
): React.ReactNode {
    const classes = className || getIconClasses(size);

    const contextMap: Record<string, React.ReactNode> = {
        // FAQ/Service
        gratuit: React.createElement(DollarSign, {className: classes}),
        temps: React.createElement(Clock, {className: classes}),
        france: React.createElement(MapPin, {className: classes}),
        remboursement: React.createElement(RefreshCw, {className: classes}),
        courrier: React.createElement(Mail, {className: classes}),
        occasion: React.createElement(RotateCcw, {className: classes}),
        juridique: React.createElement(FileText, {className: classes}),
        prix: React.createElement(Euro, {className: classes}),

        // Général
        aide: React.createElement(BookOpen, {className: classes}),
        legal: React.createElement(Scale, {className: classes}),
        protection: React.createElement(Shield, {className: classes}),
        contact: React.createElement(Phone, {className: classes}),
    };

    return contextMap[context] ?? React.createElement(BookOpen, {className: classes});
}

/**
 * Icônes pour les niveaux de sévérité
 */
export function getSeverityIcon(
    severity: 'high' | 'medium' | 'low',
    size: IconSize = 'sm',
    className?: string,
): React.ReactNode {
    const classes = className || getIconClasses(size);

    const iconMap: Record<'high' | 'medium' | 'low', React.ReactNode> = {
        high: React.createElement(AlertTriangle, {className: `${classes} text-red-600`}),
        medium: React.createElement(AlertCircle, {className: `${classes} text-yellow-600`}),
        low: React.createElement(Info, {className: `${classes} text-green-600`}),
    };

    return iconMap[severity];
}

/**
 * ✅ OBTIENT TOUTES LES ICÔNES DISPONIBLES (pour documentation/debug)
 */
export function getAllAvailableIcons(): string[] {
    return Object.keys(LUCIDE_ICON_REGISTRY).sort();
}

/**
 * ✅ OBTIENT TOUTES LES CATÉGORIES AVEC ICÔNES
 */
export function getAllCategoriesWithIcons(size: IconSize = 'md') {
    const representativeSlugs = [
        'smartphone-defaut',
        'voiture-defaut',
        'lave-linge-panne',
        'guide-general',
    ];

    const categories = representativeSlugs.map(slug => {
        const category = getCategoryFromSlug(slug);
        return {...category, icon: getIconForCategory(category.name, size)};
    });

    // Déduplication par nom
    return categories.filter(
        (category, index, self) => index === self.findIndex(c => c.name === category.name),
    );
}

/**
 * Vérifie si une icône est supportée
 */
export function isSupportedIcon(iconName: string): boolean {
    return iconName in LUCIDE_ICON_REGISTRY;
}

/**
 * Vérifie si une catégorie est supportée
 */
export function isSupportedCategory(categoryName: string): boolean {
    const supportedCategories = [
        'High-Tech',
        'Automobile',
        'Maison',
        'Électroménager',
        'Général',
        'Juridique',
        'Textile',
        'Audio/Vidéo',
    ];
    return supportedCategories.includes(categoryName);
}

/**
 * ✅ UTILITAIRE POUR GUIDE SECTIONS (intégration avec GuideSection.tsx)
 */
export function getSectionIcon(
    iconName?: string,
    sectionId?: string,
    sectionType?: string,
    size: IconSize = 'md',
    className?: string,
): React.ReactNode {
    // 1. Priorité à l'icône spécifiée dans le YAML
    if (iconName && isSupportedIcon(iconName)) {
        return getIconFromName(iconName, size, className);
    }

    // 2. Fallback selon l'ID de section
    if (sectionId) {
        const idIconMap: Record<string, string> = {
            essentiel: 'Shield',
            droits: 'Scale',
            procedure: 'FileText',
            demarche: 'FileText',
            timeline: 'Clock',
            table: 'BarChart3',
            faq: 'MessageSquare',
            alternatives: 'AlertTriangle',
            contacts: 'Phone',
            'cas-specifiques': 'Settings',
            defauts: 'AlertTriangle',
            garantie: 'Shield',
            vendeur: 'Scale',
        };

        const iconForId = idIconMap[sectionId];
        if (iconForId) {
            return getIconFromName(iconForId, size, className);
        }
    }

    // 3. Fallback selon le type de section
    if (sectionType) {
        const typeIconMap: Record<string, string> = {
            timeline: 'Clock',
            procedure: 'FileText',
            table: 'BarChart3',
            faq: 'MessageSquare',
            alternatives: 'AlertTriangle',
            contacts: 'Phone',
            grid: 'Settings',
            content: 'BookOpen',
        };

        const iconForType = typeIconMap[sectionType];
        if (iconForType) {
            return getIconFromName(iconForType, size, className);
        }
    }

    // 4. Fallback final
    const classes = className || getIconClasses(size);
    return React.createElement(BookOpen, {className: classes});
}
