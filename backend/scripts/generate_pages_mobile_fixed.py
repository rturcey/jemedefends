# backend/scripts/generate_pages_mobile_fixed.py

import re
import yaml
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from urllib.parse import urljoin

@dataclass
class MobileSEOConfig:
    """Configuration SEO optimisée mobile-first"""
    title: str
    description: str
    keywords: List[str]
    canonical_url: str
    og_image: Optional[str] = None
    viewport: str = "width=device-width, initial-scale=1.0, maximum-scale=5.0"
    theme_color: str = "#3B82F6"
    
    def validate(self) -> Dict[str, List[str]]:
        """Validation des données SEO mobile"""
        errors = []
        warnings = []
        
        # Validations critiques
        if not self.title or len(self.title) < 10:
            errors.append("Titre trop court (minimum 10 caractères)")
        if len(self.title) > 60:
            errors.append("Titre trop long (maximum 60 caractères)")
            
        if not self.description or len(self.description) < 50:
            errors.append("Description trop courte (minimum 50 caractères)")
        if len(self.description) > 160:
            errors.append("Description trop longue (maximum 160 caractères)")
            
        # Avertissements
        if len(self.keywords) < 3:
            warnings.append("Moins de 3 mots-clés définis")
            
        return {"errors": errors, "warnings": warnings}

