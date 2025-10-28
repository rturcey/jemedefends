# backend/app/core/ai_service.py - Version reformulation + product normalization (100% IA)

from __future__ import annotations

import logging
import re
import json
from enum import Enum
from typing import Any, Literal

import aiohttp
from pydantic import BaseModel, Field

from app.config import settings
from app.utils.exceptions import ProcessingError

logger = logging.getLogger(__name__)


class ReformulationType(str, Enum):
    """Type unique de reformulation disponible (professionnelle/juridique)."""
    REFORMULATED = "reformulated"  # Reformulation professionnelle (aucune correction isolée)


class ReformulationRequest(BaseModel):
    """Requête de reformulation."""
    text: str = Field(..., min_length=10, max_length=2000, description="Texte à reformuler")
    type: ReformulationType = Field(ReformulationType.REFORMULATED, description="Type de reformulation")
    context: str | None = Field(None, description="Contexte additionnel (optionnel)")


class ReformulationResponse(BaseModel):
    """Réponse de reformulation."""
    original_text: str
    reformulated_text: str
    type: ReformulationType
    success: bool = True
    error: str | None = None


# --------------------------- Product normalization (100% IA) ---------------------------

class ProductNormalizationRequest(BaseModel):
    """
    Requête de normalisation du nom de produit.
    - declared_type : "service" | "bien" (choix utilisateur)
    - raw_name      : nom brut saisi (ex. "freebox pop", "samsung a22+")
    """
    declared_type: Literal["service", "bien"] = Field(..., description='Type déclaré : "service" ou "bien"')
    raw_name: str = Field(..., min_length=2, max_length=200, description="Nom brut du produit/service saisi par l'utilisateur")


class ProductNormalizationResponse(BaseModel):
    """Réponse de normalisation du nom de produit (groupe nominal prêt à injecter)."""
    declared_type: Literal["service", "bien"]
    raw_name: str
    product_name_formatted: str | None = None  # ex. "un abonnement Freebox Pop"
    success: bool = True
    error: str | None = None


# --------------------------------------------------------------------------------------


