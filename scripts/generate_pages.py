# mypy: ignore-errors

import os
import yaml
import re
import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from jinja2 import Environment, FileSystemLoader
from dataclasses import dataclass
from urllib.parse import urljoin
import markdown


@dataclass
class PageConfig:
    page_id: str
    page_data: Dict[str, Any]
    global_config: Dict[str, Any]


class MarkdownProcessor:
    """Traitement sécurisé du Markdown vers HTML"""

    def __init__(self):
        self.md = markdown.Markdown(
            extensions=['extra', 'codehilite', 'toc'],
            extension_configs={
                'codehilite': {'css_class': 'highlight'},
                'toc': {'anchorlink': True}
            }
        )

    def process(self, content: str) -> str:
        """Convertit Markdown en HTML sécurisé"""
        if not content:
            return ""

        # Nettoyage préventif
        content = content.strip()

        # Conversion MD → HTML
        html = self.md.convert(content)

        # Reset pour prochaine utilisation
        self.md.reset()

        return html


class SEODataGenerator:
    """Génération des données SEO structurées"""

    def __init__(self, base_url: str):
        self.base_url = base_url

    def generate_breadcrumb_schema(self, breadcrumbs: List[str], all_pages: Dict[str, Any]) -> Dict[str, Any]:
        """Génère le schéma BreadcrumbList"""
        items = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": self.base_url
            }
        ]

        for i, page_id in enumerate(breadcrumbs, 2):
            if page_id in all_pages:
                page = all_pages[page_id]
                items.append({
                    "@type": "ListItem",
                    "position": i,
                    "name": page["seo"]["h1"],
                    "item": urljoin(self.base_url, page["seo"]["canonical"])
                })

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items
        }

    def generate_faq_schema(self, faq_items: List[Dict[str, str]]) -> Optional[Dict[str, Any]]:
        """Génère le schéma FAQPage si FAQ présentes"""
        if not faq_items:
            return None

        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": faq["question"],
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq["answer"]
                    }
                }
                for faq in faq_items
            ]
        }

    def generate_howto_schema(self, how_to_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Génère le schéma HowTo si procédure présente"""
        if not how_to_data or not how_to_data.get("steps"):
            return None

        return {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": how_to_data["title"],
            "step": [
                {
                    "@type": "HowToStep",
                    "name": step["title"],
                    "text": step["content"]
                }
                for step in how_to_data["steps"]
            ]
        }


class PageGenerator:
    """Générateur de pages optimisé et normalisé"""

    def __init__(self, base_url: str = "https://jemedefends.fr"):
        self.base_url = base_url
        self.template_env = Environment(
            loader=FileSystemLoader("./app/templates"),
            autoescape=True
        )

        # Ajout du filtre markdown
        self.markdown_processor = MarkdownProcessor()
        self.template_env.filters['markdown'] = self.markdown_processor.process

        # Filtre pour JSON sérialisé
        self.template_env.filters['tojson'] = lambda obj: json.dumps(obj, ensure_ascii=False, indent=2)

        self.output_dir = Path("./app/static/garantie_pages")
        self.data_dir = Path("data")
        self.seo_generator = SEODataGenerator(base_url)

        # Création des dossiers
        self.output_dir.mkdir(exist_ok=True)

    def load_data(self) -> Dict[str, Any]:
        """Charge les données normalisées"""
        with open(self.data_dir / "content.yaml", "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

    def slugify(self, text: str) -> str:
        """Conversion texte → slug URL-safe"""
        text = text.lower()
        # Caractères accentués
        replacements = {
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
            'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
            'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
            'ç': 'c', 'ñ': 'n'
        }
        for old, new in replacements.items():
            text = text.replace(old, new)

        # Nettoyage
        text = re.sub(r'[^a-z0-9\s-]', '', text)
        text = re.sub(r'[\s-]+', '-', text)
        return text.strip('-')

    def get_related_pages_data(self, related_ids: List[str], all_pages: Dict[str, Any]) -> List[Dict[str, str]]:
        """Récupère les données des pages liées"""
        related_data = []

        for page_id in related_ids[:6]:  # Limite à 6 liens
            if page_id in all_pages:
                page = all_pages[page_id]
                related_data.append({
                    "title": page["seo"]["h1"],
                    "url": urljoin(self.base_url, page["seo"]["canonical"]),
                    "excerpt": self._generate_excerpt(page)
                })

        return related_data

    def _generate_excerpt(self, page_data: Dict[str, Any]) -> str:
        """Génère un extrait pour les liens connexes"""
        intro = page_data.get("content", {}).get("introduction", "")
        if intro:
            # Extraction du premier phrase sans markdown
            clean_intro = re.sub(r'\*\*(.*?)\*\*', r'\1', intro)  # Remove bold
            clean_intro = re.sub(r'\*(.*?)\*', r'\1', clean_intro)  # Remove italic
            clean_intro = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', clean_intro)  # Remove links

            # Première phrase (jusqu'au premier point)
            first_sentence = clean_intro.split('.')[0]
            if len(first_sentence) > 120:
                return first_sentence[:117] + "..."
            return first_sentence + "."

        return f"Découvrez vos droits concernant {page_data['seo']['h1'].lower()}"

    def build_template_context(self, config: PageConfig) -> Dict[str, Any]:
        """Construit le contexte complet pour le template"""
        page_data = config.page_data
        global_config = config.global_config

        # Données SEO de base
        seo = page_data["seo"]
        hero = page_data["hero"]
        content = page_data["content"]

        # Génération des breadcrumbs
        breadcrumb_schema = self.seo_generator.generate_breadcrumb_schema(
            seo["breadcrumbs"],
            global_config["pages"]
        )

        # Schémas optionnels
        faq_schema = self.seo_generator.generate_faq_schema(
            content.get("faq", [])
        )

        howto_schema = self.seo_generator.generate_howto_schema(
            content.get("how_to", {})
        )

        # Pages liées
        related_links = self.get_related_pages_data(
            seo["related"],
            global_config["pages"]
        )

        # Construction sections de contenu
        content_sections = self._build_content_sections(content)

        # Génération TOC
        toc_items = self._generate_toc_items(content_sections)

        return {
            # Méta SEO
            "meta_title": seo["meta_title"],
            "meta_description": seo["meta_description"],
            "canonical_url": urljoin(self.base_url, seo["canonical"]),
            "noindex": seo["noindex"],
            "base_url": self.base_url,

            # Hero
            "page_title": hero["title"],
            "page_subtitle": hero["subtitle"],
            "page_badges": hero["badges"],
            "key_facts": hero.get("key_facts", []),

            # Breadcrumb
            "breadcrumb_items": self._build_breadcrumb_items(seo["breadcrumbs"], global_config),

            # Contenu
            "show_toc": len(toc_items) > 1,
            "toc_items": toc_items,
            "introduction": content.get("introduction", ""),
            "content_sections": content_sections,
            "related_links": related_links,

            # Schémas JSON-LD
            "breadcrumb_schema": breadcrumb_schema,
            "faq_schema": faq_schema,
            "howto_schema": howto_schema,

            # Contact info si disponible
            "contact_info": page_data.get("contact_info"),
            "global_contact": global_config.get("global", {}).get("contact", {})
        }

    def _build_breadcrumb_items(self, breadcrumb_ids: List[str], global_config: Dict[str, Any]) -> List[Dict[str, str]]:
        """Construit les éléments de breadcrumb pour le template"""
        items = []

        for page_id in breadcrumb_ids:
            if page_id in global_config["pages"]:
                page = global_config["pages"][page_id]
                items.append({
                    "name": page["seo"]["h1"],
                    "url": urljoin(self.base_url, page["seo"]["canonical"])
                })

        return items

    def _build_content_sections(self, content: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transforme le contenu en sections pour le template"""
        sections = []

        # Sections principales
        for section in content.get("sections", []):
            sections.append({
                "type": "heading",
                "level": "h2",
                "title": section["title"],
                "anchor": section["anchor"]
            })
            sections.append({
                "type": "content",
                "content": section["content"]
            })

        # Section How-to si présente
        if "how_to" in content and content["how_to"].get("steps"):
            sections.append({
                "type": "heading",
                "level": "h2",
                "title": content["how_to"]["title"],
                "anchor": "procedure"
            })
            sections.append({
                "type": "steps",
                "title": content["how_to"]["title"],
                "steps": content["how_to"]["steps"]
            })

        # Section FAQ si présente
        if content.get("faq"):
            sections.append({
                "type": "heading",
                "level": "h2",
                "title": "Questions fréquentes",
                "anchor": "faq"
            })
            sections.append({
                "type": "faq",
                "title": "Questions fréquentes",
                "faq_items": content["faq"]  # Changé de 'items' à 'faq_items'
            })

        # CTA final
        sections.append({
            "type": "cta",
            "title": "Testez votre éligibilité",
            "description": "Vérifiez en 3 minutes si vous pouvez faire valoir la garantie légale.",
            "url": f"{self.base_url}/eligibilite",
            "cta_text": "Faire le test gratuit",
            "icon": "🚀"
        })

        return sections

    def _generate_toc_items(self, content_sections: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """Génère les éléments du sommaire"""
        toc_items = []

        for section in content_sections:
            if section["type"] == "heading" and section.get("anchor"):
                toc_items.append({
                    "title": section["title"],
                    "anchor": section["anchor"]
                })

        return toc_items

    def get_output_path(self, page_data: Dict[str, Any]) -> Path:
        """Calcule le chemin de sortie basé sur le type et slug"""
        page_type = page_data["type"]
        slug = page_data["seo"]["slug"]

        # Mapping type → dossier
        type_mapping = {
            "pilier": f"{slug}",
            "categorie": f"produits/{slug}",
            "produit": self._get_product_path(page_data, slug),
            "enseigne": f"enseignes/{slug}",
            "marque": f"marques/{slug}",
            "panne": f"pannes/{slug}"
        }

        folder_path = type_mapping.get(page_type, slug)
        return self.output_dir / folder_path / "index.html"

    def _get_product_path(self, page_data: Dict[str, Any], slug: str) -> str:
        """Détermine le chemin pour un produit selon sa catégorie"""
        # Logique basée sur les relations ou catégorie implicite
        breadcrumbs = page_data["seo"]["breadcrumbs"]

        if "electromenager" in breadcrumbs:
            return f"produits/electromenager/{slug}"
        elif "smartphone" in breadcrumbs:
            return f"produits/smartphone/{slug}"
        elif "informatique" in breadcrumbs:
            return f"produits/informatique/{slug}"
        else:
            return f"produits/{slug}"

    def validate_page_data(self, page_id: str, page_data: Dict[str, Any]) -> bool:
        """Validation des données de page"""
        required_fields = {
            "type": str,
            "seo": dict,
            "hero": dict,
            "content": dict
        }

        for field, expected_type in required_fields.items():
            if field not in page_data:
                print(f"❌ Page {page_id}: champ '{field}' manquant")
                return False
            if not isinstance(page_data[field], expected_type):
                print(f"❌ Page {page_id}: champ '{field}' doit être {expected_type.__name__}")
                return False

        # Validation SEO
        seo_required = ["slug", "h1", "meta_title", "meta_description", "canonical"]
        for field in seo_required:
            if field not in page_data["seo"]:
                print(f"❌ Page {page_id}: SEO field '{field}' manquant")
                return False

        # Validation longueurs
        if len(page_data["seo"]["meta_title"]) > 64:
            print(f"⚠️  Page {page_id}: meta_title trop long ({len(page_data['seo']['meta_title'])} chars)")

        if not (150 <= len(page_data["seo"]["meta_description"]) <= 160):
            print(f"⚠️  Page {page_id}: meta_description longueur sous-optimale ({len(page_data['seo']['meta_description'])} chars)")

        return True

    def generate_page(self, page_id: str, page_data: Dict[str, Any], global_config: Dict[str, Any]) -> None:
        """Génère une page individuelle"""

        # Validation
        if not self.validate_page_data(page_id, page_data):
            print(f"❌ Génération annulée pour {page_id}")
            return

        try:
            # Configuration
            config = PageConfig(page_id, page_data, global_config)

            # Contexte template
            context = self.build_template_context(config)

            # Rendu
            template = self.template_env.get_template("template_base.html")
            html_content = template.render(context)

            # Écriture
            output_path = self.get_output_path(page_data)
            output_path.parent.mkdir(parents=True, exist_ok=True)

            with open(output_path, "w", encoding="utf-8") as f:
                f.write(html_content)

            print(f"✅ Généré: {output_path}")

        except Exception as e:
            print(f"❌ Erreur génération {page_id}: {e}")
            import traceback
            traceback.print_exc()

    def generate_all_pages(self) -> None:
        """Génère toutes les pages"""
        try:
            data = self.load_data()
            global_config = data
            pages = data["pages"]

            print(f"🚀 Génération de {len(pages)} pages...")

            for page_id, page_data in pages.items():
                self.generate_page(page_id, page_data, global_config)

            print("🎉 Génération terminée !")
            self._generate_summary(pages)

        except Exception as e:
            print(f"❌ Erreur fatale: {e}")
            import traceback
            traceback.print_exc()
            raise

    def _generate_summary(self, pages: Dict[str, Any]) -> None:
        """Génère un résumé de la génération"""
        by_type = {}
        for page_data in pages.values():
            page_type = page_data["type"]
            by_type[page_type] = by_type.get(page_type, 0) + 1

        print("\n📊 Résumé de génération:")
        for page_type, count in by_type.items():
            print(f"   {page_type}: {count} page(s)")

        print(f"\n🌐 Pages accessibles sur {self.base_url}")


def main():
    """Point d'entrée principal"""
    generator = PageGenerator()
    generator.generate_all_pages()


if __name__ == "__main__":
    main()