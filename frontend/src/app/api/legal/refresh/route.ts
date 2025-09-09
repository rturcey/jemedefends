export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const generated = await ingestAllFromLegifrance();
    writeGeneratedJson(generated);
    return NextResponse.json({ ok: true, count: Object.keys(generated).length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