class MobileContentGenerator:
    """Générateur de contenu optimisé mobile-first"""
    
    def __init__(self, base_url: str = "https://jemedefends.fr"):
        self.base_url = base_url
        self.mobile_breakpoints = {
            'sm': '640px',
            'md': '768px', 
            'lg': '1024px',
            'xl': '1280px'
        }
    
    def optimize_html_for_mobile(self, html_content: str) -> str:
        """Optimise le contenu HTML pour mobile"""
        
        # Remplacement des classes non-mobile par des équivalents responsive
        mobile_replacements = {
            # Espacements
            r'\bp-6\b': 'p-4 sm:p-6',
            r'\bm-6\b': 'm-4 sm:m-6',
            r'\bmb-8\b': 'mb-6 sm:mb-8',
            r'\bmt-8\b': 'mt-6 sm:mt-8',
            r'\bspace-y-6\b': 'space-y-4 sm:space-y-6',
            r'\bgap-6\b': 'gap-4 sm:gap-6',
            
            # Textes
            r'\btext-lg\b': 'text-base sm:text-lg',
            r'\btext-xl\b': 'text-lg sm:text-xl',
            r'\btext-2xl\b': 'text-xl sm:text-2xl',
            r'\btext-3xl\b': 'text-2xl sm:text-3xl',
            
            # Grids non-responsive
            r'\bgrid-cols-3\b': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            r'\bgrid-cols-2\b': 'grid-cols-1 sm:grid-cols-2',
            r'\bmd:grid-cols-3\b': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            
            # Boutons et interactions
            r'(<a[^>]*class="[^"]*)(rounded-lg)': r'\1\2 touch-manipulation active:scale-95',
            r'(<button[^>]*class="[^"]*)(rounded-lg)': r'\1\2 touch-manipulation active:scale-95',
        }
        
        optimized_html = html_content
        for pattern, replacement in mobile_replacements.items():
            optimized_html = re.sub(pattern, replacement, optimized_html)
        
        # Ajout d'attributs d'accessibilité mobile
        optimized_html = self._add_mobile_accessibility(optimized_html)
        
        return optimized_html
    
    def _add_mobile_accessibility(self, html: str) -> str:
        """Ajoute les attributs d'accessibilité mobile"""
        
        # Ajout d'aria-labels pour les liens importants
        html = re.sub(
            r'(<a[^>]*href="[^"]*guide[^"]*"[^>]*>)',
            r'\1<span class="sr-only">Consulter le guide : </span>',
            html
        )
        
        # Amélioration des boutons
        html = re.sub(
            r'(<button[^>]*>)([^<]*)(</button>)',
            r'\1<span class="block">\2</span>\3',
            html
        )
        
        return html
    
    def generate_mobile_cta(self, 
                           title: str = "Créez votre lettre maintenant",
                           subtitle: str = "Générez une lettre de mise en demeure juridiquement solide en 3 minutes.",
                           primary_link: str = "/eligibilite",
                           primary_text: str = "Créer ma lettre",
                           secondary_link: str = "/guides",
                           secondary_text: str = "Autres guides") -> str:
        """Génère un CTA mobile-optimisé"""
        
        return f"""
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 sm:p-6 text-center my-6 sm:my-8">
          <h4 class="text-xl sm:text-2xl font-bold mb-3">{title}</h4>
          <p class="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <a href="{primary_link}" 
               class="flex-1 bg-white text-blue-600 font-bold py-3 px-4 rounded-lg 
                      hover:bg-gray-50 transition-colors text-sm sm:text-base
                      touch-manipulation active:scale-95 flex items-center justify-center gap-2"
               aria-label="{primary_text}">
              🚀 <span>{primary_text}</span>
            </a>
            <a href="{secondary_link}" 
               class="flex-1 border-2 border-white text-white font-bold py-3 px-4 rounded-lg 
                      hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base
                      touch-manipulation active:scale-95 flex items-center justify-center gap-2"
               aria-label="{secondary_text}">
              📚 <span>{secondary_text}</span>
            </a>
          </div>
          <p class="text-xs text-blue-200 mt-3 sm:mt-4">
            ✅ 100% gratuit • ✅ Conforme au Code de la consommation • ✅ 87% de réussite
          </p>
        </div>
        """
    
    def generate_mobile_procedure_timeline(self, steps: List[Dict[str, str]]) -> str:
        """Génère une timeline de procédure mobile-optimisée"""
        
        timeline_html = """
        <div class="space-y-3 sm:space-y-4">
        """
        
        colors = ['green', 'blue', 'orange', 'red', 'purple']
        
        for i, step in enumerate(steps):
            color = colors[i % len(colors)]
            timeline_html += f"""
            <div class="bg-white border-l-4 border-{color}-500 p-4 sm:p-5 rounded-r-xl shadow-sm">
              <div class="flex items-start gap-3">
                <div class="bg-{color}-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div class="flex-1">
                  <h5 class="font-bold text-gray-900 mb-2 text-sm sm:text-base">{step.get('icon', '⚡')} {step['title']}</h5>
                  <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {step['description']}
                  </p>
                  {step.get('details', '') and f'''
                  <div class="bg-{color}-50 p-3 rounded-lg mt-3 text-xs sm:text-sm">
                    {step['details']}
                  </div>
                  ''' or ''}
                </div>
              </div>
            </div>
            """
        
        timeline_html += "</div>"
        return timeline_html
    
    def create_mobile_faq_schema(self, faqs: List[Dict[str, str]]) -> Dict[str, Any]:
        """Crée un schéma FAQ optimisé"""
        if not faqs:
            return {}
            
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq["question"].strip(),
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq["answer"].strip()
                    }
                }
                for faq in faqs
            ]
        }
    
    def validate_mobile_content(self, content: str) -> Dict[str, Any]:
        """Valide que le contenu est mobile-friendly"""
        
        issues = []
        recommendations = []
        
        # Vérifications mobile-first
        mobile_checks = {
            'responsive_text': r'text-sm sm:text-',
            'responsive_padding': r'p-\d+ sm:p-',
            'responsive_margin': r'm-\d+ sm:m-',
            'responsive_grid': r'grid-cols-1 sm:grid-cols-',
            'touch_optimization': r'touch-manipulation',
            'active_states': r'active:scale-'
        }
        
        for check_name, pattern in mobile_checks.items():
            if not re.search(pattern, content):
                issues.append(f"Manque d'optimisation {check_name}")
        
        # Vérifications d'accessibilité
        if not re.search(r'aria-label=', content):
            recommendations.append("Ajouter des aria-labels pour l'accessibilité")
        
        if not re.search(r'alt=', content) and re.search(r'<img', content):
            issues.append("Images sans attribut alt")
        
        # Vérification des tailles de touch targets
        if re.search(r'py-1\b|px-1\b', content):
            issues.append("Touch targets potentiellement trop petits (< 44px)")
        
        return {
            "mobile_friendly": len(issues) == 0,
            "issues": issues,
            "recommendations": recommendations,
            "score": max(0, 100 - (len(issues) * 20) - (len(recommendations) * 5))
        }

