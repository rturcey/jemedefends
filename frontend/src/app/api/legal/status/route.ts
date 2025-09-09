import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const ids = Array.from(
    new Set(
      Object.values(LEGAL_GROUPS)
        .flat()
        .map(a => a.id),
    ),
  ) as LegalArticleId[];

  const items = ids.map(id => {
    const a = LEGAL_ARTICLES[id];
    const textLen = a?.text ? a.text.length : 0;
    return {
      id,
      label: a?.label ?? id,
      url: a?.url ?? null,
      lastVerified: a?.lastVerified ?? null,
      textLength: textLen,
      hasText: Boolean(a?.text && a.text.trim().length > 0),
    };
  });

  const total = items.length;
  const hydrated = items.filter(i => i.hasText).length;

  return NextResponse.json({
    total,
    hydrated,
    coverage: total ? Math.round((hydrated / total) * 100) : 0,
    items,
  });
}
