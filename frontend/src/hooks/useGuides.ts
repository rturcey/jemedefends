import { getAllGuides, getFullGuide } from '@/lib/guide-registry';

export function useGuides() {
  return getAllGuides();
}

export function useGuide(slug: string) {
  return getFullGuide(slug);
}