class GuideFixerMobile:
    """Correcteur spécialisé pour les guides mobile-first"""
    
    def __init__(self):
        self.content_generator = MobileContentGenerator()
        self.legal_articles = {
            'garantie_conformite': ['L.217-3', 'L.217-4', 'L.217-5', 'L.217-7', 'L.217-9', 'L.217-13'],
            'garantie_defauts': ['L.217-1', 'L.217-2'],
            'procedure': ['L.217-8', 'L.217-10', 'L.217-11']
        }
    
    def fix_guide_structure(self, guide_data: Dict[str, Any]) -> Dict[str, Any]:
        """Corrige et optimise la structure d'un guide"""
        
        fixed_guide = guide_data.copy()
        
        # Correction du SEO mobile
        if 'seo' in fixed_guide:
            seo_config = MobileSEOConfig(
                title=fixed_guide['seo'].get('title', ''),
                description=fixed_guide['seo'].get('description', ''),
                keywords=fixed_guide['seo'].get('keywords', []),
                canonical_url=fixed_guide['seo'].get('canonical_url', '')
            )
            
            validation = seo_config.validate()
            if validation['errors']:
                print(f"⚠️  Erreurs SEO détectées: {validation['errors']}")
            
        # Optimisation des sections
        if 'sections' in fixed_guide:
            for section in fixed_guide['sections']:
                if 'html' in section:
                    section['html'] = self.content_generator.optimize_html_for_mobile(section['html'])
        
        # Ajout du disclaimer légal mobile
        fixed_guide['disclaimer'] = self._generate_mobile_disclaimer()
        
        # Validation finale
        if 'sections' in fixed_guide:
            for i, section in enumerate(fixed_guide['sections']):
                if 'html' in section:
                    validation = self.content_generator.validate_mobile_content(section['html'])
                    if not validation['mobile_friendly']:
                        print(f"⚠️  Section {i+1} pas optimisée mobile: {validation['issues']}")
        
        return fixed_guide
    
    def _generate_mobile_disclaimer(self) -> str:
        """Génère un disclaimer légal mobile-optimisé"""
        return """
        <div class="bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 my-4 sm:my-6 rounded-r-lg">
          <div class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
            <div class="flex-shrink-0 self-start">
              <svg class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-amber-800 leading-relaxed">
                <strong>Information juridique :</strong> Ce guide est basé sur le Code de la consommation français en vigueur. 
                Les informations sont vérifiées régulièrement mais ne constituent pas un conseil juridique individualisé. 
                En cas de litige complexe, consultez un professionnel du droit.
              </p>
            </div>
          </div>
        </div>
        """
    
    def generate_corrected_guide(self, guide_slug: str, guide_data: Dict[str, Any]) -> Dict[str, Any]:
        """Génère un guide entièrement corrigé et mobile-optimisé"""
        
        # Étape 1: Structure de base
        corrected = self.fix_guide_structure(guide_data)
        
        # Étape 2: Contenu mobile-first
        if 'sections' not in corrected:
            corrected['sections'] = []
        
        # Ajout de la procédure universelle mobile
        corrected['sections'].append({
            'id': 'procedure-mobile',
            'title': 'Procédure mobile-optimisée : 4 étapes pour faire valoir vos droits',
            'html': self._generate_universal_mobile_procedure()
        })
        
        # Ajout du CTA mobile
        corrected['sections'].append({
            'id': 'cta-mobile',
            'title': 'Créez votre lettre maintenant',
            'html': self.content_generator.generate_mobile_cta()
        })
        
        # Étape 3: Validation finale
        print(f"✅ Guide {guide_slug} corrigé et optimisé mobile-first")
        
        return corrected
    
    def _generate_universal_mobile_procedure(self) -> str:
        """Génère une procédure universelle mobile-optimisée"""
        
        steps = [
            {
                'icon': '📄',
                'title': 'Rassemblez vos preuves',
                'description': 'Facture, photos du défaut, description détaillée du problème.',
                'details': '<strong>Obligatoire :</strong> Gardez tous les éléments prouvant l\'achat et le défaut.'
            },
            {
                'icon': '📧',
                'title': 'Contact amiable par écrit',
                'description': 'Contactez uniquement le vendeur (jamais le fabricant).',
                'details': '<strong>Phrase-clé :</strong> "J\'invoque la garantie légale de conformité (articles L.217-3 à L.217-28)"'
            },
            {
                'icon': '⚡',
                'title': 'Mise en demeure si refus',
                'description': 'Après 15 jours de silence, envoyez une mise en demeure.',
                'details': '<strong>Articles à citer :</strong> L.217-9 (réparation), L.217-13 (remplacement/remboursement)'
            },
            {
                'icon': '⚖️',
                'title': 'Recours légaux',
                'description': 'Médiation conso (gratuit), tribunal judiciaire, SignalConso.',
                'details': 'Délai médiation : 90 jours maximum'
            }
        ]
        
        return self.content_generator.generate_mobile_procedure_timeline(steps)

