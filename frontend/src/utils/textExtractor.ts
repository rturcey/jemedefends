// frontend/src/utils/textExtractor.ts

/**
 * Extrait du texte propre depuis un HTML avec CSS
 */
export function extractCleanText(htmlContent: string): string {
  // Créer un DOM temporaire
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Supprimer complètement les éléments indésirables
  const elementsToRemove = ['style', 'script', 'meta', 'link', 'title'];
  elementsToRemove.forEach(tag => {
    const elements = tempDiv.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].remove();
    }
  });

  // Récupérer le texte brut
  let cleanText = tempDiv.textContent || tempDiv.innerText || '';

  // Nettoyage avancé du texte
  cleanText = cleanText
    // Supprimer les sauts de ligne multiples
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Supprimer les espaces multiples
    .replace(/[ \t]+/g, ' ')
    // Supprimer les espaces en début/fin de ligne
    .replace(/^[ \t]+|[ \t]+$/gm, '')
    // Nettoyer le début et la fin
    .trim();

  // Si le texte est vide ou trop court, fallback
  if (!cleanText || cleanText.length < 50) {
    console.warn('Texte extrait trop court:', cleanText);
    return "Erreur lors de l'extraction du texte. Veuillez réessayer.";
  }

  return cleanText;
}

/**
 * Variante pour copie dans le presse-papier (avec formatage)
 */
export function extractTextForClipboard(htmlContent: string): string {
  const cleanText = extractCleanText(htmlContent);

  // Ajouter une en-tête pour le presse-papier
  const header = '=== LETTRE DE MISE EN DEMEURE ===\n\n';
  const footer = '\n\n=== Généré via jemedefends.fr ===';

  return header + cleanText + footer;
}

/**
 * Variante pour affichage (avec préservation de certains retours à la ligne)
 */
export function extractTextForDisplay(htmlContent: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Supprimer styles et scripts
  const elementsToRemove = ['style', 'script', 'meta', 'link'];
  elementsToRemove.forEach(tag => {
    const elements = tempDiv.getElementsByTagName(tag);
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].remove();
    }
  });

  // Convertir certains éléments HTML en retours à la ligne
  const blockElements = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br'];
  blockElements.forEach(tag => {
    const elements = tempDiv.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (tag === 'br') {
        element.replaceWith('\n');
      } else {
        // Ajouter un retour à la ligne après l'élément
        const text = element.textContent || '';
        element.replaceWith(text + '\n');
      }
    }
  });

  let cleanText = tempDiv.textContent || tempDiv.innerText || '';

  // Nettoyage final
  cleanText = cleanText
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Pas plus de 2 retours consécutifs
    .replace(/^[ \t]+|[ \t]+$/gm, '') // Espaces début/fin de ligne
    .trim();

  return cleanText;
}
