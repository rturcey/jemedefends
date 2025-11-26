const fs = require('fs');
const path = require('path');

// Paths
const GUIDES_BASE_PATH = path.join(process.cwd(), 'src/content/guides');
const OUTPUT_PATH = path.join(process.cwd(), 'src/lib/generated-guides.ts');

/**
 * Script de génération des guides statiques
 */
async function buildGuidesRegistry() {
  console.log('🔨 Génération du registry des guides...');

  const registry = {};
  let totalGuides = 0;

  try {
    // Vérifier que le dossier guides existe
    if (!fs.existsSync(GUIDES_BASE_PATH)) {
      console.warn(` Dossier guides non trouvé: ${GUIDES_BASE_PATH}`);
      console.log('📁 Création du dossier guides...');
      fs.mkdirSync(GUIDES_BASE_PATH, { recursive: true });

      // Créer les sous-dossiers
      ['general', 'tech', 'automobile', 'commerce', 'maison', 'mode', 'numerique'].forEach(
        category => {
          const categoryPath = path.join(GUIDES_BASE_PATH, category);
          fs.mkdirSync(categoryPath, { recursive: true });
          console.log(`   ✓ Dossier créé: ${category}/`);
        },
      );
    }

    // Lire tous les sous-dossiers
    const categories = fs.readdirSync(GUIDES_BASE_PATH, { withFileTypes: true });

    for (const categoryEntry of categories) {
      if (!categoryEntry.isDirectory()) continue;

      const categoryPath = path.join(GUIDES_BASE_PATH, categoryEntry.name);
      let categoryCount = 0;

      try {
        // Lire tous les fichiers .yaml de ce dossier
        const files = fs.readdirSync(categoryPath);
        const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

        for (const yamlFile of yamlFiles) {
          const filePath = path.join(categoryPath, yamlFile);
          const slug = path.basename(yamlFile, '.yaml');

          try {
            const yamlContent = fs.readFileSync(filePath, 'utf8');

            // Escape les backticks et backslashes pour la génération
            const escapedContent = yamlContent
              .replace(/\\/g, '\\\\')
              .replace(/`/g, '\\`')
              .replace(/\${/g, '\\${');

            registry[slug] = escapedContent;
            categoryCount++;
            totalGuides++;
          } catch (error) {
            console.error(`❌ Erreur lecture ${filePath}:`, error.message);
          }
        }

        if (categoryCount > 0) {
          console.log(`   ✓ ${categoryEntry.name}: ${categoryCount} guide(s)`);
        }
      } catch (error) {
        console.error(`❌ Erreur lecture dossier ${categoryEntry.name}:`, error.message);
      }
    }

    // Générer le fichier TypeScript
    const timestamp = new Date().toISOString();
    const fileContent = `// ============================================================================
// GUIDES GÉNÉRÉS AUTOMATIQUEMENT - NE PAS MODIFIER MANUELLEMENT
// Généré le: ${timestamp}
// Total guides: ${totalGuides}
// ============================================================================

/**
 * Registry des guides YAML générés à partir de content/guides/**
 * Clé = slug du guide (nom du fichier sans .yaml)
 * Valeur = contenu YAML en string
 */
export const GENERATED_GUIDES_REGISTRY: Record<string, string> = {
${Object.entries(registry)
  .map(([slug, content]) => `  '${slug}': \`${content}\``)
  .join(',\n')}
};

/**
 * Métadonnées de génération
 */
export const GENERATION_META = {
  timestamp: '${timestamp}',
  totalGuides: ${totalGuides},
  buildScript: 'scripts/build-guides.js'
};

/**
 * Liste de tous les slugs disponibles
 */
export const ALL_GUIDE_SLUGS = [
${Object.keys(registry)
  .map(slug => `  '${slug}'`)
  .join(',\n')}
];
`;

    // Écrire le fichier généré
    fs.writeFileSync(OUTPUT_PATH, fileContent, 'utf8');

    console.log(`🎯 Génération terminée: ${totalGuides} guides`);
    console.log(`📄 Fichier généré: ${OUTPUT_PATH}`);

    return { totalGuides, registry: Object.keys(registry) };
  } catch (error) {
    console.error('❌ Erreur génération guides:', error);
    process.exit(1);
  }
}

// Exécution si appelé directement
if (require.main === module) {
  buildGuidesRegistry()
    .then(result => {
      console.log('Build terminé avec succès');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Build échoué:', error);
      process.exit(1);
    });
}

module.exports = { buildGuidesRegistry };