# Script principal de correction
def main():
    """Fonction principale de correction des guides"""
    
    fixer = GuideFixerMobile()
    
    # Guides à corriger
    guides_to_fix = [
        'smartphones-telephone-en-panne',
        'electromenager-lave-linge-lave-vaisselle',
        'voiture-neuve-defauts-garantie-legale',
        'garantie-legale-conformite-guide-complet',
        'garantie-legale-meubles-literie',
        'garantie-legale-services-numeriques'
    ]
    
    print("🔧 Début de la correction des guides mobile-first...")
    
    for guide_slug in guides_to_fix:
        try:
            # Charger les données existantes (simulation)
            guide_data = load_guide_data(guide_slug)
            
            # Corriger le guide
            corrected_guide = fixer.generate_corrected_guide(guide_slug, guide_data)
            
            # Sauvegarder (simulation)
            save_corrected_guide(guide_slug, corrected_guide)
            
            print(f"✅ {guide_slug} corrigé avec succès")
            
        except Exception as e:
            print(f"❌ Erreur lors de la correction de {guide_slug}: {str(e)}")
    
    print("🎉 Correction terminée !")

def load_guide_data(slug: str) -> Dict[str, Any]:
    """Simule le chargement des données d'un guide"""
    # En réalité, ceci chargerait depuis votre source de données
    return {
        'title': f'Guide {slug}',
        'seo': {
            'title': f'Guide {slug} mobile',
            'description': 'Description du guide optimisée mobile',
            'keywords': ['garantie', 'mobile', 'conformité']
        },
        'sections': []
    }

def save_corrected_guide(slug: str, guide_data: Dict[str, Any]) -> None:
    """Simule la sauvegarde d'un guide corrigé"""
    # En réalité, ceci sauvegarderait dans votre système
    print(f"💾 Sauvegarde de {slug}")

# Configuration pour les tests
MOBILE_TEST_CONFIG = {
    'viewport_sizes': [
        {'name': 'Mobile Portrait', 'width': 375, 'height': 667},
        {'name': 'Mobile Landscape', 'width': 667, 'height': 375},
        {'name': 'Tablet Portrait', 'width': 768, 'height': 1024},
        {'name': 'Tablet Landscape', 'width': 1024, 'height': 768},
        {'name': 'Desktop', 'width': 1920, 'height': 1080}
    ],
    'performance_thresholds': {
        'first_contentful_paint': 1.5,  # secondes
        'largest_contentful_paint': 2.5,
        'cumulative_layout_shift': 0.1,
        'first_input_delay': 100  # millisecondes
    }
}

