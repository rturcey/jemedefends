'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Guide {
  slug: string;
  title: string;
  description: string;
  category: {
    name: string;
    color: string; // ex: 'blue' | 'indigo' | 'green' | 'purple' | 'orange' | 'pink' | 'yellow' | 'gray'
    emoji: string;
  };
}

interface GuideNavigationProps {
  guides: Guide[];
  title?: string;
}

/**
 * Composant client pour la navigation entre guides
 * Utilise Next.js router pour une navigation fluide
 */
function GuideNavigation({ guides, title = 'Guides connexes' }: GuideNavigationProps) {
  const router = useRouter();

  const handleGuideClick = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/guides/${slug}`);
  };

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, idx) => (
            <motion.div
              key={guide.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={`/guides/${guide.slug}`}
                onClick={e => handleGuideClick(guide.slug, e)}
                className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                prefetch
              >
                <div className="flex items-start justify-between mb-3">
                  {/* NOTE: pour Tailwind, pensez à safelister bg-*-100 via la config si vous injectez la couleur dynamiquement */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-${guide.category.color}-100`}
                  >
                    <span className="text-sm">{guide.category.emoji}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {guide.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3">{guide.description}</p>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  {/* Idem: safelist text-*-800 */}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium bg-${guide.category.color}-100 text-${guide.category.color}-800`}
                  >
                    {guide.category.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Hook personnalisé pour la navigation fluide entre guides
export function useGuideNavigation() {
  const router = useRouter();

  const navigateToGuide = (slug: string) => {
    router.push(`/guides/${slug}`, { scroll: true });
  };

  const navigateToGuides = () => {
    router.push('/guides');
  };

  return {
    navigateToGuide,
    navigateToGuides,
  };
}

export default GuideNavigation;
