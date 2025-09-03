// lib/guide-utils.ts
import { getAllOptimizedGuides } from '@/content/guides';

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
  rating: number;
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

export function getAllGuides(): Guide[] {
  const guides = getAllOptimizedGuides();

  return Object.entries(guides).map(([slug, guide]) => ({
    slug,
    title: guide.title,
    description: guide.seo.description,
    category: getCategoryFromSlug(slug),
    readingTime: Math.ceil(guide.sections.length * 2),
    rating: 4.0 + Math.random() * 0.8,
    difficulty: getDifficultyFromSlug(slug),
    isPopular: [
      'garantie-legale-conformite-guide-complet',
      'smartphone-telephone-panne-garantie-legale',
    ].includes(slug),
    keywords: guide.seo.keywords || [],
  }));
}

export function getCategories(): Category[] {
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
      count: categoryMap.get('tech') || 0,
    },
    {
      id: 'home',
      name: 'Maison & Électroménager',
      emoji: '🏡',
      color: 'green',
      count: categoryMap.get('home') || 0,
    },
    {
      id: 'auto',
      name: 'Auto & Mobilité',
      emoji: '🚗',
      color: 'red',
      count: categoryMap.get('auto') || 0,
    },
    {
      id: 'general',
      name: 'Général',
      emoji: '📋',
      color: 'gray',
      count: categoryMap.get('general') || 0,
    },
  ];
}

// -- Helpers
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // retire les accents
    .replace(/[_\s]+/g, '-'); // homogénéise

// -- Catégorisation robuste
function getCategoryFromSlug(slug: string) {
  const s = norm(slug);

  // 1) AUTO & mobilité (voiture, moto, scooter, VAE, trottinette, camping-car, autoradio, borne VE)
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

  // 2) TECH (smartphone, ordi, tablette, montre, audio, photo, réseau, consoles, robots, domotique "passerelles")
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

  // 3) HOME (maison & électroménager : lavage, froid, cuisson, HVAC, VMC, sécurité, petit électro)
  const HOME_PATTERNS: RegExp[] = [
    /\b(electromenager)\b/, // legacy
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

  // 4) défaut
  return { id: 'general', name: 'Général', emoji: '📋', color: 'gray' };
}

// -- Difficulté un peu plus fine (guide complet, juridique => difficile ; HVAC/auto => moyen)
function getDifficultyFromSlug(slug: string): 'facile' | 'moyen' | 'difficile' {
  const s = norm(slug);
  if (/\b(conformite|guide-complet|juridique)\b/.test(s)) return 'difficile';
  if (
    /\b(clim|vmc|chaudiere|pompe-a-chaleur|chauffe-eau|voiture|auto|hybride|camping-car|moto|scooter)\b/.test(
      s
    )
  )
    return 'moyen';
  if (/\b(lave|refrigerateur|congelateur|micro-ondes|four|plaque|aspirateur|cafetiere)\b/.test(s))
    return 'moyen';
  if (/\b(routeur|nas|imprimante|ecran-pc|videoprojecteur|tv|oled)\b/.test(s)) return 'moyen';
  return 'facile';
}
