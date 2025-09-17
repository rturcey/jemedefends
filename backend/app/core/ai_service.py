# backend/app/core/ai_service.py - Version reformulation-only

from __future__ import annotations

import logging
import re
from enum import Enum
from typing import Any

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

    def _get_system_prompt(self, reformulation_type: ReformulationType) -> str:
        """Prompt 2 étapes : 1) comprendre exactement, 2) reformuler pro.
        Étape 1 = raisonnement interne (à NE PAS afficher).
        Sortie = uniquement la phrase reformulée OU 'PROBLEME_INCOMPRIS'."""
        return """Tu es un expert en rédaction juridique française (litiges de consommation).

=== OBJECTIF ===
Produire UNE phrase claire et professionnelle décrivant exactement le problème de l’utilisateur, sans ajout ni déduction. 
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
- Rédiger UNE phrase en français clair et juridique accessible.
- Tout doit être intégralement en français, sauf termes spécifiques et nécessaires.
- Majuscule initiale, point final.
- Conserver strictement tous les faits et la polarité identifiés à l’étape 1.
- Vocabulaire autorisé (neutre) : “défaillance”, “dysfonctionnement”, “anomalie”, “de façon intempestive”, “de manière récurrente”, “l’appareil / l’équipement / le dispositif”.
- Recopier à l’identique les noms propres/OS (Windows, macOS/Mac, Ubuntu, etc.).
- Ne pas commencer par “présente un défaut”, ni mentionner “défaut de conformité”.
- Ne rien attribuer à un tiers (vendeur, fabricant) sauf si explicitement écrit par l’utilisateur.
- Si l’étape 1 conclut à une incompréhension → répondre exactement : PROBLEME_INCOMPRIS.

=== EXEMPLES ===
Utilisateur : "mon telephone seteint souvent sai relou"
Réponse : "L’appareil s’éteint de manière récurrente."

Utilisateur : "bluetooth marche plus depuis la maj"
Réponse : "La fonction Bluetooth a cessé de fonctionner depuis la mise à jour."

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
                # Tenter de conserver la partie utile de la phrase
                # Exemple : "Ce bien présente une défaillance d’allumage fréquente." -> "Une défaillance d’allumage fréquente."
                # Découpe prudente sur le premier point-virgule/point/que l'IA pourrait avoir mis.
                cleaned = re.sub(r"^(.*?)(?:\:|\-)\s*", "", cleaned).strip() or cleaned
                # Si rien n'a changé, tente une coupe par mots
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
                # Dans ce cas, on tente une version épurée : retirer la locution fautive
                ai_text = re.sub(r"(?i)\b(présente un défaut|défaut de conformité)\b[:,]?\s*", "", ai_text).strip()
                # Re-normalisation ponctuation/majuscule
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
