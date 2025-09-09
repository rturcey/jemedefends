import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validateGuideYAML } from '@/lib/yaml-guide-converter';
import { getFullGuide, addGuideYAML } from '@/lib/guide-registry';

// Chemin du fichier de persistence des overrides
const DEV_OVERRIDES_PATH = path.join(process.cwd(), 'dev-guides-overrides.json');

interface DevOverrides {
  [slug: string]: {
    yaml: string;
    lastModified: string;
    originalBackup?: string;
  };
}

/**
 * Charge les overrides depuis le fichier JSON
 */
async function loadDevOverrides(): Promise<DevOverrides> {
  try {
    const content = await fs.readFile(DEV_OVERRIDES_PATH, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    // Fichier n'existe pas encore, retourner objet vide
    return {};
  }
}

/**
 * Sauvegarde les overrides dans le fichier JSON
 */
async function saveDevOverrides(overrides: DevOverrides): Promise<void> {
  await fs.writeFile(DEV_OVERRIDES_PATH, JSON.stringify(overrides, null, 2), 'utf8');
}

/**
 * GET /api/dev/guides/[slug] - Récupère le YAML d'un guide
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  // Sécurité : Seulement en développement
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'API disponible uniquement en développement' },
      { status: 403 },
    );
  }

  try {
    const { slug } = await params;

    // Charger les overrides
    const overrides = await loadDevOverrides();

    // Si un override existe, le retourner
    if (overrides[slug]) {
      return NextResponse.json({
        slug,
        yaml: overrides[slug].yaml,
        isOverride: true,
        lastModified: overrides[slug].lastModified,
      });
    }

    // Sinon, récupérer depuis le registry original
    const guide = getFullGuide(slug);
    if (!guide) {
      return NextResponse.json({ error: 'Guide non trouvé' }, { status: 404 });
    }

    // Récupérer le YAML original depuis le registry
    // Note: Il faudra peut-être ajouter une fonction pour récupérer le YAML brut
    return NextResponse.json({
      slug,
      yaml: getOriginalYAMLForSlug(slug), // À implémenter
      isOverride: false,
      lastModified: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erreur GET /api/dev/guides/[slug]:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PUT /api/dev/guides/[slug] - Sauvegarde le YAML d'un guide
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  // Sécurité : Seulement en développement
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'API disponible uniquement en développement' },
      { status: 403 },
    );
  }

  try {
    const { slug } = await params;
    const body = await request.json();
    const { yaml } = body;

    if (!yaml) {
      return NextResponse.json({ error: 'Contenu YAML requis' }, { status: 400 });
    }

    // Validation du YAML
    const validation = validateGuideYAML(yaml);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'YAML invalide',
          validationErrors: validation.errors,
        },
        { status: 400 },
      );
    }

    // Charger les overrides existants
    const overrides = await loadDevOverrides();

    // Sauvegarder l'original si c'est la première modification
    if (!overrides[slug]) {
      overrides[slug] = {
        yaml: '',
        lastModified: '',
        originalBackup: getOriginalYAMLForSlug(slug),
      };
    }

    // Mettre à jour l'override
    overrides[slug].yaml = yaml;
    overrides[slug].lastModified = new Date().toISOString();

    // Sauvegarder le fichier
    await saveDevOverrides(overrides);

    // Mettre à jour le cache en mémoire
    addGuideYAML(slug, yaml);

    return NextResponse.json({
      success: true,
      slug,
      lastModified: overrides[slug].lastModified,
    });
  } catch (error) {
    console.error('Erreur PUT /api/dev/guides/[slug]:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * DELETE /api/dev/guides/[slug] - Supprime l'override et restaure l'original
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'API disponible uniquement en développement' },
      { status: 403 },
    );
  }

  try {
    const { slug } = await params;

    const overrides = await loadDevOverrides();

    if (!overrides[slug]) {
      return NextResponse.json({ error: 'Aucun override à supprimer' }, { status: 404 });
    }

    // Restaurer l'original
    const originalYaml = overrides[slug].originalBackup || getOriginalYAMLForSlug(slug);
    addGuideYAML(slug, originalYaml);

    // Supprimer l'override
    delete overrides[slug];
    await saveDevOverrides(overrides);

    return NextResponse.json({
      success: true,
      message: 'Override supprimé, guide original restauré',
    });
  } catch (error) {
    console.error('Erreur DELETE /api/dev/guides/[slug]:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