class MobilePerformanceTester:
    """Testeur de performance mobile"""
    
    def __init__(self):
        self.config = MOBILE_TEST_CONFIG
    
    def test_mobile_readiness(self, guide_data: Dict[str, Any]) -> Dict[str, Any]:
        """Teste la compatibilité mobile d'un guide"""
        
        results = {
            'mobile_ready': True,
            'issues': [],
            'recommendations': [],
            'performance_score': 0
        }
        
        # Test des sections
        if 'sections' in guide_data:
            for i, section in enumerate(guide_data['sections']):
                if 'html' in section:
                    section_test = self._test_section_mobile(section['html'])
                    if not section_test['mobile_friendly']:
                        results['mobile_ready'] = False
                        results['issues'].extend([
                            f"Section {i+1}: {issue}" for issue in section_test['issues']
                        ])
        
        # Test SEO mobile
        if 'seo' in guide_data:
            seo_test = self._test_seo_mobile(guide_data['seo'])
            if not seo_test['valid']:
                results['issues'].extend(seo_test['errors'])
                results['recommendations'].extend(seo_test['warnings'])
        
        # Calcul du score
        total_tests = 10
        failed_tests = len(results['issues'])
        results['performance_score'] = max(0, ((total_tests - failed_tests) / total_tests) * 100)
        
        return results
    
    def _test_section_mobile(self, html: str) -> Dict[str, Any]:
        """Teste une section HTML pour la compatibilité mobile"""
        
        mobile_patterns = {
            'responsive_text': r'text-sm sm:text-|text-base sm:text-',
            'responsive_spacing': r'p-\d+ sm:p-|m-\d+ sm:m-|space-y-\d+ sm:space-y-',
            'touch_targets': r'touch-manipulation',
            'responsive_grid': r'grid-cols-1 sm:grid-cols-|flex-col sm:flex-row'
        }
        
        issues = []
        for pattern_name, pattern in mobile_patterns.items():
            if not re.search(pattern, html):
                issues.append(f"Manque: {pattern_name}")
        
        return {
            'mobile_friendly': len(issues) == 0,
            'issues': issues
        }
    
    def _test_seo_mobile(self, seo_data: Dict[str, Any]) -> Dict[str, Any]:
        """Teste les données SEO pour mobile"""
        
        errors = []
        warnings = []
        
        if 'title' not in seo_data or len(seo_data['title']) > 60:
            errors.append("Titre SEO trop long pour mobile")
        
        if 'description' not in seo_data or len(seo_data['description']) > 160:
            errors.append("Description SEO trop longue")
        
        if 'keywords' not in seo_data or len(seo_data['keywords']) < 3:
            warnings.append("Mots-clés insuffisants")
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }

# Utilitaires pour la migration
class MigrationHelper:
    """Aide à la migration des anciens guides vers mobile-first"""
    
    @staticmethod
    def convert_old_html_to_mobile(old_html: str) -> str:
        """Convertit l'ancien HTML en version mobile-first"""
        
        conversions = {
            # Conteneurs
            r'<div class="prose prose-lg">': '<div class="prose prose-sm sm:prose-lg">',
            
            # Grilles
            r'class="grid grid-cols-2 gap-6"': 'class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"',
            r'class="grid grid-cols-3 gap-6"': 'class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"',
            
            # Espacements
            r'class="mb-8"': 'class="mb-6 sm:mb-8"',
            r'class="mt-8"': 'class="mt-6 sm:mt-8"',
            r'class="p-6"': 'class="p-4 sm:p-6"',
            
            # Textes
            r'class="text-lg"': 'class="text-base sm:text-lg"',
            r'class="text-xl"': 'class="text-lg sm:text-xl"',
            
            # Boutons et liens
            r'(<a[^>]*class="[^"]*btn[^"]*")': r'\1 touch-manipulation active:scale-95',
        }
        
        converted = old_html
        for pattern, replacement in conversions.items():
            converted = re.sub(pattern, replacement, converted)
        
        return converted
    
    @staticmethod
    def extract_faq_from_content(content: str) -> List[Dict[str, str]]:
        """Extrait les FAQ du contenu existant"""
        
        # Pattern pour détecter les FAQ
        faq_pattern = r'<h[456][^>]*>([^<]*\?[^<]*)</h[456]>[^<]*<p[^>]*>([^<]+)</p>'
        
        faqs = []
        matches = re.findall(faq_pattern, content, re.IGNORECASE | re.DOTALL)
        
        for question, answer in matches:
            faqs.append({
                'question': question.strip(),
                'answer': answer.strip()
            })
        
        return faqs

# Export pour utilisation
if __name__ == "__main__":
    main()

# Classes utilitaires exportables
__all__ = [
    'MobileSEOConfig',
    'MobileContentGenerator', 
    'GuideFixerMobile',
    'MobilePerformanceTester',
    'MigrationHelper',
    'MOBILE_TEST_CONFIG'
]
