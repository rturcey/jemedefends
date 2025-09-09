// frontend/src/lib/guide-utils.ts - CORRECTION DEFINITIVE
// Basé sur la vraie structure types/guides.ts

import { ALL_GUIDES } from '@/content/guides';
import type { GuidePage } from '@/types/guides';

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: {
    id: string;
    name: string;
    emoji: string;
    color: string;
  };
  readingTime: number;
  rating: number; // 4.0–4.7, déterministe
  difficulty: 'facile' | 'moyen' | 'difficile';
  isPopular: boolean;
  keywords?: string[];
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
}

export type GuidesMap = Record<string, Guide>;

// -- Helpers identiques
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[_\s]+/g, '-');

const hash01 = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return ((h >>> 0) % 1000) / 1000;
};

// Catégorisation (identique)
function getCategoryFromSlug(slug: string) {
  const s = norm(slug);

  const AUTO_PATTERNS: RegExp[] = [
    /\b(voiture|auto|vehicule|vehicule-electrique|ve|hybride|hybrid)\b/,
    /\b(camping-?car|van-?amenage)\b/,
    /\b(moto|scooter)\b/,
    /\b(autoradio|infotainment|ecran-tactile-auto|gps-voiture)\b/,
    /\b(velo(-| )electrique|vae|trottinette(-| )electrique|borne(-| )recharge|wallbox)\b/,
  ];
  if (AUTO_PATTERNS.some(r => r.test(s))) {
    return { id: 'auto', name: 'Auto & Mobilité', emoji: '🚗', color: 'red' };
  }

  const TECH_PATTERNS: RegExp[] = [
    /\b(smartphone|telephone|iphone|android|pixel-phone|galaxy)\b/,
    /\b(ordinateur(-| )portable|pc(-| )portable|laptop|macbook|notebook)\b/,
    /\b(tablette|ipad)\b/,
    /\b(smartwatch|montre(-| )connectee)\b/,
    /\b(casque(-| )audio|ecouteurs|earbuds|airpods|barre(-| )de(-| )son|home(-| )cinema|soundbar)\b/,
    /\b(appareil(-| )photo|hybride(-| )photo|boitier(-| )hybride|camera)\b/,
    /\b(routeur|router|wifi|wi-?fi|mesh|ethernet|nas)\b/,
    /\b(console(-| )portable|steam(-| )deck|switch|rog(-| )ally|joystick|drift)\b/,
    /\b(aspirateur(-| )robot|robot(-| )aspirateur)\b/,
    /\b(domotique|passerelle|gateway|zigbee|zwave|homekit|serrure(-| )connectee)\b/,
    /\b(tv|television|oled|videoprojecteur|projecteur|ecran-?pc|moniteur)\b/,
    /\b(imprimante)\b/,
  ];
  if (TECH_PATTERNS.some(r => r.test(s))) {
    return { id: 'tech', name: 'High-Tech', emoji: '📱', color: 'blue' };
  }

  const HOME_PATTERNS: RegExp[] = [
    /\b(electromenager)\b/,
    /\b(lave(-| )linge|lave(-| )vaisselle|seche(-| )linge)\b/,
    /\b(refrigerateur|congelateur|frigo)\b/,
    /\b(micro(-| )ondes|four|plaque(-| )induction|plaque(-| )cuisson)\b/,
    /\b(friteuse|mixeur|blender|extracteur(-| )de(-| )jus|yaourtiere|machine(-| )a(-| )pain|centrale(-| )vapeur|cafetiere|expresso|broyeur)\b/,
    /\b(climatisation|clim|vmc|chaudiere|pompe(-| )a(-| )chaleur|chauffe(-| )eau|cumulus|purificateur(-| )air)\b/,
    /\b(alarme|sirene|capteurs(-| )ouverture|portail(-| )motorise)\b/,
    /\b(aspirateur(-| )balai)\b/,
  ];
  if (HOME_PATTERNS.some(r => r.test(s))) {
    return { id: 'home', name: 'Maison & Électroménager', emoji: '🏡', color: 'green' };
  }

  return { id: 'general', name: 'Général', emoji: '📋', color: 'gray' };
}

function getDifficultyFromSlug(slug: string): 'facile' | 'moyen' | 'difficile' {
  const s = norm(slug);
  if (/\b(conformite|guide-complet|juridique)\b/.test(s)) return 'difficile';
  if (
    /\b(clim|vmc|chaudiere|pompe-a-chaleur|chauffe-eau|voiture|auto|hybride|camping-car|moto|scooter)\b/.test(
      s,
    )
  )
    return 'moyen';
  if (/\b(lave|refrigerateur|congelateur|micro-ondes|four|plaque|aspirateur|cafetiere)\b/.test(s))
    return 'moyen';
  if (/\b(routeur|nas|imprimante|ecran-pc|videoprojecteur|tv|oled)\b/.test(s)) return 'moyen';
  return 'facile';
}