class ScalewayAIService:
    """Service pour l'IA générative Scaleway."""

    def __init__(self) -> None:
        self.api_url = settings.SCALEWAY_AI_API_URL
        self.api_key = settings.SCALEWAY_AI_API_KEY
        self.model = settings.SCALEWAY_AI_MODEL
        self.region = settings.SCALEWAY_AI_REGION
        self.project_id = settings.SCALEWAY_AI_PROJECT_ID

        if not self.api_key:
            logger.warning("SCALEWAY_AI_API_KEY not configured - AI features disabled")

    # ========================= REFORMULATION (EXISTANT) =========================

    def _get_system_prompt(self, reformulation_type: ReformulationType) -> str:
        """Prompt 2 étapes : 1) comprendre exactement, 2) reformuler pro.
        Étape 1 = raisonnement interne (à NE PAS afficher).
        Sortie = uniquement la phrase reformulée OU 'PROBLEME_INCOMPRIS'."""
        return """Tu es un expert en rédaction juridique française (litiges de consommation).

=== OBJECTIF ===
Produire une ou plusieurs phrases claires et professionnelles décrivant exactement le 
problème de l’utilisateur, sans ajout ni déduction. 
Si le problème est incompréhensible ou ambigu, répondre exactement : PROBLEME_INCOMPRIS.

=== MÉTHODE EN 2 ÉTAPES (ÉTAPE 1 INTERNE, NON AFFICHÉE) ===
ÉTAPE 1 — COMPRENDRE (raisonnement interne, NE PAS AFFICHER) :
- Extraire mentalement et avec exactitude les FAITS présents dans le texte utilisateur uniquement :
  • nature du problème (ce qui ne fonctionne pas, ce qui est cassé, ce qui manque, etc.)
  • éléments techniques/OS/marques cités (recopier exactement les noms propres)
  • dates, durées, fréquences et circonstances explicitement mentionnées
  • polarité “fonctionne / ne fonctionne pas” pour chaque élément cité
- Interdictions absolues : aucune invention, aucune déduction, aucune attribution de propos ou d’intention (“annoncé”, “contrairement à…”, “alors que…”) sauf si ces mots figurent explicitement dans le texte utilisateur.
- Si une information clé manque ou est contradictoire → considérer le problème comme incompris.

ÉTAPE 2 — REFORMULER (SORTIE À AFFICHER UNIQUEMENT) :
- Rédiger une ou plusieurs phrases en français clair et juridique accessible.
- Tout doit être intégralement en français, sauf termes spécifiques et nécessaires.
- Majuscule initiale, point final.
- Conserver strictement tous les faits et la polarité identifiés à l’étape 1, 
ainsi que les dates, durées, fréquences et circonstances pertinentes.
- Vocabulaire autorisé (neutre) : “défaillance”, “dysfonctionnement”, “anomalie”, “de façon intempestive”, “de manière récurrente”, “l’appareil / l’équipement / le dispositif”.
- Recopier à l’identique les noms propres/OS (Windows, macOS/Mac, Ubuntu, etc.).
- Ne pas commencer par “présente un défaut”, ni mentionner “défaut de conformité”.
- Ne rien attribuer à un tiers (vendeur, fabricant) sauf si explicitement écrit par l’utilisateur.
- Si l’étape 1 conclut à une incompréhension → répondre exactement : PROBLEME_INCOMPRIS.

=== EXEMPLES ===
Utilisateur : "mon telephone seteint souvent sai relou"
Réponse : "L’appareil s’éteint de manière récurrente."

Utilisateur : "bluetooth marche plus apres 2 mois"
Réponse : "La fonction Bluetooth a cessé de fonctionner après deux mois d'utilisation."

Utilisateur : "l’écran est tout noir on voit rien"
Réponse : "L’écran demeure totalement noir, rendant l’affichage impossible."

Utilisateur : "j'ai acheté chatgpt via gamsgo mais leur truc marche pas sur ubuntu alors que sur windows et mac oui, et ils veulent que je paye des frais"
Réponse : "Le produit acquis via Gamsgo ne fonctionne pas sous Ubuntu alors qu’il fonctionne sous Windows et Mac, et des frais de remboursement sont exigés."

=== SORTIE ATTENDUE ===
- Afficher UNIQUEMENT la phrase reformulée OU “PROBLEME_INCOMPRIS”. 
- Ne jamais afficher l’étape 1, ni d’explications, ni d’étiquettes (“Reformulation 
:”, etc.) ni la phrase antérieure, tout ou partie de "Or, ce bien présente un défaut 
de conformité."
."""

    def _get_user_prompt(self, text: str, reformulation_type: ReformulationType, context: str | None = None) -> str:
        prompt = f'Description à reformuler :\n"{text}"\n\n'
        if context:
            prompt += f"Contexte additionnel (à ne pas paraphraser si non factuel) : {context}\n\n"
        prompt += (
            "Votre réponse doit être UNE SEULE phrase, claire et professionnelle, décrivant exactement le problème, "
            "sans ajout ni déduction. Majuscule initiale, point final. "
            "N’écrivez rien d’autre que cette phrase (ou PROBLEME_INCOMPRIS).\n"
            'Cette phrase sera insérée après : "Or, ce bien présente un défaut de conformité."'
        )
        return prompt

    def _clean_ai_response(self, ai_text: str) -> str:
        """Nettoie la réponse de l'IA (reformulation uniquement)."""

        # Suppression des guillemets et espaces superflus
        cleaned = ai_text.replace('"', '').replace("'", "'").strip()

        # Suppression des préfixes indésirables que l'IA pourrait ajouter
        prefixes_to_remove = [
            "Voici la reformulation :",
            "Reformulation :",
            "Version corrigée :",
            "Version optimisée :",
            "Description reformulée :",
            "Texte corrigé :",
        ]
        for prefix in prefixes_to_remove:
            if cleaned.lower().startswith(prefix.lower()):
                cleaned = cleaned[len(prefix):].strip()

        # Éviter que l'IA répète la phrase de contexte (on veut une phrase autonome)
        undesirable_starts = [
            "Or, ce",
            "Ce bien présente",
            "Ce service présente",
            "Le défaut de conformité",
            "Il présente un défaut",
        ]
        for start in undesirable_starts:
            if cleaned.lower().startswith(start.lower()):
                cleaned = re.sub(r"^(.*?)(?:\:|\-)\s*", "", cleaned).strip() or cleaned
                if cleaned.lower().startswith(start.lower()):
                    parts = cleaned.split(" ", 3)
                    if len(parts) > 3:
                        cleaned = parts[-1].strip().capitalize()
                break

        # S'assurer majuscule en début
        if cleaned and not cleaned[0].isupper():
            cleaned = cleaned[0].upper() + cleaned[1:]

        # S'assurer point final
        if cleaned and not cleaned.endswith(('.', '!', '?')):
            cleaned += '.'

        # Points multiples -> un seul
        cleaned = re.sub(r'\.{2,}', '.', cleaned)

        return cleaned

    async def reformulate_text(
        self,
        request: ReformulationRequest
    ) -> ReformulationResponse:
        """Reformule un texte via l'IA Scaleway (reformulation uniquement)."""

        if not self.api_key:
            logger.error("Scaleway AI not configured")
            return ReformulationResponse(
                original_text=request.text,
                reformulated_text=request.text,
                type=request.type,
                success=False,
                error="Service IA non configuré"
            )

        try:
            logger.info(
                "Reformulating text via Scaleway AI - Type: %s, Length: %d chars",
                request.type,
                len(request.text)
            )

            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": self._get_system_prompt(request.type)},
                    {"role": "user", "content": self._get_user_prompt(request.text, request.type, request.context)},
                ],
                "max_tokens": 800,      # Réponses courtes/robustes
                "temperature": 0.3,     # Fidélité > créativité
                "top_p": 0.9,
                "stream": False,
            }

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "X-SCW-Region": self.region,
            }
            if self.project_id:
                headers["X-SCW-Project-ID"] = self.project_id

            timeout = aiohttp.ClientTimeout(total=30)

            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(
                    f"{self.api_url}/chat/completions",
                    json=payload,
                    headers=headers
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(
                            "Scaleway AI API error - Status: %d, Response: %s",
                            response.status,
                            error_text
                        )
                        raise ProcessingError(f"Erreur API Scaleway ({response.status}): {error_text}")
                    result = await response.json()

            # Extraction de la réponse
            if "choices" not in result or not result["choices"]:
                raise ProcessingError("Réponse AI invalide : pas de choix disponibles")

            ai_raw = result["choices"][0]["message"]["content"].strip()
            if not ai_raw:
                raise ProcessingError("Réponse AI vide")

            # Nettoyage
            ai_text = self._clean_ai_response(ai_raw)

            # Validation simple
            if len(ai_text) < 5:
                raise ProcessingError("Réponse IA trop courte après nettoyage")
            if len(ai_text) > len(request.text) * 3:
                logger.warning(
                    "AI response length suspicious - Original: %d, AI: %d",
                    len(request.text),
                    len(ai_text)
                )
                raise ProcessingError("Réponse IA anormalement longue")

            # Éviter la redite "défaut de conformité" dans la phrase (déjà dans la lettre)
            if any(expr in ai_text.lower() for expr in ["présente un défaut", "défaut de conformité"]):
                logger.warning("AI response contains undesirable repetition: %s", ai_text)
                ai_text = re.sub(r"(?i)\b(présente un défaut|défaut de conformité)\b[:,]?\s*", "", ai_text).strip()
                if ai_text and not ai_text[0].isupper():
                    ai_text = ai_text[0].upper() + ai_text[1:]
                if ai_text and not ai_text.endswith(('.', '!', '?')):
                    ai_text += '.'

            logger.info(
                "Text reformulated successfully - Original: %d chars, New: %d chars, Cleaned: %s",
                len(request.text),
                len(ai_text),
                ai_text[:50] + "..." if len(ai_text) > 50 else ai_text
            )

            return ReformulationResponse(
                original_text=request.text,
                reformulated_text=ai_text,
                type=request.type,
                success=True
            )

        except ProcessingError:
            raise
        except Exception as e:
            logger.error("Unexpected error during reformulation: %s", e, exc_info=True)
            return ReformulationResponse(
                original_text=request.text,
                reformulated_text=request.text,
                type=request.type,
                success=False,
                error=f"Erreur technique : {str(e)[:100]}"
            )

    # ========================= PRODUCT NORMALIZATION (NOUVEAU) =========================

    def _get_system_prompt_product(self) -> str:
        """
        Prompt système : normalisation de nom de produit/service en français,
        100% IA (aucune heuristique codée côté backend).
        Sortie stricte JSON.
        """
        return (
            "Tu es un assistant francophone expert en désignation de produits et services. "
            "Ta mission est de produire un groupe nominal parfaitement formulé en français, "
            "avec l'article correct (un/une/des ou l’ en cas d’élision), suivi d'un hyperonyme naturel "
            "(catégorie) et du nom exact (marque + modèle si pertinent). "
            "Tu dois utiliser tes connaissances et, si nécessaire, inférer la variante la plus répandue "
            "sans ajouter de jargon marketing. La sortie doit être STRICTEMENT un JSON compact sur une seule ligne, "
            'de la forme: {"article":"<un|une|des|l’>","nom":"<hyperonyme + nom exact>"} — rien d’autre.'
        )

    def _build_user_prompt_product(self, declared_type: str, raw_name: str) -> str:
        """
        Construit le prompt utilisateur (FR) pour guider le modèle.
        Aucune liste/mapping local n’est fourni : tout est décidé par l’IA.
        """
        return f"""
TÂCHE
1) Identifie précisément l’objet ou le service correspondant au nom brut fourni.
2) Choisis un hyperonyme concis et naturel (ex.: smartphone, ordinateur portable, abonnement internet, imprimante, etc.)
   COHÉRENT avec le type déclaré:
   - si type = "service": privilégier une formulation liée à un contrat/prestation (ex.: "abonnement ...", "forfait ...", "offre ...")
   - si type = "bien": privilégier un objet matériel (ex.: "smartphone", "téléviseur", "imprimante", etc.)
3) Détermine l’article français correct: "un", "une", "des", ou "l’" si élision s’applique (ex.: l’iPhone).
4) Reformule le NOM COMPLET avec casse officielle (marque/modèle), sans superflu marketing.
5) RENDS UNIQUEMENT un JSON d’une seule ligne:
   {{"article":"<un|une|des|l’>", "nom":"<hyperonyme + nom exact>"}}

CONTRAINTES
- Français uniquement, sauf si le nom du produit renseigné est anglais (auquel cas, 
il faudra l'ancrer dans un groupe nominal français mais sans traduire le nom du 
produit). Par exemple, "generative API" donnera "Generative API" et non "API 
générative".
- Aucune phrase explicative, aucun commentaire, aucune note.
- Ne pas traduire les noms de modèles.
- Conserver les caractères spécieux qu'ils font partie du nom officiel; sinon, 
adopter la graphie la 
plus 
canonique.
- Si l’info reste ambigüe, choisir la variante la plus répandue/standard.

ENTRÉES
- type déclaré: "{declared_type}"
- nom brut: "{raw_name}"
""".strip()

    @staticmethod
    def _strip_code_fences(text: str) -> str:
        t = text.strip()
        if t.startswith("```"):
            t = re.sub(r"^```(?:json)?\s*|\s*```$", "", t, flags=re.IGNORECASE).strip()
        return t

    @staticmethod
    def _join_article_and_nom(article: str, nom: str) -> str:
        a = (article or "").strip()
        n = (nom or "").strip()
        # Uniformiser l'apostrophe d'élision
        a = a.replace("'", "’")
        if a.lower().startswith("l"):
            if not a.endswith("’"):
                a = "l’"
            return f"{a}{n.lstrip()}"
        return f"{a} {n}".strip()

    async def normalize_product_name(
        self,
        request: ProductNormalizationRequest
    ) -> ProductNormalizationResponse:
        if not self.api_key:
            logger.error("Scaleway AI not configured")
            return ProductNormalizationResponse(
                declared_type=request.declared_type,
                raw_name=request.raw_name,
                success=False,
                error="Service IA non configuré",
            )

        try:
            system_prompt = (
                "Tu es un assistant linguistique expert en français. "
                "Tu dois retourner UNIQUEMENT un groupe nominal (GN) correct et naturel, "
                "en français, qui commence par l’article approprié (un, une, des, l’/l').\n"
                "\n"
                "RÈGLES ABSOLUES (aucune exception) :\n"
                "1️⃣ NE JAMAIS modifier, remplacer, ni supprimer un mot du nom brut.\n"
                "   - Pas de synonymie, pas de simplification, pas de traduction, pas de reformulation.\n"
                "   - Si le texte d’entrée contient « la dernière heure », tu dois rendre « la dernière heure » exactement.\n"
                "2️⃣ Si le nom brut contient déjà un déterminant (un, une, le, la, les, l’/l'), conserve-le tel quel.\n"
                "3️⃣ Si le nom brut n’a pas de déterminant, ajoute seulement l’article correct (un/une/des/l’) et, si ÉVIDENT, "
                "   un hyperonyme minimal (smartphone, abonnement, etc.), sinon ne rien ajouter.\n"
                "4️⃣ Ne traduis pas, ne réordonne pas, ne majusculise pas inutilement, ne coupe pas de mots.\n"
                "5️⃣ Conserve les majuscules d’origine pour les marques, produits et modèles (Windows, Pro, API, Freebox, etc.).\n"
                "6️⃣ Ne pas ajouter de verbes, prépositions (‘à’, ‘pour’, …) ni de ponctuation finale.\n"
                "7️⃣ Si le nom brut est déjà correct, renvoie-le identique."
            )

            system_prompt = (
                "Tu es un assistant linguistique expert en français. "
                "Tu dois produire deux éléments pour un nom de produit/service :\n"
                "1) group_noun : un groupe nominal correct et naturel (avec article si pertinent),\n"
                "   sans verbe ni préposition, sans ponctuation finale, sans synonymie ni paraphrase ;\n"
                "   conserve les mots EXACTS fournis, l’ordre, et la casse des marques/modèles (Windows, Freebox, iPhone, API…). "
                "   Ne traduis JAMAIS les noms anglais. "
                "   Si le nom brut contient déjà un déterminant (un/une/le/la/les/l’), NE LE MODIFIE PAS.\n"
                "   Si le nom brut n’a pas de déterminant et que l’hyperonyme (ex. smartphone, abonnement) est ÉVIDENT, tu peux l’ajouter ; sinon, n’ajoute rien.\n"
                "2) acquisition_prefix : la préposition EXACTE à utiliser avant group_noun dans la phrase "
                "   « J’ai fait l’acquisition le … {acquisition_prefix}{group_noun} … ». "
                "   Elle doit être l’une de : \"\", \"de \", \"d’\", \"du \", \"des \". "
                "   Choisis :\n"
                "   - \"d’\" si group_noun commence par « un »/« une » (→ d’un / d’une),\n"
                "   - \"des \" si group_noun commence par « des »,\n"
                "   - \"de \" si group_noun commence par « l’/l' » ou par un nom propre sans article (ex. Windows Familial),\n"
                "   - \"du \" seulement si group_noun commence par « le »,\n"
                "   - \"\" si la tournure « acquisition de … » serait inappropriée (rare) — sinon évite \"\".\n"
                "NE JAMAIS ajouter « à », ni reformuler sémantiquement. ZÉRO synonymie.\n"
                "Sortie STRICTEMENT en JSON compact, une seule ligne, sans balises : "
                "{\"group_noun\":\"...\",\"acquisition_prefix\":\"...\"}"
            )

            fewshots = [
                # Aucun changement quand déterminant présent et sens exact
                {"role": "user", "content": "Type déclaré : service\nNom brut : la dernière heure"},
                {"role": "assistant", "content": "{\"group_noun\":\"la dernière heure\",\"acquisition_prefix\":\"\"}"},
                # Anglais non traduit
                {"role": "user", "content": "Type déclaré : service\nNom brut : Generative API"},
                {"role": "assistant", "content": "{\"group_noun\":\"une Generative API\",\"acquisition_prefix\":\"\"}"},
                # Hyperonyme évident pour un bien
                {"role": "user", "content": "Type déclaré : bien\nNom brut : samsung a22+"},
                {"role": "assistant", "content": "{\"group_noun\":\"un smartphone Samsung A22+\",\"acquisition_prefix\":\"d’\"}"},
                # Nom propre sans article → « de »
                {"role": "user", "content": "Type déclaré : bien\nNom brut : Windows Familial"},
                {"role": "assistant", "content": "{\"group_noun\":\"Windows Familial\",\"acquisition_prefix\":\"de \"}"},
            ]

            user_prompt = (
                f"Type déclaré : {request.declared_type}\n"
                f"Nom brut : {request.raw_name.strip()}\n\n"
                "Renvoie UNIQUEMENT : {\"group_noun\":\"...\",\"acquisition_prefix\":\"...\"}"
            )

            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    *fewshots,
                    {"role": "user", "content": user_prompt},
                ],
                "max_tokens": 120,
                "temperature": 0.1,
                "top_p": 0.7,
                "stream": False,
            }



            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "X-SCW-Region": self.region,
            }
            if self.project_id:
                headers["X-SCW-Project-ID"] = self.project_id

            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.api_url}/chat/completions", json=payload, headers=headers) as response:
                    if response.status != 200:
                        err_text = await response.text()
                        raise ProcessingError(f"Erreur API Scaleway ({response.status}): {err_text}")

                    result = await response.json()

            ai_raw = result["choices"][0]["message"]["content"].strip()

            # Nettoyage minimal : pas de point final, pas de majuscules forcées
            ai_text = ai_raw.rstrip(".!? ").strip()

            return ProductNormalizationResponse(
                declared_type=request.declared_type,
                raw_name=request.raw_name,
                product_name_formatted=ai_text,
                success=True,
            )

        except Exception as e:
            logger.error("Erreur IA normalize_product_name: %s", e, exc_info=True)
            return ProductNormalizationResponse(
                declared_type=request.declared_type,
                raw_name=request.raw_name,
                product_name_formatted=None,
                success=False,
                error=str(e),
            )
