import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const GUIDES_BASE_PATH = path.join(process.cwd(), 'content/guides');

// Mapping des catégories basé sur votre structure existante
const CATEGORY_PATTERNS = {
  'smartphone-': 'tech',
  'ordinateur-': 'tech',
  'routeur-': 'tech',
  'casque-': 'tech',
  'ecouteurs-': 'tech',
  'appareil-photo': 'auto',
  'autoradio-': 'auto',
  'borne-recharge': 'auto',
  'voiture-': 'auto',
  'moto-': 'auto',
  'velo-': 'auto',
  'trottinette-': 'auto',
  'lave-': 'home',
  'micro-ondes': 'home',
  refrigerateur: 'home',
  climatisation: 'home',
  chaudiere: 'home',
  'pompe-': 'home',
  'alarme-': 'home',
  'domotique-': 'home',
  'electromenager-': 'home',
};

function getGuideCategory(slug: string): string {
  for (const [pattern, category] of Object.entries(CATEGORY_PATTERNS)) {
    if (slug.startsWith(pattern)) {
      return category;
    }
  }
  return 'general';
}

function getGuideYAMLPath(slug: string): { category: string; filePath: string } {
  const category = getGuideCategory(slug);
  const filePath = path.join(GUIDES_BASE_PATH, category, `${slug}.yaml`);
  return { category, filePath };
}

/**
 * GET - Récupérer le YAML d'un guide
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'API disponible uniquement en développement' },
      { status: 403 },
    );
  }

  try {
    const { slug } = await params;
    const { category, filePath } = getGuideYAMLPath(slug);

    let yamlContent: string;
    let exists = false;

    try {
      yamlContent = await fs.readFile(filePath, 'utf8');
      exists = true;
    } catch (error) {
      // Fichier n'existe pas, créer un template
      yamlContent = generateYAMLTemplate(slug, category);
      exists = false;
    }

    // Récupérer les stats du fichier si existant
    let lastModified = new Date().toISOString();
    if (exists) {
      const stats = await fs.stat(filePath);
      lastModified = stats.mtime.toISOString();
    }

    return NextResponse.json({
      slug,
      category,
      yaml: yamlContent,
      exists,
      filePath: filePath.replace(process.cwd(), ''),
      lastModified,
    });
  } catch (error) {
    console.error('Erreur chargement guide:', error);
    return NextResponse.json({ error: `Erreur chargement: ${error.message}` }, { status: 500 });
  }
}

/**
 * PUT - Sauvegarder le YAML d'un guide
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'API disponible uniquement en développement' },
      { status: 403 },
    );
  }

  try {
    const { slug } = await params;
    const { yaml } = await request.json();

    if (!yaml || typeof yaml !== 'string') {
      return NextResponse.json({ error: 'Contenu YAML invalide' }, { status: 400 });
    }

    const { category, filePath } = getGuideYAMLPath(slug);

    // Créer le dossier de catégorie si nécessaire
    const categoryDir = path.dirname(filePath);
    await fs.mkdir(categoryDir, { recursive: true });

    // Mettre à jour automatiquement la date updated
    const updatedYaml = updateYAMLTimestamp(yaml);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, updatedYaml, 'utf8');

    return NextResponse.json({
      success: true,
      filePath: filePath.replace(process.cwd(), ''),
      lastModified: new Date().toISOString(),
      category,
    });
  } catch (error) {
    console.error('Erreur sauvegarde guide:', error);
    return NextResponse.json({ error: `Erreur sauvegarde: ${error.message}` }, { status: 500 });
  }
}

/**
 * Génère un template YAML de base
 */
function generateYAMLTemplate(slug: string, category: string): string {
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const today = new Date().toISOString().split('T')[0];

  return `title: "${title}"
description: "Description de votre guide"
category: "${category}"
slug: "${slug}"

seo:
  title: "${title} - Je me défends"
  description: "Guide pratique pour comprendre vos droits"
  keywords:
    - "${slug}"
    - "garantie légale"
    - "consommation"

legal:
  mainArticles: ["L.217-9"]
  disclaimer: true
  lastUpdated: "${today}"

sections:
  - id: "introduction"
    title: "Introduction"
    icon: "Info"
    type: "content"
    content: |
      Votre contenu ici avec **gras** et _italique_.
      
      Vous pouvez référencer des articles (art. L.217-9).
    
    alert:
      type: "info"
      title: "À retenir"
      content: "Point important à mettre en avant."
    
    badges:
      - text: "Important"
        tone: "red"
      - text: "2024"
        tone: "blue"
    
    cta:
      label: "Créer ma lettre"
      href: "/eligibilite"
      icon: "ChevronRight"
      variant: "primary"
`;
}

/**
 * Met à jour la date lastUpdated dans le YAML
 */
function updateYAMLTimestamp(yamlContent: string): string {
  const today = new Date().toISOString().split('T')[0];

  // Recherche et remplacement de la date lastUpdated
  return yamlContent.replace(/(\s*)lastUpdated:\s*["']?[\d-]+["']?/, `$1lastUpdated: "${today}"`);
}
