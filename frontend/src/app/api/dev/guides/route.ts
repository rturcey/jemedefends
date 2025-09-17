import { promises as fs } from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

const DEV_OVERRIDES_PATH = path.join(process.cwd(), 'dev-guides-overrides.json');

/**
 * GET /api/dev/guides - Liste tous les overrides actifs
 */
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'API disponible uniquement en développement' },
      { status: 403 },
    );
  }

  try {
    const content = await fs.readFile(DEV_OVERRIDES_PATH, 'utf8');
    const overrides = JSON.parse(content);

    return NextResponse.json({
      overrides: Object.keys(overrides).map(slug => ({
        slug,
        lastModified: overrides[slug].lastModified,
        hasOriginalBackup: !!overrides[slug].originalBackup,
      })),
    });
  } catch (error) {
    // Fichier n'existe pas = pas d'overrides
    return NextResponse.json({ overrides: [] });
  }
}