/**
 * FONCTION PRINCIPALE - CORRECTION BASEE SUR types/guides.ts
 * ALL_GUIDES contient des objets GuidePage avec la structure metadata/sections
 */
export function getGuidesMap(): GuidesMap {
  const map: GuidesMap = {};

  try {
    console.log('🔍 getGuidesMap() - Démarrage...');

    // Vérification que ALL_GUIDES existe
    if (!ALL_GUIDES) {
      console.error('❌ ALL_GUIDES est undefined');
      return {};
    }

    console.log('📊 ALL_GUIDES keys:', Object.keys(ALL_GUIDES));

    for (const [slug, guidePage] of Object.entries(ALL_GUIDES)) {
      try {
        // Vérification structure GuidePage
        if (!guidePage || typeof guidePage !== 'object') {
          console.warn(`⚠️ Guide ${slug} : structure invalide`);
          continue;
        }

        // CORRECTION MAJEURE : Accès via metadata selon types/guides.ts
        const metadata = guidePage.metadata;
        if (!metadata) {
          console.warn(`⚠️ Guide ${slug} : metadata manquant`);
          continue;
        }

        const seo = metadata.seo || {};
        const sections = guidePage.sections || [];

        // Calcul du temps de lecture
        const readingTime = Math.max(Math.ceil(sections.length * 2), 2);

        // CORRECTION : Utilisation correcte de la structure
        const guide: Guide = {
          slug,
          title: metadata.title || slug.replace(/-/g, ' '),
          description: seo.description || 'Guide pratique sur la garantie légale de conformité',
          category: getCategoryFromSlug(slug),
          readingTime,
          rating: 4.0 + Math.floor(hash01(slug) * 8) / 10,
          difficulty: getDifficultyFromSlug(slug),
          isPopular: [
            'garantie-legale-conformite-guide-complet',
            'smartphone-telephone-panne-garantie-legale',
          ].includes(slug),
          keywords: seo.keywords || [],
        };

        map[slug] = guide;

        // Debug log pour les premiers guides
        if (Object.keys(map).length <= 3) {
          console.log(`✅ Guide ${slug} chargé:`, {
            title: guide.title,
            description: guide.description.substring(0, 50) + '...',
            sections: sections.length,
          });
        }
      } catch (error) {
        console.error(`❌ Erreur processing guide ${slug}:`, error);
        continue;
      }
    }

    const totalCount = Object.keys(map).length;
    console.log(`🎉 getGuidesMap() terminé: ${totalCount} guides chargés`);

    // Debug : affiche les 5 premiers slugs
    const firstSlugs = Object.keys(map).slice(0, 5);
    console.log('🔍 Premiers slugs disponibles:', firstSlugs);

    return map;
  } catch (error) {
    console.error('❌ Erreur critique dans getGuidesMap():', error);
    return {};
  }
}

/**
 * Récupère un guide complet (avec sections) pour les pages de détail
 */
export function getFullGuide(slug: string): (GuidePage & { slug: string }) | null {
  try {
    const guidePage = ALL_GUIDES[slug];
    if (!guidePage) {
      console.warn(`Guide ${slug} non trouvé dans ALL_GUIDES`);
      return null;
    }

    return {
      ...guidePage,
      slug,
    };
  } catch (error) {
    console.error(`Erreur récupération guide ${slug}:`, error);
    return null;
  }
}

/**
 * Liste pour affichages/catalogues
 */
export function getAllGuides(): Guide[] {
  try {
    const guidesMap = getGuidesMap();
    const guides = Object.values(guidesMap);
    console.log(`📋 getAllGuides() retourne ${guides.length} guides`);
    return guides;
  } catch (error) {
    console.error('❌ Erreur getAllGuides():', error);
    return [];
  }
}

export function getCategories(): Category[] {
  try {
    const guides = getAllGuides();
    const categoryMap = new Map<string, number>();

    guides.forEach(guide => {
      const id = guide.category?.id ?? 'general';
      categoryMap.set(id, (categoryMap.get(id) || 0) + 1);
    });

    return [
      {
        id: 'tech',
        name: 'High-Tech',
        emoji: '📱',
        color: 'blue',
        count: categoryMap.get('tech') ?? 0,
      },
      {
        id: 'home',
        name: 'Maison & Électroménager',
        emoji: '🏡',
        color: 'green',
        count: categoryMap.get('home') ?? 0,
      },
      {
        id: 'auto',
        name: 'Auto & Mobilité',
        emoji: '🚗',
        color: 'red',
        count: categoryMap.get('auto') ?? 0,
      },
      {
        id: 'general',
        name: 'Général',
        emoji: '📋',
        color: 'gray',
        count: categoryMap.get('general') ?? 0,
      },
    ];
  } catch (error) {
    console.error('❌ Erreur getCategories():', error);
    return [];
  }
}
