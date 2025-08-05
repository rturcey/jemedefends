// src/lib/normalizeName.ts
const PARTICLES = new Set([
  'de',
  'du',
  'des',
  'd',
  'la',
  'le',
  'les',
  'l',
  'aux',
  'au',
  'von',
  'van',
  'der',
  'den',
  'da',
  'di',
]);

function capitalizeToken(token: string): string {
  if (!token) return token;
  // Gestion d’abréviations/all-caps (ex: EDF) → on laisse tel quel
  if (token === token.toUpperCase() && token.length <= 4) return token;

  // Gestion L', D', etc.
  const apos = token.indexOf("'");
  if (apos > 0 && apos < token.length - 1) {
    const left = token.slice(0, apos);
    const right = token.slice(apos + 1);
    const leftPart =
      left.length === 1 ? left.toUpperCase() : left[0].toUpperCase() + left.slice(1).toLowerCase();
    return `${leftPart}'${right[0].toUpperCase()}${right.slice(1).toLowerCase()}`;
  }

  // Gestion double-barres (Marie-Claire, Jean-Paul)
  if (token.includes('-')) {
    return token
      .split('-')
      .map(part => capitalizeToken(part))
      .join('-');
  }

  // Particules non capitalisées (sauf si premier mot)
  const lower = token.toLowerCase();
  if (PARTICLES.has(lower)) return lower === 'd' || lower === 'l' ? `${lower}'` : lower;

  return token[0].toUpperCase() + token.slice(1).toLowerCase();
}

/** Met en forme un nom complet (prénom(s) + nom), en respectant les particules. */
export function normalizeName(input: string): string {
  if (!input) return input;
  const raw = input.trim().replace(/\s+/g, ' ');
  const tokens = raw.split(' ');

  return (
    tokens
      .map((t, idx) => {
        const clean = t.replace(/\u00A0/g, ' ');
        // La 1ère position ne doit pas être en particule minuscule si ça commence par D'/L'
        if (idx === 0) return capitalizeToken(clean);
        return capitalizeToken(clean);
      })
      .join(' ')
      // Ajuste d' / l' en minuscule si suivi d'une majuscule
      .replace(/\bD'(?=[A-ZÀ-ÖØ-Þ])/g, "d'")
      .replace(/\bL'(?=[A-ZÀ-ÖØ-Þ])/g, "l'")
  );
}
