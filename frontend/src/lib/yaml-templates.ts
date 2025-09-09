// ============================================================================
// TEMPLATE YAML POUR NOUVEAU GUIDE
// ============================================================================

// *** src/lib/yaml-templates.ts ***
export const YAML_GUIDE_TEMPLATE = `title: "Mon nouveau guide"
description: "Description courte du guide"
category: "general"
slug: "mon-nouveau-guide"

seo:
  title: "Mon nouveau guide - Je me défends"
  description: "Guide pratique pour comprendre..."
  keywords:
    - "mot-clé 1"
    - "mot-clé 2"

legal:
  mainArticles: ["L.217-9"]
  disclaimer: true
  lastUpdated: "${new Date().toISOString().split('T')[0]}"

sections:
  - id: "introduction"
    title: "Introduction"
    icon: "Info"
    type: "content"
    content: |
      Contenu de l'introduction avec **gras** et _italique_.
      
      Vous pouvez référencer des articles (art. L.217-9).
      
  - id: "section-principale"
    title: "Section principale"
    icon: "BookOpen"
    type: "content"
    content: |
      Contenu principal du guide.
    alert:
      type: "info"
      title: "À savoir"
      content: "Information importante à retenir."
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
