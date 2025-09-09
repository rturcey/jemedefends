import { LEGAL_GROUPS, LEGAL_TEXTS } from '@/constants/legal';

function isRecent(dateIso?: string, months = 18) {
  if (!dateIso) return false;
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  return diffMonths <= months;
}

describe('LEGAL corpus integrity', () => {
  test('All grouped articles exist in LEGAL_TEXTS', () => {
    const allIds = Object.values(LEGAL_GROUPS)
      .flat()
      .map(a => a.id);
    for (const id of allIds) {
      expect(LEGAL_TEXTS[id]).toBeTruthy();
    }
  });

  test('Each article has exact text and recent lastVerified (if hydraté)', () => {
    const allIds = Object.values(LEGAL_GROUPS)
      .flat()
      .map(a => a.id);
    for (const id of allIds) {
      const a = LEGAL_TEXTS[id];
      if (a.text) {
        expect(a.text.trim().length).toBeGreaterThan(40);
        expect(isRecent(a.lastVerified, 18)).toBe(true);
      }
    }
  });
});
