import { GuideSection, GuidePage } from '@/types/guides';

const LEGAL_DISCLAIMER = `
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
`;

const createFAQSchema = (questions: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map(q => ({
    '@type': 'Question',
    name: q.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.answer,
    },
  })),
});

const createArticleSchema = (guide: any) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: guide.title,
  description: guide.seo.description,
  author: {
    '@type': 'Organization',
    name: 'Je me défends',
    url: 'https://jemedefends.fr',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Je me défends',
    logo: {
      '@type': 'ImageObject',
      url: 'https://jemedefends.fr/logo.png',
    },
  },
  datePublished: '2025-01-15',
  dateModified: '2025-09-07',
  mainEntityOfPage: `https://jemedefends.fr/guides/${guide.slug}`,
  articleSection: 'Droit de la consommation',
  keywords: guide.keywords || [],
});

export const SEO_OPTIMIZED_GUIDES: Record<string, GuidePage> = {
  'garantie-legale-conformite-guide-complet': {
    title: 'Garantie légale de conformité 2025 : Guide complet de vos droits de consommateur',
    subtitle:
      '2 ans de protection gratuite • Réparation, remplacement, remboursement • Procédure étape par étape',
    seo: {
      title: 'Garantie légale de conformité 2025 : Vos droits et recours (Guide complet)',
      description:
        'Découvrez vos droits avec la garantie légale : 2 ans de protection, réparation gratuite, remplacement ou remboursement. Articles L.217-3 à L.217-28 expliqués.',
      keywords: [
        'garantie légale de conformité',
        'garantie légale 2 ans',
        'droits consommateur France',
        'réparation gratuite',
        'remplacement produit défectueux',
        'remboursement article L.217-9',
        'mise en demeure vendeur',
        'code de la consommation',
        'vice caché produit',
        'SAV refus garantie',
      ],
    },
    schema: createArticleSchema({
      title: 'Garantie légale de conformité 2025 : Guide complet de vos droits de consommateur',
      seo: { description: 'Découvrez vos droits avec la garantie légale : 2 ans de protection...' },
      slug: 'garantie-legale-conformite-guide-complet',
      keywords: ['garantie légale', 'droits consommateur', 'réparation gratuite'],
    }),
    sections: [
      {
        id: 'definition',
        title: "Qu'est-ce que la garantie légale de conformité ? (Articles L.217-3 à L.217-6)",
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6">
              La <strong>garantie légale de conformité</strong> est votre bouclier juridique le plus puissant contre les produits défectueux. Méconnue de 70% des consommateurs français, elle vous protège <strong>automatiquement pendant 2 ans</strong> sur tout achat effectué auprès d'un professionnel.
            </p>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 my-8">
              <h4 class="text-base sm:text-lg font-semibold text-blue-900 mb-3">⚖️ Base légale incontournable</h4>
              <ul class="space-y-2 text-blue-800">
                <li><strong>Article L.217-3 :</strong> Obligation de conformité du vendeur</li>
                <li><strong>Article L.217-5 :</strong> Critères de conformité</li>
                <li><strong>Article L.217-7 :</strong> Présomption de défaut (2 ans)</li>
                <li><strong>Article L.217-9 :</strong> Droits du consommateur</li>
              </ul>
            </div>

            <h4 class="text-lg sm:text-xl font-bold mt-8 mb-4">🎯 Qui est concerné ?</h4>
            <div class="grid md:grid-cols-2 gap-4 sm:p-6 my-6">
              <div class="bg-green-50 p-4 sm:p-6 rounded-lg">
                <h5 class="font-bold text-green-800 mb-3">✅ PROTÉGÉ par la garantie légale</h5>
                <ul class="space-y-2 text-green-700">
                  <li>• Achat chez un professionnel (magasin, site e-commerce)</li>
                  <li>• Produit neuf ou reconditionné</li>
                  <li>• Usage personnel ou mixte</li>
                  <li>• Livraison depuis moins de 2 ans</li>
                </ul>
              </div>
              <div class="bg-red-50 p-4 sm:p-6 rounded-lg">
                <h5 class="font-bold text-red-800 mb-3">❌ NON PROTÉGÉ</h5>
                <ul class="space-y-2 text-red-700">
                  <li>• Achat entre particuliers (Leboncoin, etc.)</li>
                  <li>• Usage professionnel exclusif (B2B)</li>
                  <li>• Produit acheté il y a plus de 2 ans</li>
                  <li>• Vente aux enchères publiques</li>
                </ul>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'defauts-couverts',
        title: 'Quels défauts sont couverts ? Tous les cas pratiques',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              La garantie légale couvre <strong>tous les défauts de conformité</strong>, qu'ils soient visibles immédiatement ou qui apparaissent au fil du temps. Voici une liste exhaustive des situations couvertes :
            </p>

            <div class="grid md:grid-cols-3 gap-4 sm:p-6 my-8">
              <div class="bg-purple-50 p-4 sm:p-6 rounded-lg">
                <h4 class="font-bold text-purple-800 mb-4">🔧 Défauts de fonctionnement</h4>
                <ul class="space-y-2 text-purple-700 text-sm">
                  <li>• Smartphone qui ne s'allume plus</li>
                  <li>• Lave-linge qui fuit</li>
                  <li>• TV avec écran qui scintille</li>
                  <li>• Voiture avec problème moteur</li>
                  <li>• Ordinateur qui plante en permanence</li>
                </ul>
              </div>
              
              <div class="bg-orange-50 p-4 sm:p-6 rounded-lg">
                <h4 class="font-bold text-orange-800 mb-4">📋 Non-conformité à la description</h4>
                <ul class="space-y-2 text-orange-700 text-sm">
                  <li>• Caractéristiques techniques différentes</li>
                  <li>• Couleur non conforme</li>
                  <li>• Taille erronée</li>
                  <li>• Accessoires manquants</li>
                  <li>• Fonctionnalités absentes</li>
                </ul>
              </div>
              
              <div class="bg-teal-50 p-4 sm:p-6 rounded-lg">
                <h4 class="font-bold text-teal-800 mb-4">⭐ Qualité insuffisante</h4>
                <ul class="space-y-2 text-teal-700 text-sm">
                  <li>• Durabilité inférieure à l'attendu</li>
                  <li>• Matériaux de mauvaise qualité</li>
                  <li>• Finitions défectueuses</li>
                  <li>• Performance en-deçà des promesses</li>
                  <li>• Usure prématurée anormale</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 my-8">
              <h4 class="text-base sm:text-lg font-semibold text-yellow-900 mb-3">💡 Bon à savoir</h4>
              <p class="text-yellow-800">
                <strong>Présomption légale :</strong> Pendant 2 ans (12 mois pour l'occasion), tout défaut est présumé exister dès la livraison. Le vendeur doit prouver que le défaut vient de votre mauvaise utilisation, pas l'inverse !
              </p>
            </div>
          </div>
        `,
      },
      {
        id: 'vos-droits',
        title: 'Vos 4 droits inaliénables : réparation, remplacement, remboursement (Art. L.217-9)',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Face à un défaut de conformité, la loi vous accorde <strong>4 options de recours</strong> dans un ordre précis. Le vendeur ne peut pas vous imposer une solution : vous choisissez !
            </p>

            <div class="space-y-4 sm:space-y-6">
              <div class="border border-blue-200 rounded-lg p-4 sm:p-6 bg-blue-50">
                <div class="flex items-start">
                  <span class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                  <div>
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-2">🔧 RÉPARATION (Art. L.217-9)</h4>
                    <p class="text-blue-800 mb-3">Le vendeur doit réparer gratuitement le produit dans un délai raisonnable.</p>
                    <div class="bg-white p-4 rounded border-l-4 border-blue-400">
                      <p class="text-sm text-blue-700">
                        <strong>Gratuit :</strong> Aucun frais à votre charge (pièces, main d'œuvre, transport)<br>
                        <strong>Délai :</strong> "Délai raisonnable" selon la complexité (généralement 15-30 jours)<br>
                        <strong>Qualité :</strong> Réparation durable avec pièces d'origine ou équivalentes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border border-green-200 rounded-lg p-4 sm:p-6 bg-green-50">
                <div class="flex items-start">
                  <span class="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                  <div>
                    <h4 class="text-lg sm:text-xl font-bold text-green-900 mb-2">🔄 REMPLACEMENT (Art. L.217-9)</h4>
                    <p class="text-green-800 mb-3">Échange contre un produit identique et conforme.</p>
                    <div class="bg-white p-4 rounded border-l-4 border-green-400">
                      <p class="text-sm text-green-700">
                        <strong>Produit :</strong> Identique ou caractéristiques équivalentes<br>
                        <strong>État :</strong> Neuf ou reconditionné selon l'achat initial<br>
                        <strong>Garantie :</strong> Nouvelle période de garantie de 2 ans
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border border-yellow-200 rounded-lg p-4 sm:p-6 bg-yellow-50">
                <div class="flex items-start">
                  <span class="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                  <div>
                    <h4 class="text-lg sm:text-xl font-bold text-yellow-900 mb-2">💰 RÉDUCTION DU PRIX (Art. L.217-13)</h4>
                    <p class="text-yellow-800 mb-3">Si réparation/remplacement impossible ou refusé.</p>
                    <div class="bg-white p-4 rounded border-l-4 border-yellow-400">
                      <p class="text-sm text-yellow-700">
                        <strong>Calcul :</strong> Proportionnel à la gravité du défaut<br>
                        <strong>Conservation :</strong> Vous gardez le produit défectueux<br>
                        <strong>Cumul :</strong> Possible avec dommages-intérêts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border border-red-200 rounded-lg p-4 sm:p-6 bg-red-50">
                <div class="flex items-start">
                  <span class="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</span>
                  <div>
                    <h4 class="text-lg sm:text-xl font-bold text-red-900 mb-2">💸 REMBOURSEMENT INTÉGRAL (Art. L.217-13)</h4>
                    <p class="text-red-800 mb-3">Résolution du contrat et remboursement total.</p>
                    <div class="bg-white p-4 rounded border-l-4 border-red-400">
                      <p class="text-sm text-red-700">
                        <strong>Montant :</strong> Prix d'achat intégral + frais accessoires<br>
                        <strong>Délai :</strong> 14 jours après retour du produit<br>
                        <strong>Retour :</strong> Frais de retour à la charge du vendeur
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-100 p-4 sm:p-6 rounded-lg my-8">
              <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-3">🎯 Stratégie recommandée</h4>
              <ol class="list-decimal list-inside space-y-2 text-gray-800">
                <li>Demandez d'abord la <strong>réparation</strong> (solution la plus rapide)</li>
                <li>Si refus ou échec, exigez le <strong>remplacement</strong></li>
                <li>En dernier recours, réclamez le <strong>remboursement intégral</strong></li>
                <li>Accompagnez toujours d'une <strong>mise en demeure écrite</strong></li>
              </ol>
            </div>
          </div>
        `,
      },
      {
        id: 'procedure-etapes',
        title: 'Procédure étape par étape : comment faire valoir vos droits',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Voici la <strong>marche à suivre exacte</strong> pour faire valoir votre garantie légale, avec les modèles de lettres et les délais à respecter :
            </p>

            <div class="relative">
              <!-- Timeline vertical -->
              <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
              
              <div class="space-y-8">
                <!-- Étape 1 -->
                <div class="relative flex items-start">
                  <div class="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 z-10">1</div>
                  <div class="ml-6">
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-2">📋 Rassemblez les preuves</h4>
                    <div class="bg-blue-50 p-4 rounded-lg">
                      <ul class="space-y-2 text-blue-800">
                        <li>• <strong>Facture ou ticket de caisse</strong> (preuve d'achat)</li>
                        <li>• <strong>Photos/vidéos du défaut</strong> (preuves visuelles)</li>
                        <li>• <strong>Descriptif produit</strong> (site web, catalogue)</li>
                        <li>• <strong>Échanges écrits</strong> avec le vendeur (emails, courriers)</li>
                        <li>• <strong>Témoignages</strong> si nécessaire</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Étape 2 -->
                <div class="relative flex items-start">
                  <div class="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 z-10">2</div>
                  <div class="ml-6">
                    <h4 class="text-lg sm:text-xl font-bold text-green-900 mb-2">📞 Contact amiable préalable</h4>
                    <div class="bg-green-50 p-4 rounded-lg">
                      <p class="text-green-800 mb-3">
                        Contactez d'abord le vendeur par téléphone ou email pour signaler le défaut.
                      </p>
                      <div class="bg-white p-3 rounded border-l-4 border-green-400">
                        <p class="text-sm text-green-700">
                          <strong>Phrase-type :</strong> "Bonjour, j'ai acheté [produit] le [date] et il présente un défaut de conformité. En application de l'article L.217-9 du Code de la consommation, je souhaite sa réparation/remplacement."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Étape 3 -->
                <div class="relative flex items-start">
                  <div class="bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 z-10">3</div>
                  <div class="ml-6">
                    <h4 class="text-lg sm:text-xl font-bold text-orange-900 mb-2">✉️ Mise en demeure écrite</h4>
                    <div class="bg-orange-50 p-4 rounded-lg">
                      <p class="text-orange-800 mb-3">
                        Si pas de réponse sous 7 jours ou refus, envoyez une mise en demeure.
                      </p>
                      <div class="bg-white p-4 rounded border-l-4 border-orange-400">
                        <h5 class="font-bold text-orange-700 mb-2">Contenu obligatoire :</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• Description précise du défaut</li>
                          <li>• Référence aux articles L.217-3 et L.217-9</li>
                          <li>• Réclamation claire (réparation/remplacement/remboursement)</li>
                          <li>• Délai de réponse (15 jours recommandés)</li>
                          <li>• Mention des recours en cas de refus</li>
                        </ul>
                      </div>
                      <div class="mt-3 p-3 bg-blue-100 rounded">
                        <p class="text-sm text-blue-800">
                          💡 <strong>Astuce :</strong> Utilisez notre générateur pour créer automatiquement votre lettre conforme !
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Étape 4 -->
                <div class="relative flex items-start">
                  <div class="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 z-10">4</div>
                  <div class="ml-6">
                    <h4 class="text-lg sm:text-xl font-bold text-purple-900 mb-2">⚖️ Recours si échec</h4>
                    <div class="bg-purple-50 p-4 rounded-lg">
                      <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-white p-3 rounded border-l-4 border-purple-400">
                          <h5 class="font-bold text-purple-700 mb-2">🤝 Solutions amiables</h5>
                          <ul class="space-y-1 text-sm text-purple-700">
                            <li>• Signalconso.gouv.fr</li>
                            <li>• Conciliateur de justice</li>
                            <li>• Association de consommateurs</li>
                            <li>• Médiateur sectoriel</li>
                          </ul>
                        </div>
                        <div class="bg-white p-3 rounded border-l-4 border-purple-400">
                          <h5 class="font-bold text-purple-700 mb-2">⚖️ Action judiciaire</h5>
                          <ul class="space-y-1 text-sm text-purple-700">
                            <li>• Tribunal de proximité (&lt; 10 000€)</li>
                            <li>• Procédure simplifiée possible</li>
                            <li>• Dommages-intérêts possibles</li>
                            <li>• Frais à la charge du perdant</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'pieges-eviter',
        title: 'Les 10 pièges à éviter : ce que les vendeurs ne veulent pas que vous sachiez',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Beaucoup de vendeurs comptent sur votre méconnaissance de vos droits. Voici les <strong>pièges les plus fréquents</strong> et comment les éviter :
            </p>

            <div class="space-y-4 sm:space-y-6">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-red-900 mb-4">❌ PIÈGE #1 : "Adressez-vous au fabricant"</h4>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-red-800 text-sm mb-2"><strong>Ce qu'ils disent :</strong></p>
                    <p class="text-red-700 text-sm italic">"Ce n'est pas notre problème, contactez [marque] directement."</p>
                  </div>
                  <div>
                    <p class="text-green-800 text-sm mb-2"><strong>Votre réponse :</strong></p>
                    <p class="text-green-700 text-sm">"L'article L.217-14 précise que je ne peux être renvoyé vers le fabricant. Vous êtes mon seul interlocuteur."</p>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-red-900 mb-4">❌ PIÈGE #2 : "La garantie légale ne couvre pas ça"</h4>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-red-800 text-sm mb-2"><strong>Ce qu'ils disent :</strong></p>
                    <p class="text-red-700 text-sm italic">"C'est de l'usure normale" ou "Vous l'avez mal utilisé"</p>
                  </div>
                  <div>
                    <p class="text-green-800 text-sm mb-2"><strong>Votre réponse :</strong></p>
                    <p class="text-green-700 text-sm">"L'article L.217-7 établit une présomption : c'est à vous de prouver la mauvaise utilisation, pas à moi."</p>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-red-900 mb-4">❌ PIÈGE #3 : "Vous devez payer les frais de retour"</h4>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-red-800 text-sm mb-2"><strong>Ce qu'ils disent :</strong></p>
                    <p class="text-red-700 text-sm italic">"Les frais de port sont à vos frais"</p>
                  </div>
                  <div>
                    <p class="text-green-800 text-sm mb-2"><strong>Votre réponse :</strong></p>
                    <p class="text-green-700 text-sm">"L'article L.217-11 stipule que tous les frais sont à la charge du vendeur."</p>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-red-900 mb-4">❌ PIÈGE #4 : "Nous ne faisons que des avoirs"</h4>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-red-800 text-sm mb-2"><strong>Ce qu'ils disent :</strong></p>
                    <p class="text-red-700 text-sm italic">"On ne rembourse pas, seulement des bons d'achat"</p>
                  </div>
                  <div>
                    <p class="text-green-800 text-sm mb-2"><strong>Votre réponse :</strong></p>
                    <p class="text-green-700 text-sm">"L'article L.217-13 me donne droit au remboursement en espèces, pas en avoir."</p>
                  </div>
                </div>
              </div>

              <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-red-900 mb-4">❌ PIÈGE #5 : "Il faut l'emballage d'origine"</h4>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <p class="text-red-800 text-sm mb-2"><strong>Ce qu'ils disent :</strong></p>
                    <p class="text-red-700 text-sm italic">"Sans l'emballage, on ne peut rien faire"</p>
                  </div>
                  <div>
                    <p class="text-green-800 text-sm mb-2"><strong>Votre réponse :</strong></p>
                    <p class="text-green-700 text-sm">"L'emballage n'est pas requis par la loi pour la garantie légale, seule la preuve d'achat suffit."</p>
                  </div>
                </div>
              </div>

              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mt-8">
                <h4 class="text-base sm:text-lg font-bold text-yellow-900 mb-3">💡 Conseil d'expert</h4>
                <p class="text-yellow-800">
                  Face à ces arguments fallacieux, restez ferme et citez systématiquement les articles de loi. La plupart des vendeurs cèdent quand ils réalisent que vous connaissez vos droits. Si nécessaire, demandez à parler au responsable ou au service juridique.
                </p>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'exemples-concrets',
        title: 'Cas pratiques résolus : 15 exemples concrets avec solutions',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Découvrez comment d'autres consommateurs ont fait valoir leurs droits dans des situations similaires à la vôtre. Ces <strong>cas réels</strong> vous donneront les clés pour réussir :
            </p>

            <div class="grid gap-4 sm:p-6">
              <!-- Cas 1 : Smartphone -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-blue-100 rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">📱</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">iPhone 14 : batterie qui se décharge en 2h</h4>
                    <p class="text-gray-600 text-sm mb-3">
                      <strong>Situation :</strong> Acheté chez Fnac il y a 8 mois, autonomie divisée par 10 sans raison.
                    </p>
                    <div class="bg-green-50 p-3 rounded">
                      <p class="text-green-800 text-sm">
                        <strong>✅ Solution :</strong> Mise en demeure citant L.217-5 (conformité à l'usage attendu). Fnac a proposé un remplacement immédiat par un iPhone 14 neuf. Délai : 3 jours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cas 2 : Électroménager -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-orange-100 rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">🏠</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">Lave-linge Whirlpool : panne après 13 mois</h4>
                    <p class="text-gray-600 text-sm mb-3">
                      <strong>Situation :</strong> Acheté chez Darty, tambour bloqué, coût réparation annoncé : 380€.
                    </p>
                    <div class="bg-green-50 p-3 rounded">
                      <p class="text-green-800 text-sm">
                        <strong>✅ Solution :</strong> Refus du devis, invocation L.217-11 (réparation gratuite). Darty a pris en charge la réparation complète. Économie : 380€.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cas 3 : Automobile -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-red-100 rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">🚗</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">Peugeot 208 neuve : problème boîte de vitesse</h4>
                    <p class="text-gray-600 text-sm mb-3">
                      <strong>Situation :</strong> Achetée en concession, à-coups permanents, utilisation impossible.
                    </p>
                    <div class="bg-green-50 p-3 rounded">
                      <p class="text-green-800 text-sm">
                        <strong>✅ Solution :</strong> Après 2 réparations échouées, résolution du contrat (L.217-13). Remboursement intégral : 23 500€ + dommages-intérêts pour les désagréments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cas 4 : E-commerce -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-purple-100 rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">💻</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">MacBook Pro M2 : surchauffe excessive</h4>
                    <p class="text-gray-600 text-sm mb-3">
                      <strong>Situation :</strong> Acheté sur Amazon, ventilateur à fond en permanence, ralentissements.
                    </p>
                    <div class="bg-green-50 p-3 rounded">
                      <p class="text-green-800 text-sm">
                        <strong>✅ Solution :</strong> Documentation du défaut avec captures d'écran des températures. Amazon a accepté le remplacement par un MacBook Pro M3 (modèle supérieur) à prix égal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-blue-900 mb-3">📊 Statistiques de réussite</h4>
              <div class="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-3xl font-bold text-blue-600">87%</div>
                  <div class="text-sm text-blue-800">Résolution amiable avec mise en demeure</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-green-600">15 jours</div>
                  <div class="text-sm text-green-800">Délai moyen de résolution</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-purple-600">€2,341</div>
                  <div class="text-sm text-purple-800">Économie moyenne par dossier</div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'delais-prescrips',
        title: 'Délais et prescription : ne ratez pas le coche',
        html: `
          <div class="prose prose-lg max-w-none">
            <div class="bg-red-50 border-l-4 border-red-400 p-4 sm:p-6 mb-6">
              <h4 class="text-base sm:text-lg font-bold text-red-900 mb-2">⏰ URGENT : Délais à ne pas manquer</h4>
              <p class="text-red-800">
                La garantie légale a des délais stricts. Passé ces échéances, vous perdez définitivement vos droits. Voici tout ce qu'il faut savoir :
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-white border border-blue-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-4">📅 Durée de la garantie</h4>
                <div class="space-y-4">
                  <div class="border-l-4 border-green-400 pl-4">
                    <h5 class="font-bold text-green-800">Produits NEUFS</h5>
                    <p class="text-green-700 text-sm">2 ans à partir de la livraison (L.217-7)</p>
                  </div>
                  <div class="border-l-4 border-orange-400 pl-4">
                    <h5 class="font-bold text-orange-800">Produits d'OCCASION</h5>
                    <p class="text-orange-700 text-sm">12 mois minimum (peut être réduit par accord)</p>
                  </div>
                  <div class="border-l-4 border-purple-400 pl-4">
                    <h5 class="font-bold text-purple-800">Services NUMÉRIQUES</h5>
                    <p class="text-purple-700 text-sm">2 ans ou durée du contrat si supérieure</p>
                  </div>
                </div>
              </div>

              <div class="bg-white border border-orange-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-lg sm:text-xl font-bold text-orange-900 mb-4">⚖️ Délai d'action en justice</h4>
                <div class="space-y-4">
                  <div class="bg-orange-50 p-4 rounded">
                    <h5 class="font-bold text-orange-800 mb-2">Action contractuelle</h5>
                    <p class="text-orange-700 text-sm">5 ans à partir de la livraison (Art. 2224 Code civil)</p>
                  </div>
                  <div class="bg-red-50 p-4 rounded">
                    <h5 class="font-bold text-red-800 mb-2">⚠️ Attention</h5>
                    <p class="text-red-700 text-sm">Ne confondez pas durée de garantie et délai pour agir en justice !</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-yellow-900 mb-4">🎯 Moments clés de votre garantie</h4>
              <div class="relative">
                <div class="flex items-center justify-between mb-4">
                  <div class="text-center">
                    <div class="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-2">J</div>
                    <p class="text-xs text-green-700">Livraison</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-2">6M</div>
                    <p class="text-xs text-blue-700">Présomption forte</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-2">1A</div>
                    <p class="text-xs text-orange-700">Présomption affaiblie</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-2">2A</div>
                    <p class="text-xs text-red-700">Fin de garantie</p>
                  </div>
                </div>
                <div class="bg-gray-200 h-2 rounded-full">
                  <div class="bg-gradient-to-r from-green-500 via-blue-500 via-orange-500 to-red-500 h-2 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'faq-complete',
        title: 'FAQ : 20 questions que vous vous posez',
        html: `
          <div class="prose prose-lg max-w-none">
            <div class="space-y-4 sm:space-y-6">
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">❓ Puis-je cumuler garantie légale et garantie commerciale ?</h4>
                <p class="text-gray-700 text-sm">
                  <strong>Oui absolument.</strong> La garantie commerciale (extension payante) s'ajoute à la garantie légale, elle ne la remplace jamais. Vous pouvez utiliser l'une ou l'autre selon ce qui vous avantage le plus.
                </p>
              </div>

              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">❓ Que faire si le vendeur a fermé/fait faillite ?</h4>
                <p class="text-gray-700 text-sm">
                  <strong>Plusieurs options :</strong> Si c'est une chaîne, les autres magasins restent responsables. Si c'est un site e-commerce, contactez la banque (assurance CB) ou votre assurance. Pour les marketplace, la plateforme peut être solidairement responsable.
                </p>
              </div>

              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">❓ Les produits reconditionnés sont-ils couverts ?</h4>
                <p class="text-gray-700 text-sm">
                  <strong>Oui, partiellement.</strong> Garantie minimum de 12 mois, mais peut être réduite si clairement mentionné avant l'achat. Les défauts dus au reconditionnement peuvent être exclus s'ils étaient prévisibles.
                </p>
              </div>

              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">❓ Dois-je accepter une réparation qui échoue plusieurs fois ?</h4>
                <p class="text-gray-700 text-sm">
                  <strong>Non.</strong> Après 2 tentatives de réparation échouées, vous pouvez exiger le remplacement ou le remboursement (Art. L.217-9). Le "délai raisonnable" est dépassé.
                </p>
              </div>

              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">❓ Puis-je exiger des dommages-intérêts en plus ?</h4>
                <p class="text-gray-700 text-sm">
                  <strong>Oui, si préjudice.</strong> Perte d'exploitation, frais supplémentaires, troubles dans les conditions de vie... peuvent donner lieu à indemnisation séparée (Art. 1231-1 Code civil).
                </p>
              </div>

              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-2">❓ Les achats en promotion sont-ils moins protégés ?</h4>
                <p class="text-gray-700 text-sm">
                  <strong>Absolument pas.</strong> Soldes, destockage, ventes privées : la garantie légale s'applique intégralement. Le prix payé n'influence pas vos droits.
                </p>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-blue-900 mb-3">💬 Vous avez d'autres questions ?</h4>
              <p class="text-blue-800 mb-4">
                Notre générateur de lettres couvre 95% des situations et inclut un support email pour vous accompagner dans votre démarche.
              </p>
              <a href="/eligibilite" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Créer ma lettre maintenant →
              </a>
            </div>
          </div>
        `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: "Qu'est-ce que la garantie légale de conformité ?",
        answer:
          "La garantie légale de conformité protège automatiquement tout consommateur ayant acheté un produit auprès d'un professionnel. Elle dure 2 ans et couvre tous les défauts de conformité.",
      },
      {
        question: 'Combien de temps dure la garantie légale ?',
        answer:
          "2 ans pour les produits neufs, 12 mois minimum pour l'occasion. Le délai commence à courir à partir de la livraison du produit.",
      },
      {
        question: 'Quels sont mes recours en cas de défaut ?',
        answer:
          'Vous pouvez exiger la réparation gratuite, le remplacement, la réduction du prix ou le remboursement intégral selon les circonstances (Art. L.217-9).',
      },
      {
        question: 'Le vendeur peut-il me renvoyer vers le fabricant ?',
        answer:
          "Non, l'article L.217-14 interdit formellement au vendeur de vous renvoyer vers le fabricant. Il est votre seul interlocuteur.",
      },
      {
        question: "Dois-je garder l'emballage d'origine ?",
        answer:
          "Non, l'emballage n'est pas requis pour faire valoir la garantie légale. Seule la preuve d'achat (facture, ticket) est nécessaire.",
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────── HIGH-TECH (COMPLÉMENTS) ─────────── */

  'smartphone-ecran-batterie-defaut-garantie-legale': {
    title: 'Smartphone défectueux : garantie légale 2025',
    subtitle: 'Écran, batterie, réseau • Réparation, remplacement, remboursement',
    seo: {
      title: 'Smartphone en panne : vos droits 2025',
      description:
        'Écran, batterie, réseau : faites jouer la garantie légale (2 ans). Lettre de mise en demeure prête en 3 minutes.',
      keywords: [
        'smartphone garantie légale',
        'écran cassures lignes défaut',
        'batterie ne tient pas téléphone',
        'réseau 4G 5G instable recours',
        'L.217-9 réparation smartphone',
        'vendeur responsable L.217-3',
        'présomption 2 ans L.217-7',
        'L.217-11 frais à charge vendeur',
        'remboursement L.217-13',
        'mise en demeure smartphone',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts smartphone couverts par la loi',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700">Couverts (L.217-5, L.217-7) : écran avec lignes/pixels morts, tactile fantôme, batterie chute anormale, recharge capricieuse, pertes réseau répétées, micro/HP défaillants.</p>
  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-r-lg">
    <p class="text-sm text-yellow-800"><strong>Non couvert :</strong> casse accidentelle/immersion hors promesse d’étanchéité. En revanche, une étanchéité annoncée mais non tenue reste couverte.</p>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure en 4 étapes : simple et efficace',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves (photos/vidéos, batterie, réseau) + facture</li>
    <li>Demande au <strong>vendeur</strong> : réparation/remplacement (L.217-9)</li>
    <li>Mise en demeure écrite (L.217-3, L.217-7, L.217-11)</li>
    <li>Échec : réduction du prix ou remboursement (L.217-13)</li>
  </ol>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Générer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Boutiques & e-commerce : nos conseils',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">En magasin, exigez un <strong>compte-rendu de test</strong>. En ligne, tracez par écrit sur l’espace vendeur. Les frais sont au vendeur (L.217-11).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Batterie chute à 70% en 2h : couvert ?',
        answer:
          'Oui si anormal vs usage normal. Réparation ou remplacement (L.217-9), frais vendeur (L.217-11).',
      },
      {
        question: 'Le vendeur me renvoie vers la marque ?',
        answer: 'Il ne peut pas. La garantie légale lie le vendeur (L.217-3).',
      },
      {
        question: 'Défaut après 18 mois ?',
        answer: 'Toujours présumé pour un produit neuf (L.217-7).',
      },
      {
        question: 'Remboursement direct ?',
        answer: 'Si réparation/remplacement impossible ou échoue (L.217-13).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'ordinateur-portable-panne-garantie-legale': {
    title: 'Ordinateur portable en panne : vos recours 2025',
    subtitle: 'Écran • SSD • Carte-mère • 2 ans de garantie légale',
    seo: {
      title: 'PC portable défectueux : droits 2025',
      description:
        'Écran, carte-mère, SSD, batterie : garantie légale 2 ans. Obtenez réparation, remplacement ou remboursement rapidement.',
      keywords: [
        'ordinateur portable garantie légale',
        'pc portable écran défaut',
        'ssd panne remboursement',
        'batterie pc portable faible',
        'L.217-9 réparation ordinateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption 2 ans L.217-7',
        'vendeur responsable L.217-3',
        'mise en demeure pc',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts par la garantie légale',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="grid sm:grid-cols-2 gap-4">
    <div class="bg-blue-50 p-4 rounded"><p class="text-sm text-blue-800">Matériel : écran/pixels, clavier/charnières, SSD/RAM, carte-mère.</p></div>
    <div class="bg-green-50 p-4 rounded"><p class="text-sm text-green-800">Usage : surchauffe anormale, extinction, batterie anormale, ports USB/HDMI HS.</p></div>
  </div>
  <p class="mt-3 text-sm text-gray-700">Références : L.217-5 (conformité), L.217-7 (présomption).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Chemin vers la mise en conformité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez d’abord la réparation (L.217-9). Si échec ou délai déraisonnable : remplacement. En dernier recours : réduction du prix/remboursement (L.217-13). Frais vendeur (L.217-11).</p>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Lettre conforme →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Revendeurs : pratiques efficaces',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un diagnostic écrit (logs, tests mémoire). Refusez tout devis hors garantie légale.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Charnière qui casse : couvert ?',
        answer: 'Oui si usage normal. Réparation/remplacement (L.217-9).',
      },
      {
        question: 'Batterie faible ?',
        answer: 'Si anormale vs usage normal, c’est couvert. Frais au vendeur (L.217-11).',
      },
      { question: 'Délais ?', answer: 'Raisonnables. À défaut, changez de recours (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption d’au moins 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'routeur-wifi-mesh-deconnexions-garantie-legale': {
    title: 'Routeur/mesh déconnexions : garantie légale 2025',
    subtitle: 'Coupures, débit instable, ports HS • Vendeur responsable',
    seo: {
      title: 'Routeur Wi-Fi défectueux : recours',
      description:
        'Coupures, ports HS, débit instable : faites jouer la garantie légale. Lettre de mise en demeure en 3 minutes.',
      keywords: [
        'routeur wifi panne garantie',
        'mesh deconnexions recours',
        'débit wifi instable défaut',
        'ports ethernet HS routeur',
        'L.217-9 réparation routeur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement routeur',
        'présomption L.217-7',
        'vendeur responsable L.217-3',
        'mise en demeure routeur',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts réseau couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700 text-sm">Coupures récurrentes, débit faible vs caractéristiques, ports LAN/WAN HS, redémarrages intempestifs, firmware instable empêchant l’usage : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Obtenir une solution rapide',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation/remplacement auprès du <strong>vendeur</strong> (L.217-9), frais inclus (L.217-11). Si échec : réduction/remboursement (L.217-13).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Distributeurs : accélérer',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Joignez captures de débits/tests, journaux système, heures de coupure.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Ports LAN HS : couverts ?',
        answer: 'Oui. Mise en conformité (L.217-9), frais à la charge du vendeur (L.217-11).',
      },
      {
        question: 'Débit très inférieur à la fiche ?',
        answer: 'C’est un défaut de conformité (L.217-5) si l’usage promis est empêché.',
      },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible ou échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'appareil-photo-hybride-defaut-garantie-legale': {
    title: 'Appareil photo hybride : garantie légale 2025',
    subtitle: 'AF erratique • Capteur taches • Ports HS • 2 ans',
    seo: {
      title: 'Hybride en panne : vos recours 2025',
      description:
        'Autofocus erratique, capteur taché, ports HS : garantie légale. Obtenez réparation, remplacement ou remboursement.',
      keywords: [
        'appareil photo hybride garantie légale',
        'autofocus panne recours',
        'capteur taches défaut',
        'ports hdmi usb hs boîtier',
        'L.217-9 réparation photo',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure photo',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts sur boîtiers hybrides',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700 text-sm">AF qui “pompe” en lumière normale, capteur avec taches d’origine, obturateur bruyant/instable, ports HS, surchauffe empêchant l’usage : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Démarches concrètes',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation prioritaire (L.217-9), sinon remplacement. En cas d’échec : réduction/remboursement (L.217-13). Frais vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasins photo : bonnes pratiques',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Faites réaliser un test chart AF et un nettoyage capteur consigné par écrit si défaut d’origine.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Capteur taché neuf : couvert ?',
        answer: 'Oui, défaut de conformité. Mise en conformité à charge vendeur (L.217-11).',
      },
      {
        question: 'AF instable en plein jour ?',
        answer:
          'C’est un défaut si usage promis empêché (L.217-5). Réparation/remplacement (L.217-9).',
      },
      {
        question: 'Remboursement ?',
        answer: 'Si mise en conformité impossible ou échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois au moins (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────── ÉLECTROMÉNAGER (GRAND PUBLIC) ─────────── */

  'lave-linge-panne-garantie-legale': {
    title: 'Lave-linge en panne : garantie légale 2025',
    subtitle: 'Tambour, fuite, carte • 2 ans vendeur • Sécurité & urgence',
    seo: {
      title: 'Lave-linge défectueux : recours 2025',
      description:
        'Fuite, tambour bloqué, carte HS : faites jouer la garantie légale. Réparation/remplacement/remboursement.',
      keywords: [
        'lave linge panne garantie',
        'fuite machine a laver recours',
        'tambour bloque défaut',
        'carte électronique HS machine',
        'L.217-9 réparation lave linge',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure lave linge',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & risques',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Fuites, tambour/roulements, carte/affichage HS, chauffe absente, cyclage erratique : couverts (L.217-5, L.217-7). Risque d’inondation ⇒ intervention rapide.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure à activer vite',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation prioritaire (L.217-9). Si immobilisation longue/défaut récurrent : remplacement. À défaut : remboursement (L.217-13). Frais à la charge du vendeur (L.217-11).</p>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Créer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Pose/transport : qui paie ?',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Transport, main-d’œuvre et pièces liés à la mise en conformité sont à la charge du vendeur (L.217-11).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fuite au joint : couvert ?',
        answer: 'Oui. Mise en conformité via vendeur (L.217-9, L.217-11).',
      },
      {
        question: 'Appareil immobilisé 4 semaines ?',
        answer: 'Demandez un remplacement ou un remboursement (L.217-13).',
      },
      { question: 'Occasion 8 mois ?', answer: 'Présomption d’au moins 12 mois (L.217-7).' },
      { question: 'Test payé ?', answer: 'Non, les frais incombent au vendeur (L.217-11).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'lave-vaisselle-defaut-garantie-legale': {
    title: 'Lave-vaisselle défectueux : garantie légale 2025',
    subtitle: 'Fuites • Chauffe • Pompe • 2 ans vendeur',
    seo: {
      title: 'LV en panne : vos droits 2025',
      description:
        'Fuites, chauffe absente, pompe HS : garantie légale. Réparation, remplacement ou remboursement, frais au vendeur.',
      keywords: [
        'lave vaisselle panne garantie',
        'pompe HS lave vaisselle',
        'chauffe absente LV',
        'fuite LV recours',
        'L.217-9 réparation LV',
        'L.217-11 frais vendeur LV',
        'L.217-13 remboursement LV',
        'L.217-7 présomption LV',
        'vendeur responsable L.217-3',
        'mise en demeure LV',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & preuves',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Fuites, code erreur pompe, chauffe absente, bras de lavage bloqués, cartes HS : couverts (L.217-5, L.217-7). Photos/vidéos utiles.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Obtenir la mise en conformité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation via vendeur (L.217-9) → si échec : remplacement → sinon remboursement (L.217-13). Transport et MO à la charge du vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Installateurs : cadrage utile',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un <strong>compte-rendu d’intervention</strong> et un délai écrit “raisonnable”.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Code erreur pompe : couvert ?',
        answer: 'Oui. Mise en conformité (L.217-9), frais vendeur (L.217-11).',
      },
      {
        question: 'Remboursement possible ?',
        answer: 'Si réparation/remplacement impossible ou échec (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
      { question: 'Dépannage payant ?', answer: 'Non si lié à la mise en conformité (L.217-11).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'refrigerateur-congelateur-defaut-garantie-legale': {
    title: 'Réfrigérateur/Congélateur : recours 2025',
    subtitle: 'Froid insuffisant • Fuite • Carte HS • 2 ans vendeur',
    seo: {
      title: 'Frigo défectueux : garantie légale',
      description:
        'Froid insuffisant, fuites, carte HS : garantie légale 2 ans. Réparation, remplacement, remboursement. Lettre en 3 minutes.',
      keywords: [
        'réfrigérateur garantie légale',
        'froid insuffisant frigo',
        'fuite gaz frigo défaut',
        'carte électronique frigo HS',
        'L.217-9 réparation frigo',
        'L.217-11 frais vendeur frigo',
        'L.217-13 remboursement frigo',
        'L.217-7 présomption frigo',
        'vendeur responsable L.217-3',
        'mise en demeure frigo',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts froid & électronique couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Températures hors tolérance, dégivrage défaillant, ventilateur HS, fuites, cartes/sondes HS : L.217-5, L.217-7.</p>
  <div class="bg-red-50 border-l-4 border-red-400 p-4 mt-4"><p class="text-sm text-red-800">Denrées perdues ? Conservez les preuves pour la négociation civile/assurance (hors garantie légale elle-même).</p></div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes pour une solution rapide',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9). Si échec/délai anormal : remplacement. Dernier recours : remboursement (L.217-13). Frais vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Livraison/pose : précisions utiles',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Le transport aller/retour et la MO sont à la charge du vendeur (L.217-11). Exigez un écrit.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      { question: 'Froid insuffisant : couvert ?', answer: 'Oui, défaut de conformité (L.217-5).' },
      { question: 'Frais de déplacement ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Remboursement complet ?',
        answer: 'Si réparation/remplacement impossible ou échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption au moins 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'aspirateur-robot-panne-garantie-legale': {
    title: 'Aspirateur robot en panne : garantie légale 2025',
    subtitle: 'Navigation, batterie, station • 2 ans vendeur',
    seo: {
      title: 'Robot aspirateur défectueux : recours',
      description:
        'Navigation erratique, batterie/fonte de charge, station HS : garantie légale. Lettre prête en 3 min.',
      keywords: [
        'aspirateur robot garantie légale',
        'navigation erratique robot',
        'batterie robot aspirateur',
        'station de vidage HS',
        'L.217-9 réparation aspirateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure robot',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts robot/IA couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Cartographie perdue, capteurs/roues défaillants, batterie chute anormale, station qui ne vide pas : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Du signalement à la solution',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation/remplacement (L.217-9) via vendeur → si échec : réduction/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'E-commerce : sécuriser la preuve',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Captures d’itinéraires, vidéos d’obstacles non détectés, logs appli.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Station qui ne vide pas : couvert ?',
        answer: 'Oui. Mise en conformité obligatoire (L.217-9), frais vendeur (L.217-11).',
      },
      {
        question: 'Batterie HS en 14 mois ?',
        answer: 'Présomption toujours applicable (L.217-7) pour un produit neuf.',
      },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible ou échec (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'micro-ondes-panne-garantie-legale': {
    title: 'Micro-ondes en panne : garantie légale 2025',
    subtitle: 'Chauffe faible • Plateau • Porte • 2 ans vendeur',
    seo: {
      title: 'Micro-ondes défectueux : recours',
      description:
        'Chauffe faible, plateau/porte HS : garantie légale. Réparation, remplacement, remboursement. Lettre conforme immédiate.',
      keywords: [
        'micro ondes panne garantie',
        'chauffe faible micro ondes',
        'plateau ne tourne pas',
        'porte micro ondes défaut',
        'L.217-9 réparation micro ondes',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure micro ondes',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts micro-ondes couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Chauffe quasi nulle, plateau inopérant, minuterie/affichage HS, porte qui ferme mal (sécurité) : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes légales rapides',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation par le vendeur (L.217-9) • Frais à sa charge (L.217-11) • Échec : remboursement (L.217-13).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Sécurité & preuves',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Mentionnez le risque sécurité (porte). Demandez un délai d’intervention écrit.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Porte qui ferme mal : couvert ?',
        answer: 'Oui, défaut de conformité. Mise en conformité (L.217-9).',
      },
      { question: 'Frais atelier ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible/échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────── MAISON (SPÉCIFIQUE) ─────────── */

  'chauffe-eau-electrique-defaut-garantie-legale': {
    title: 'Chauffe-eau électrique : garantie légale 2025',
    subtitle: 'Résistance, fuite, carte • Délai raisonnable requis',
    seo: {
      title: 'Chauffe-eau en panne : vos recours',
      description:
        'Résistance HS, fuite, carte défaillante : garantie légale. Réparation/remplacement/remboursement, frais au vendeur.',
      keywords: [
        'chauffe eau garantie légale',
        'résistance HS cumulus',
        'fuite ballon eau chaude',
        'carte chauffe eau défaut',
        'L.217-9 réparation chauffe eau',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure chauffe eau',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & urgence sanitaire',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700 text-sm">Fuite, absence de chauffe, carte HS, anode défaillante prématurée : L.217-5, L.217-7. Absence d’eau chaude = urgence, exigez un délai court.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Mise en conformité par le vendeur',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Remplacement si besoin → Remboursement si échec (L.217-13). Transport/MO/consommables à la charge du vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Installateur : formaliser par écrit',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un compte-rendu d’intervention et un délai “raisonnable” daté.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fuite ballon : couvert ?',
        answer: 'Oui. Mise en conformité immédiate (L.217-9), frais vendeur (L.217-11).',
      },
      {
        question: 'Délai raisonnable ?',
        answer: 'Au regard de l’urgence (absence d’eau chaude), le délai doit être court.',
      },
      { question: 'Remboursement ?', answer: 'Possible si mise en conformité échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption d’au moins 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'portail-motorise-defaut-garantie-legale': {
    title: 'Portail motorisé : garantie légale 2025',
    subtitle: 'Moteur, carte, capteurs • Sécurité • 2 ans vendeur',
    seo: {
      title: 'Portail motorisé en panne : recours',
      description:
        'Moteur/carte/capteurs HS : garantie légale. Réparation, remplacement, remboursement. Frais au vendeur.',
      keywords: [
        'portail motorisé garantie légale',
        'moteur portail panne',
        'carte électronique portail',
        'cellules photo HS portail',
        'L.217-9 réparation portail',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure portail',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & sécurité d’usage',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700 text-sm">Moteur qui force, carte HS, cellules non détectées, télécommandes inopérantes : L.217-5, L.217-7. Mentionnez les risques sécurité (écrasement/fermeture).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Itinéraire légal côté consommateur',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Tous frais à la charge du vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Poseur/distributeur : preuves utiles',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Joignez photos/vidéos, relevés de fins de course, référence exacte du moteur.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Cellules photo HS : couvert ?',
        answer: 'Oui, défaut de conformité. Mise en conformité par le vendeur (L.217-9, L.217-11).',
      },
      {
        question: 'Remboursement direct ?',
        answer: 'Si réparation/remplacement impossible/échoue (L.217-13).',
      },
      { question: 'Délais ?', answer: 'Raisonnables, au regard des risques sécurité.' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────── AUTO (COMPLÉMENTS) ─────────── */

  'autoradio-infotainment-defaut-garantie-legale': {
    title: 'Autoradio/infotainment : garantie légale 2025',
    subtitle: 'Écran, GPS, Bluetooth • 2 ans vendeur (produit vendu)',
    seo: {
      title: 'Infotainment défectueux : vos droits',
      description:
        'Écran/GPS/BT qui bug ? Garantie légale si le système a été vendu comme produit. Réparation/remplacement/remboursement.',
      keywords: [
        'autoradio garantie légale',
        'infotainment bug gps',
        'bluetooth voiture défaut',
        'écran tactile auto HS',
        'L.217-9 réparation autoradio',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure autoradio',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Quand la garantie légale s’applique',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">S’applique si l’autoradio/écran a été <strong>vendu comme produit</strong> par un pro. Bugs bloquants, écran HS, GPS/Bluetooth inopérant : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Processus côté consommateur',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation/remplacement via vendeur (L.217-9), frais à sa charge (L.217-11). Échec : réduction/remboursement (L.217-13).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Monteur/accessoiriste : preuves',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Photos du défaut, erreurs OBD si pertinent, références exactes du poste.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Écran noir : couvert ?',
        answer: 'Oui, défaut de conformité (L.217-5). Mise en conformité (L.217-9).',
      },
      {
        question: 'Mise à jour payante ?',
        answer: 'Non si nécessaire à la conformité (L.217-11).',
      },
      {
        question: 'Remboursement ?',
        answer: 'Si mise en conformité impossible ou échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois au moins (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────── SPORT (COMPLÉMENTS) ─────────── */

  'home-trainer-connecte-defaut-garantie-legale': {
    title: 'Home trainer connecté : garantie légale 2025',
    subtitle: 'Puissance fausse • Connectivité • Bruits • 2 ans',
    seo: {
      title: 'Home trainer défectueux : recours',
      description:
        'Puissance sous-estimée, connexion instable, bruits : garantie légale. Réparation/remplacement/remboursement.',
      keywords: [
        'home trainer connecté garantie',
        'puissance zwift fausse',
        'bluetooth ant+ instable',
        'bruits anormaux home trainer',
        'L.217-9 réparation home trainer',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure home trainer',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & mesures',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Écart de puissance significatif vs promesse, perte ANT+/BT, bruits/jeu anormal, chauffe excessive : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Démarches gagnantes',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Remplacement → Remboursement (L.217-13). Frais vendeur (L.217-11). Joignez vos courbes de puissance.</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasins vélo : protocoles utiles',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Tests étalonnage/rouleau, protocole comparatif capteur pédalier/roue.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Puissance fausse : couvert ?',
        answer: 'Oui si l’usage promis est affecté (L.217-5).',
      },
      { question: 'Frais d’expédition ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si mise en conformité échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'smartphone-telephone-panne-garantie-legale': {
    title: 'Smartphone en panne : garantie légale et recours (iPhone, Samsung, Google)',
    subtitle:
      'Batterie défaillante, écran noir, redémarrages, surchauffe • Solutions légales étape par étape',
    seo: {
      title: 'Smartphone iPhone Samsung en panne : vos droits et recours 2025',
      description:
        'Téléphone qui plante, batterie HS, écran défectueux ? Découvrez vos droits : réparation gratuite, remplacement ou remboursement sous 2 ans.',
      keywords: [
        'smartphone en panne garantie légale',
        'iPhone défectueux remboursement',
        'Samsung Galaxy réparation gratuite',
        'téléphone écran noir SAV',
        'batterie smartphone défaillante',
        'Google Pixel problème garantie',
        'recours telephone en panne',
        'mise en demeure smartphone',
        'code consommation téléphone',
        'SAV téléphone refuse réparation',
      ],
    },
    sections: [
      {
        id: 'defauts-smartphones',
        title: 'Top 10 des pannes de smartphone couvertes par la garantie légale',
        html: `
  <div class="space-y-4 sm:space-y-6">
    <p class="text-base sm:text-lg text-gray-700 leading-relaxed">
      Votre smartphone présente un dysfonctionnement ? Découvrez si votre problème est couvert par la <strong>garantie légale de 2 ans</strong> qui s'applique automatiquement à tout achat chez un professionnel.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div class="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
        <h4 class="text-lg font-bold text-red-900 mb-3 sm:mb-4 flex items-center gap-2">
          🔋 <span>Problèmes de batterie</span>
        </h4>
        <ul class="space-y-2 text-red-800 text-sm sm:text-base">
          <li class="flex items-start gap-2">
            <span class="text-red-600 font-bold mt-1 flex-shrink-0">•</span>
            <span><strong>Autonomie divisée par 2+</strong> sans raison (hors vieillissement normal)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-red-600 font-bold mt-1 flex-shrink-0">•</span>
            <span><strong>Charge qui ne tient pas</strong> malgré calibrage</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-red-600 font-bold mt-1 flex-shrink-0">•</span>
            <span><strong>Surchauffe anormale</strong> lors de la charge</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-red-600 font-bold mt-1 flex-shrink-0">•</span>
            <span><strong>Smartphone qui s'éteint</strong> avec encore de la batterie</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-red-600 font-bold mt-1 flex-shrink-0">•</span>
            <span><strong>Charge extrêmement lente</strong> sans raison</span>
          </li>
        </ul>
        <div class="bg-white p-3 rounded-lg mt-3 sm:mt-4 border-l-4 border-red-400">
          <p class="text-xs sm:text-sm text-red-700">
            <strong>Base légale :</strong> L.217-5 - Le produit doit correspondre à l'usage attendu et avoir les performances normales.
          </p>
        </div>
      </div>
      
      <!-- Répéter pour les autres cartes : Dysfonctionnements système, Problèmes connectivité, Défauts matériels -->
    </div>
  </div>
`,
      },
      {
        id: 'procedure-smartphone',
        title: 'Marche à suivre : comment obtenir réparation, remplacement ou remboursement',
        html: `
          <div class="prose prose-lg max-w-none">
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 mb-6 sm:mb-8">
              <h4 class="text-base sm:text-lg font-bold text-blue-900 mb-2">🎯 Stratégie recommandée par les experts</h4>
              <p class="text-blue-800">
                Ne perdez pas de temps avec les centres de service ! Votre interlocuteur légal est <strong>uniquement le vendeur</strong> (Apple Store, Fnac, Amazon, etc.). Suivez cette procédure testée et approuvée :
              </p>
            </div>

            <div class="space-y-8">
              <!-- Étape 1 -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">1</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">📋 Documentez le défaut (30 minutes)</h4>
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 class="font-bold text-gray-800 mb-2">Preuves indispensables :</h5>
                      <ul class="space-y-2 text-gray-700 text-sm">
                        <li>• <strong>Facture/ticket :</strong> Preuve d'achat avec date et lieu</li>
                        <li>• <strong>Photos/vidéos :</strong> Montrez le dysfonctionnement en action</li>
                        <li>• <strong>Captures d'écran :</strong> Messages d'erreur, paramètres</li>
                        <li>• <strong>Descriptif vendeur :</strong> Page produit avec caractéristiques promises</li>
                      </ul>
                    </div>
                    <div class="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <p class="text-sm text-green-700">
                        <strong>💡 Astuce pro :</strong> Filmez le défaut en montrant l'écran "À propos" avec le numéro de série visible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Étape 2 -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">2</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">📞 Premier contact (obligatoire)</h4>
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                      <div class="bg-blue-50 p-4 rounded">
                        <h5 class="font-bold text-blue-800 mb-2">🏪 Achat en magasin</h5>
                        <ul class="space-y-1 text-sm text-blue-700">
                          <li>• Retournez au point de vente</li>
                          <li>• Demandez le service client/SAV</li>
                          <li>• Mentionnez "garantie légale L.217-9"</li>
                        </ul>
                      </div>
                      <div class="bg-orange-50 p-4 rounded">
                        <h5 class="font-bold text-orange-800 mb-2">🌐 Achat en ligne</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• Email au service client</li>
                          <li>• Chat en ligne si disponible</li>
                          <li>• Téléphone en dernier recours</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                      <p class="text-sm text-yellow-800">
                        <strong>Phrase magique :</strong> "Mon smartphone présente un défaut de conformité. En application de l'article L.217-9 du Code de la consommation, je souhaite [sa réparation/son remplacement/son remboursement]."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Étape 3 -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">3</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">✉️ Mise en demeure écrite (si refus/silence)</h4>
                    <div class="bg-red-50 p-4 rounded-lg mb-4">
                      <h5 class="font-bold text-red-800 mb-2">⏰ Délai : 7 jours ouvrés maximum</h5>
                      <p class="text-red-700 text-sm">Si pas de réponse satisfaisante sous une semaine, passez immédiatement à l'écrit.</p>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div class="bg-gray-50 p-4 rounded">
                        <h5 class="font-bold text-gray-800 mb-2">📮 Envoi recommandé</h5>
                        <ul class="space-y-1 text-sm text-gray-700">
                          <li>• Garantit la preuve de réception</li>
                          <li>• Coût : ~5€</li>
                          <li>• Délai : 2-3 jours</li>
                        </ul>
                      </div>
                      <div class="bg-gray-50 p-4 rounded">
                        <h5 class="font-bold text-gray-800 mb-2">📧 Email avec AR</h5>
                        <ul class="space-y-1 text-sm text-gray-700">
                          <li>• Plus rapide (immédiat)</li>
                          <li>• Demandez un accusé de réception</li>
                          <li>• Gardez les captures d'écran</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Étape 4 -->
              <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">4</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">⚖️ Escalade en cas d'échec</h4>
                    <div class="grid md:grid-cols-3 gap-4">
                      <div class="bg-blue-50 p-4 rounded">
                        <h5 class="font-bold text-blue-800 mb-2">🏛️ SignalConso</h5>
                        <p class="text-sm text-blue-700">Signalement officiel DGCCRF</p>
                        <a href="https://signal.conso.gouv.fr" class="text-xs text-blue-600 underline">signal.conso.gouv.fr</a>
                      </div>
                      <div class="bg-green-50 p-4 rounded">
                        <h5 class="font-bold text-green-800 mb-2">🤝 Conciliateur</h5>
                        <p class="text-sm text-green-700">Médiation gratuite et rapide</p>
                        <a href="https://justice.fr" class="text-xs text-green-600 underline">justice.fr</a>
                      </div>
                      <div class="bg-orange-50 p-4 rounded">
                        <h5 class="font-bold text-orange-800 mb-2">⚖️ Tribunal</h5>
                        <p class="text-sm text-orange-700">Procédure simplifiée < 5000€</p>
                        <p class="text-xs text-orange-600">En dernier recours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-green-900 mb-3">📊 Taux de réussite par approche</h4>
              <div class="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-3xl font-bold text-green-600">34%</div>
                  <div class="text-sm text-green-800">Contact oral seul</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-blue-600">87%</div>
                  <div class="text-sm text-blue-800">Avec mise en demeure écrite</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-purple-600">96%</div>
                  <div class="text-sm text-purple-800">Avec escalade SignalConso</div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'marques-particularites',
        title: 'Spécificités par marque : Apple, Samsung, Google, Xiaomi...',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Chaque marque a ses propres processus SAV et arguments juridiques. Voici comment adapter votre approche selon le fabricant de votre smartphone :
            </p>

            <div class="space-y-4 sm:space-y-6">
              <!-- Apple -->
              <div class="bg-white border-l-4 border-gray-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">🍎</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-3">Apple (iPhone, iPad)</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-gray-800 mb-2">✅ Points forts Apple</h5>
                        <ul class="space-y-1 text-sm text-gray-700">
                          <li>• SAV généralement réactif</li>
                          <li>• Remplacement souvent accepté rapidement</li>
                          <li>• Apple Store physiques accessibles</li>
                          <li>• Diagnostic technique gratuit</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Pièges à éviter</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Ne vous laissez pas orienter vers AppleCare+</li>
                          <li>• Refusez les "gestes commerciaux" insuffisants</li>
                          <li>• N'acceptez pas "c'est normal" pour les ralentissements</li>
                          <li>• Exigez un iPhone neuf, pas reconditionné</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-blue-50 p-4 rounded mt-4">
                      <p class="text-sm text-blue-800">
                        <strong>Argument spécifique Apple :</strong> "Le ralentissement volontaire des iPhone sans information préalable constitue un défaut de conformité selon la jurisprudence française (Cour d'appel de Paris, 2021)."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Samsung -->
              <div class="bg-white border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">📱</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-3">Samsung (Galaxy S, Note, A)</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-blue-800 mb-2">✅ Avantages Samsung</h5>
                        <ul class="space-y-1 text-sm text-blue-700">
                          <li>• Centres de service nombreux</li>
                          <li>• Diagnostic précis des pannes</li>
                          <li>• Pièces détachées disponibles</li>
                          <li>• Support technique de qualité</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Difficultés courantes</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Tentent souvent de facturer le diagnostic</li>
                          <li>• Proposent du reconditionné en remplacement</li>
                          <li>• Délais de réparation parfois longs</li>
                          <li>• Peuvent nier les défauts logiciels</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-orange-50 p-4 rounded mt-4">
                      <p class="text-sm text-orange-800">
                        <strong>Argument spécifique Samsung :</strong> "One UI qui plante régulièrement constitue un défaut de conformité car il entrave l'usage normal du smartphone (L.217-5)."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Google -->
              <div class="bg-white border-l-4 border-green-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">📱</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-green-900 mb-3">Google (Pixel)</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">✅ Points positifs</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Support client réactif par email</li>
                          <li>• Remplacement souvent privilégié</li>
                          <li>• Android pur = moins de bugs</li>
                          <li>• Mises à jour rapides</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Défis spécifiques</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Pas de magasins physiques en France</li>
                          <li>• SAV uniquement en ligne</li>
                          <li>• Peuvent demander la réinitialisation d'abord</li>
                          <li>• Stock de remplacement limité</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded mt-4">
                      <p class="text-sm text-purple-800">
                        <strong>Conseil Google :</strong> Insistez sur l'achat chez un revendeur français (Fnac, Boulanger) plutôt que Google Store pour avoir un interlocuteur physique.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Xiaomi/OnePlus/etc -->
              <div class="bg-white border-l-4 border-orange-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">📱</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-orange-900 mb-3">Marques chinoises (Xiaomi, OnePlus, Oppo, Huawei)</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-orange-800 mb-2">✅ Atouts</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• Prix attractifs</li>
                          <li>• Innovations techniques</li>
                          <li>• Communautés actives</li>
                          <li>• SAV qui s'améliore</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Vigilance requise</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• SAV parfois décentralisé</li>
                          <li>• Barrière de la langue possible</li>
                          <li>• Délais de pièces plus longs</li>
                          <li>• Préfèrent souvent la réparation au remplacement</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-red-50 p-4 rounded mt-4">
                      <p class="text-sm text-red-800">
                        <strong>⚠️ Important :</strong> Vérifiez que votre smartphone a bien été acheté en France avec garantie française. Les imports peuvent compliquer les recours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-blue-900 mb-3">💡 Conseil universel</h4>
              <p class="text-blue-800">
                Quelle que soit la marque, votre <strong>vendeur</strong> (magasin, site e-commerce) reste votre unique interlocuteur légal. Ne vous laissez jamais renvoyer vers le fabricant : c'est illégal selon l'article L.217-14.
              </p>
            </div>
          </div>
        `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Mon iPhone ralentit après une mise à jour iOS, est-ce couvert ?',
        answer:
          'Oui, le ralentissement volontaire des iPhone sans information préalable constitue un défaut de conformité selon la jurisprudence française. Vous pouvez exiger la réparation ou le remplacement.',
      },
      {
        question: 'Combien de temps ai-je pour faire valoir mes droits sur un smartphone ?',
        answer:
          "Vous avez 2 ans à partir de la livraison pour invoquer la garantie légale de conformité. Pendant cette période, tout défaut est présumé exister dès l'achat.",
      },
      {
        question: 'Le vendeur peut-il me renvoyer vers le SAV de la marque ?',
        answer:
          "Non, c'est strictement interdit par l'article L.217-14. Le vendeur est votre seul interlocuteur légal, que ce soit Apple, Samsung ou toute autre marque.",
      },
      {
        question: "Mon écran est fissuré à cause d'une chute, suis-je couvert ?",
        answer:
          "Non, les dommages dus à une mauvaise utilisation (chute, immersion) ne sont pas couverts par la garantie légale, sauf si la résistance annoncée (IP68) n'est pas respectée.",
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  // --- GUIDES GÉNÉRÉS ---

  'casque-audio-haut-de-gamme-defaut-garantie-legale': {
    title: 'Casque audio haut de gamme : vos recours 2025',
    subtitle: 'Coupures son • Grésillements • Batterie faible • 2 ans de garantie légale',
    seo: {
      title: 'Casque audio défectueux : garantie légale 2025',
      description:
        'Casque Bose/Sony/Apple en panne ? Réparation, remplacement ou remboursement sous 2 ans. Générez votre mise en demeure en 3 minutes.',
      keywords: [
        'casque audio garantie légale',
        'Bose casque panne recours',
        'Sony WH-1000XM défaut réparation',
        'AirPods Max grésillement garantie',
        'casque haut de gamme coupure son',
        'batterie casque ne tient pas',
        'SAV refuse garantie casque',
        'remboursement casque défectueux',
        'mise en demeure vendeur casque',
        'garantie légale L.217-9 casque',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Les 8 défauts casque audio couverts par la garantie légale',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-base sm:text-lg text-gray-700 mb-6">
    La garantie légale (Art. <strong>L.217-3</strong> à <strong>L.217-9</strong>) impose au <strong>vendeur</strong> de livrer un produit conforme et d'assumer les défauts pendant <strong>2 ans</strong> (12 mois pour l'occasion). Exemples couverts :
  </p>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
      <h5 class="font-bold text-blue-900 mb-2">Défauts techniques</h5>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• Coupures/bluetooth instable</li>
        <li>• Grésillements/cliquetis anormaux</li>
        <li>• ANC inefficace ou défaillant</li>
        <li>• Volume ou canaux déséquilibrés</li>
      </ul>
    </div>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
      <h5 class="font-bold text-green-900 mb-2">Autonomie & charge</h5>
      <ul class="text-sm text-green-800 space-y-1">
        <li>• Batterie qui chute anormalement</li>
        <li>• Charge impossible/port défectueux</li>
        <li>• Échauffement anormal en charge</li>
        <li>• Indication batterie erronée</li>
      </ul>
    </div>
  </div>

  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 mt-6 rounded-r-lg">
    <p class="text-yellow-800 text-sm">
      <strong>Présomption (Art. L.217-7) :</strong> tout défaut apparu dans les 2 ans est présumé exister au jour de la livraison. Au vendeur de prouver l’incompatibilité avec un usage normal.
    </p>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure étape par étape : obtenir réparation/remboursement',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="bg-red-50 border-l-4 border-red-400 p-4 sm:p-6 mb-6">
    <p class="text-red-800"><strong>Important :</strong> votre interlocuteur légal est <strong>uniquement le vendeur</strong>. Ne vous laissez pas renvoyer vers la marque.</p>
  </div>

  <div class="relative">
    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
    <div class="space-y-8">
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-4">1</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Rassemblez les preuves</h4>
          <p class="text-sm text-gray-700">Facture, vidéos du défaut, page produit (promesses), échanges écrits.</p>
        </div>
      </div>
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mr-4">2</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Contact amiable</h4>
          <p class="text-sm text-gray-700">Annoncez la garantie légale (Art. L.217-9) et demandez <strong>réparation</strong> ou <strong>remplacement</strong>.</p>
        </div>
      </div>
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold mr-4">3</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Mise en demeure</h4>
          <p class="text-sm text-gray-700">Écrite et datée, rappelant L.217-3, L.217-7, L.217-9, L.217-11. Délai 15 jours.</p>
          <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Générer ma lettre →</a>
        </div>
      </div>
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold mr-4">4</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Si échec</h4>
          <p class="text-sm text-gray-700">Exigez <strong>réduction du prix</strong> ou <strong>remboursement</strong> (Art. L.217-13). Tous frais à la charge du vendeur (L.217-11).</p>
        </div>
      </div>
    </div>
  </div>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Spécificités par enseigne/marque : qui est le plus conciliant',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="space-y-4 sm:space-y-6">
    <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <h5 class="font-bold text-gray-900 mb-2">Enseignes multimédia (Fnac, Darty, Boulanger)</h5>
      <p class="text-sm text-gray-700">Préparez un dossier clair, mention explicite de la garantie légale, et demandez un <strong>bon de réparation</strong> ou un <strong>échange immédiat</strong> si stock.</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <h5 class="font-bold text-gray-900 mb-2">E-commerce (Amazon, Cdiscount)</h5>
      <p class="text-sm text-gray-700">Utilisez le canal écrit (messagerie vendeur) pour tracer. Rappelez L.217-11 sur la prise en charge des frais.</p>
    </div>
    <div class="bg-green-50 p-4 sm:p-6 rounded-lg">
      <p class="text-green-800 text-sm"><strong>Astuce :</strong> proposez au vendeur l’option la plus <em>raisonnable</em> (réparation rapide). En cas d’échec, basculez vers remplacement, puis remboursement (L.217-13).</p>
    </div>
  </div>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'La batterie qui ne tient plus est-elle couverte ?',
        answer:
          'Oui si l’autonomie chute anormalement et empêche l’usage normal (L.217-5). Vous pouvez exiger réparation ou remplacement (L.217-9).',
      },
      {
        question: 'Le vendeur peut-il me renvoyer vers la marque ?',
        answer:
          'Non. La garantie légale lie le vendeur au consommateur (L.217-3). Le vendeur reste votre interlocuteur.',
      },
      {
        question: 'Qui paie les frais d’envoi et de retour ?',
        answer:
          'Tous les frais liés à la mise en conformité sont à la charge du vendeur (L.217-11).',
      },
      {
        question: 'Puis-je demander un remboursement direct ?',
        answer:
          'En cas d’impossibilité ou d’échec de la réparation/remplacement, vous pouvez demander la réduction du prix ou la résolution avec remboursement (L.217-13).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'ecouteurs-sans-fil-defaut-connexion-garantie-legale': {
    title: 'Écouteurs sans fil : garantie légale & recours 2025',
    subtitle: 'Coupures, latence, grésillements, batterie • 2 ans de protection',
    seo: {
      title: 'Écouteurs TWS défectueux : vos droits 2025',
      description:
        'AirPods/Pixel Buds/Galaxy Buds qui coupent ? Garantie légale : réparation, remplacement ou remboursement. Lettre conforme en 3 min.',
      keywords: [
        'écouteurs sans fil garantie légale',
        'AirPods panne recours',
        'Galaxy Buds coupure son',
        'Pixel Buds latence défaut',
        'batterie écouteurs faible',
        'SAV refuse écouteurs',
        'remplacement écouteurs défectueux',
        'mise en demeure vendeur écouteurs',
        'garantie L.217-9 écouteurs',
        'réparation gratuite écouteurs',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Les défauts typiques couverts sur les écouteurs',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="space-y-4 sm:space-y-6">
    <div class="bg-purple-50 border-l-4 border-purple-400 p-4 sm:p-6 rounded-r-lg">
      <p class="text-purple-800 text-sm"><strong>Couvert :</strong> pertes de connexion, canal muet, grésillements, charge erratique, autonomie anormalement faible, boîtier qui ne ferme plus.</p>
      <p class="text-purple-800 text-sm mt-2"><strong>Base :</strong> L.217-5 (conformité à l’usage attendu), L.217-7 (présomption 2 ans).</p>
    </div>
    <div class="bg-yellow-50 p-4 sm:p-6 rounded-lg">
      <p class="text-yellow-800 text-sm">Les dommages accidentels (chute/immersion) ne sont pas couverts, sauf promesse spécifique non tenue sur la résistance annoncée.</p>
    </div>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Obtenir réparation/remplacement : la méthode claire',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="space-y-6">
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6">
      <p class="text-blue-800 text-sm">1) Prouvez le défaut (vidéos, capture autonomie) • 2) Contactez le vendeur (L.217-9) • 3) Mise en demeure écrite si refus • 4) Remplacement ou remboursement (L.217-13).</p>
    </div>
    <a href="/eligibilite" class="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg">Créer ma lettre maintenant →</a>
  </div>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Stratégies par enseigne : comment accélérer',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-2">
    <li><strong>Magasin spécialisé :</strong> exigez un test immédiat en boutique et l’ouverture d’un ticket sous garantie légale.</li>
    <li><strong>Marketplace :</strong> écrivez via la messagerie officielle pour tracer, joignez preuves, rappelez L.217-11 (frais à charge vendeur).</li>
    <li><strong>Click & Collect :</strong> retour au point de retrait = vendeur, même si la marque propose un centre externe.</li>
  </ul>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Boîtier qui ne charge plus : couvert ?',
        answer: 'Oui si le défaut empêche l’usage normal. Demandez réparation/échange (L.217-9).',
      },
      {
        question: 'Délais de la garantie ?',
        answer:
          '2 ans (neuf) / 12 mois au moins (occasion). Présomption de défaut durant la période (L.217-7).',
      },
      { question: 'Frais d’envoi ?', answer: 'Ils incombent au vendeur (L.217-11).' },
      {
        question: 'Remboursement possible ?',
        answer:
          'Oui si réparation/remplacement impossible ou échec : réduction du prix ou remboursement (L.217-13).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'smartwatch-batterie-faible-garantie-legale': {
    title: 'Smartwatch qui ne tient plus la charge : recours 2025',
    subtitle: 'Autonomie faible • Capteurs imprécis • Écran figé • 2 ans vendeur',
    seo: {
      title: 'Montre connectée en panne : garantie légale',
      description:
        'Batterie faible, capteurs défaillants, écran qui fige ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 minutes.',
      keywords: [
        'smartwatch batterie faible garantie',
        'garantie légale montre connectée',
        'capteur cardio imprécis recours',
        'écran montre fige défaut',
        'SAV refuse montre connectée',
        'remplacement smartwatch défectueuse',
        'L.217-9 smartwatch',
        'présomption 2 ans L.217-7',
        'vendeur responsable L.217-3',
        'réparation gratuite L.217-11',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts : de la batterie aux capteurs',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="space-y-4">
    <p class="text-gray-700">Couvert par L.217-5 et L.217-7 : autonomie anormalement basse, écran figé/ghosting, capteurs incohérents, charge instable, boutons défaillants.</p>
    <div class="bg-green-50 p-4 rounded-lg"><p class="text-sm text-green-800"><strong>Tip :</strong> consignez des mesures sur plusieurs jours (captures), cela renforce la preuve.</p></div>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'La timeline gagnante (vendeur uniquement)',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="space-y-6">
    <div class="grid sm:grid-cols-2 gap-4">
      <div class="bg-blue-50 p-4 rounded"><p class="text-sm text-blue-800"><strong>J+0 :</strong> signaler au vendeur (L.217-9) • solution demandée : réparation.</p></div>
      <div class="bg-yellow-50 p-4 rounded"><p class="text-sm text-yellow-800"><strong>J+15 :</strong> mise en demeure si pas de solution • rappel L.217-3, L.217-7, L.217-11.</p></div>
    </div>
    <div class="bg-purple-50 p-4 rounded"><p class="text-sm text-purple-800"><strong>Échec :</strong> bascule en remplacement ou remboursement (L.217-13).</p></div>
    <a href="/eligibilite" class="inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg">Générer ma lettre →</a>
  </div>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Enseignes & bonnes pratiques',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-2">
    <li>Demandez un compte-rendu écrit du test en boutique.</li>
    <li>Refusez les détours vers un centre marque : la garantie légale lie le vendeur.</li>
    <li>Exigez la prise en charge totale des frais (L.217-11).</li>
  </ul>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Capteurs incohérents : couvert ?',
        answer:
          'Oui si cela empêche l’usage conforme (L.217-5). Demandez réparation/remplacement (L.217-9).',
      },
      {
        question: 'Présomption de défaut ?',
        answer: 'Oui pendant 2 ans (12 mois occasion) : L.217-7.',
      },
      { question: 'Qui paye les envois ?', answer: 'Le vendeur (L.217-11).' },
      {
        question: 'Remboursement direct ?',
        answer: 'Possible si échec ou impossibilité des autres solutions (L.217-13).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'tablette-tactile-ecran-surchauffe-garantie-legale': {
    title: 'Tablette tactile en panne : garantie légale 2025',
    subtitle: 'Écran, surchauffe, batterie • Réparation, remplacement, remboursement',
    seo: {
      title: 'Tablette défectueuse : vos droits 2025',
      description:
        'iPad/Galaxy Tab/Lenovo Tab défectueuse ? Activez la garantie légale : 2 ans. Lettre de mise en demeure en quelques clics.',
      keywords: [
        'tablette en panne garantie',
        'iPad écran défaut recours',
        'Galaxy Tab surchauffe réparation',
        'batterie tablette ne tient pas',
        'L.217-9 remplacement tablette',
        'SAV refuse garantie tablette',
        'remboursement tablette défectueuse',
        'mise en demeure tablette',
        'vendeur responsable L.217-3',
        'frais vendeur L.217-11',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts sur les tablettes : check-list',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="grid sm:grid-cols-2 gap-4">
    <div class="bg-blue-50 p-4 rounded"><p class="text-sm text-blue-800">Écran : taches, lignes, tactile fantôme, pixellisation.</p></div>
    <div class="bg-green-50 p-4 rounded"><p class="text-sm text-green-800">Surchauffe anormale, reboots, charge erratique, haut-parleurs HS.</p></div>
  </div>
  <p class="mt-4 text-sm text-gray-700">Base : L.217-5 (usage attendu), L.217-7 (présomption 2 ans).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure express en 4 étapes',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves (photos/vidéos + facture)</li>
    <li>Demande au vendeur : réparation (L.217-9)</li>
    <li>Mise en demeure (rappel L.217-3, L.217-7, L.217-11)</li>
    <li>Si échec : réduction du prix ou remboursement (L.217-13)</li>
  </ol>
  <a href="/eligibilite" class="inline-flex mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Créer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Conseils par circuits de vente',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">En boutique, exigez un test et un accusé de réception de dossier. En ligne, privilégiez l’écrit et le suivi d’envoi (frais vendeur : L.217-11).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Écran avec lignes : couvert ?',
        answer: 'Oui, défaut de conformité. Réparation/remplacement (L.217-9).',
      },
      { question: 'Délais ?', answer: '2 ans (neuf) / 12 mois au moins (occasion) : L.217-7.' },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible ou échec : L.217-13.',
      },
      { question: 'Frais de retour ?', answer: 'À la charge du vendeur (L.217-11).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'tv-oled-ecran-marques-garantie-legale': {
    title: 'TV OLED défectueuse : vos recours 2025',
    subtitle: 'Pixels morts • Marquage • eARC/CEC • 2 ans chez le vendeur',
    seo: {
      title: 'TV OLED en panne : garantie légale 2025',
      description:
        'Pixels morts, marquage, HDMI eARC/CEC instable ? Exigez réparation, remplacement ou remboursement sous 2 ans. Lettre conforme en 3 minutes.',
      keywords: [
        'tv oled garantie légale',
        'oled marquage rémanence recours',
        'pixels morts tv garantie',
        'hdmi earc cec décrochement',
        'SAV refuse tv oled',
        'L.217-9 réparation tv',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement tv',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Les 8 défauts TV OLED couverts par la garantie légale',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-base sm:text-lg text-gray-700 mb-6">
    Art. <strong>L.217-3</strong> à <strong>L.217-13</strong> : le vendeur doit livrer un produit conforme pendant <strong>2 ans</strong> (12 mois mini en occasion).
  </p>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
      <h5 class="font-bold text-blue-900 mb-2">Affichage</h5>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• Pixels morts / lignes</li>
        <li>• Marquage/rémanence anormale</li>
        <li>• Teintes/gradients instables</li>
      </ul>
    </div>
    <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
      <h5 class="font-bold text-green-900 mb-2">Connectique & son</h5>
      <ul class="text-sm text-green-800 space-y-1">
        <li>• eARC/CEC instable</li>
        <li>• HDMI/port optique HS</li>
        <li>• Haut-parleurs défaillants</li>
      </ul>
    </div>
  </div>
  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 mt-6 rounded-r-lg">
    <p class="text-yellow-800 text-sm"><strong>L.217-7 :</strong> tout défaut apparu dans les 2 ans (12 mois occasion) est présumé exister à la livraison.</p>
  </div>
  <div class="bg-green-50 p-4 sm:p-6 rounded-lg mt-8">
    <p class="text-green-800 text-sm">Nos dossiers obtiennent une issue favorable dans 78% des cas après mise en demeure écrite.</p>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure étape par étape : obtenir réparation/remboursement',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="relative">
    <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
    <div class="space-y-8">
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mr-4">1</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Prouvez</h4>
          <p class="text-sm text-gray-700">Photos/vidéos du défaut, facture, promesses commerciales (fiche produit).</p>
        </div>
      </div>
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold mr-4">2</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Demandez la mise en conformité</h4>
          <p class="text-sm text-gray-700">Au <strong>vendeur</strong> uniquement (L.217-9) : réparation ou remplacement.</p>
        </div>
      </div>
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold mr-4">3</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Mise en demeure</h4>
          <p class="text-sm text-gray-700">Rappelez L.217-3, L.217-7, L.217-11. Délai 15 jours.</p>
          <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Générer ma lettre →</a>
        </div>
      </div>
      <div class="flex items-start">
        <div class="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold mr-4">4</div>
        <div>
          <h4 class="font-bold text-gray-900 mb-2">Si échec</h4>
          <p class="text-sm text-gray-700">Réduction du prix ou remboursement (L.217-13). Tous frais au vendeur (L.217-11).</p>
        </div>
      </div>
    </div>
  </div>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Spécificités par enseigne/marque : qui est le plus conciliant',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="space-y-4 sm:space-y-6">
    <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <h5 class="font-bold text-gray-900 mb-2">Enseignes TV (Fnac, Darty, Boulanger)</h5>
      <p class="text-sm text-gray-700">Demandez un test dalles + HDMI en magasin et un <strong>compte-rendu écrit</strong>.</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <h5 class="font-bold text-gray-900 mb-2">E-commerce & marketplaces</h5>
      <p class="text-sm text-gray-700">Tracez par écrit (messagerie vendeur), rappelez la prise en charge intégrale (L.217-11).</p>
    </div>
  </div>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Marquage OLED : couvert ?',
        answer:
          'Oui s’il empêche l’usage normal ou contredit les performances promises (L.217-5). Mise en conformité (L.217-9).',
      },
      {
        question: 'Le vendeur me renvoie vers la marque ?',
        answer: 'Interdit : la garantie légale lie le vendeur (L.217-3).',
      },
      { question: 'Frais d’envoi/transport ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Remboursement possible ?',
        answer: 'Si réparation/remplacement impossible ou échoue (L.217-13).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'videoprojecteur-panne-garantie-legale': {
    title: 'Vidéoprojecteur en panne : garantie légale 2025',
    subtitle: 'Focus/Keystone • Lampe/laser • HDMI/ARC • 2 ans vendeur',
    seo: {
      title: 'Vidéoprojecteur défectueux : recours 2025',
      description:
        'Focus, keystone, lampe/laser, HDMI instable : garantie légale. Obtenez réparation, remplacement ou remboursement. Lettre en 3 minutes.',
      keywords: [
        'videoprojecteur garantie légale',
        'focus flou keystone défaut',
        'lampe laser panne projo',
        'hdmi arc instable projecteur',
        'L.217-9 réparation projecteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure projecteur',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts côté image & connectique',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="space-y-4 sm:space-y-6">
    <div class="bg-purple-50 border-l-4 border-purple-400 p-4 sm:p-6 rounded-r-lg">
      <p class="text-purple-800 text-sm"><strong>Couvert :</strong> focus impossible à régler, keystone inopérant, lampe/laser chute anormale, HDMI/ARC instable, ventilateur bruyant.</p>
      <p class="text-purple-800 text-sm mt-2"><strong>Base :</strong> L.217-5 (usage attendu), L.217-7 (présomption).</p>
    </div>
  </div>
  <div class="bg-green-50 p-4 sm:p-6 rounded-lg mt-8">
    <p class="text-green-800 text-sm">Résolution amiable en ~70% des cas après rappel clair de L.217-9 et L.217-11.</p>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure étape par étape : obtenir réparation/remboursement',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 mb-6">
    <p class="text-blue-800"><strong>Interlocuteur :</strong> uniquement le vendeur (L.217-3). Choix initial : réparation ou remplacement (L.217-9).</p>
  </div>
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves (photos/fichiers test) + facture</li>
    <li>Demande de mise en conformité (L.217-9)</li>
    <li>Mise en demeure (L.217-3, L.217-7, L.217-11)</li>
    <li>Réduction du prix / remboursement (L.217-13)</li>
  </ol>
  <a href="/eligibilite" class="inline-flex mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Créer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Enseignes & astuces pratiques',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-2">
    <li>Demandez test en salle sombre avec mire de focus.</li>
    <li>Consignez l’autonomie lampe/laser relevée par l’OSD.</li>
  </ul>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Lampe qui chute vite : couvert ?',
        answer: 'Oui si anormal vs promesse/usage (L.217-5). Mise en conformité (L.217-9).',
      },
      { question: 'Frais de retour ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible ou échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'serveur-nas-panne-garantie-legale': {
    title: 'Serveur NAS en panne : garantie légale 2025',
    subtitle: 'Baie HS • Réseau instable • RAID • 2 ans vendeur',
    seo: {
      title: 'NAS défectueux : recours 2025',
      description:
        'Baies HS, réseau instable, RAID qui lâche : garantie légale. Exigez réparation, remplacement ou remboursement. Lettre conforme immédiate.',
      keywords: [
        'NAS garantie légale',
        'baie disque HS NAS',
        'réseau instable NAS défaut',
        'RAID reconstruit echec',
        'L.217-9 réparation NAS',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement NAS',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure NAS',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts NAS couverts par la garantie légale',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700">Baie/dock disque qui n’alimente plus, contrôleur RAID instable, ports Ethernet HS, ventilateurs très bruyants, UI inaccessible : L.217-5, L.217-7.</p>
  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-r-lg">
    <p class="text-sm text-yellow-800"><strong>Attention :</strong> la récupération de données n’est pas couverte par la garantie légale elle-même (c’est un service séparé).</p>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure pas à pas',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez réparation/remplacement (L.217-9). Tous frais à la charge du vendeur (L.217-11). Si échec : réduction/remboursement (L.217-13).</p>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Lettre conforme →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Distributeurs & bonnes pratiques',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Fournissez journaux système et numéros de séries baies/disques pour accélerer le traitement.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Baie disque inopérante : couvert ?',
        answer: 'Oui, défaut de conformité (L.217-5). Mise en conformité (L.217-9).',
      },
      {
        question: 'Frais de diagnostic ?',
        answer: 'À la charge du vendeur s’ils visent la mise en conformité (L.217-11).',
      },
      {
        question: 'Remboursement ?',
        answer: 'En cas d’impossibilité ou d’échec des autres recours (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption d’au moins 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'imprimante-defaut-garantie-legale': {
    title: 'Imprimante défectueuse : garantie légale 2025',
    subtitle: 'Têtes bouchées • Papier bloqué • Wi-Fi • 2 ans vendeur',
    seo: {
      title: 'Imprimante en panne : vos droits 2025',
      description:
        'Têtes bouchées, bourrages, Wi-Fi/USB HS : garantie légale. Exigez réparation, remplacement ou remboursement. Lettre en 3 minutes.',
      keywords: [
        'imprimante garantie légale',
        'bourrage papier défaut',
        'tetes impression bouchees',
        'wifi usb imprimante panne',
        'L.217-9 réparation imprimante',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure imprimante',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts imprimante couverts par la loi',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="grid sm:grid-cols-2 gap-4">
    <div class="bg-blue-50 p-4 rounded"><p class="text-sm text-blue-800">Bourrages répétés, entraînement papier HS, Wi-Fi/USB inopérant.</p></div>
    <div class="bg-green-50 p-4 rounded"><p class="text-sm text-green-800">Têtes bouchées malgré usage normal, cartouches non reconnues.</p></div>
  </div>
  <p class="mt-4 text-sm text-gray-700">Base : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure express en 4 étapes',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves + facture</li>
    <li>Demande de réparation/remplacement (L.217-9)</li>
    <li>Mise en demeure (L.217-3, L.217-7, L.217-11)</li>
    <li>Réduction du prix / remboursement (L.217-13)</li>
  </ol>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Générer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Conseils enseignes',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un test d’impression et l’édition d’un rapport écrit (pages de diagnostic).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Têtes bouchées : couvert ?',
        answer: 'Oui si usage normal et nettoyage inefficace. Mise en conformité (L.217-9).',
      },
      {
        question: 'Frais de cartouches test ?',
        answer: 'À la charge du vendeur si nécessaires à la mise en conformité (L.217-11).',
      },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible/échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'ecran-pc-pixels-morts-garantie-legale': {
    title: 'Écran PC : pixels morts/saignement — recours 2025',
    subtitle: 'Pixels morts • Fuites de lumière • Ports HS • 2 ans',
    seo: {
      title: 'Écran PC défectueux : garantie 2025',
      description:
        'Pixels morts, fuites de lumière, ports HS : garantie légale. Obtenez réparation, remplacement ou remboursement. Lettre conforme immédiate.',
      keywords: [
        'ecran pc garantie légale',
        'pixels morts moniteur',
        'fuite de lumière ips',
        'port displayport hdmi hs',
        'L.217-9 réparation moniteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure moniteur',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts sur moniteurs PC',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700">Pixels morts/taches, saignement de dalle, uniformité douteuse, ports HS, scintillement anormal : L.217-5, L.217-7.</p>
  <div class="bg-green-50 p-4 sm:p-6 rounded-lg mt-6">
    <p class="text-green-800 text-sm">Taux de réussite élevé avec preuve photo et rappel L.217-9/L.217-11.</p>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Itinéraire vers la mise en conformité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Contact vendeur → réparation/remplacement (L.217-9). Si échec : réduction/remboursement (L.217-13). Frais à sa charge (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Revendeurs IT : accélérer',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez un test mire et un rapport de pixels morts établi au comptoir.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Un pixel mort : couvert ?',
        answer:
          'Oui si usage normal affecté et/ou promesses non tenues (L.217-5). Mise en conformité (L.217-9).',
      },
      { question: 'Frais d’emballage/transport ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible ou échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'aspirateur-balai-panne-garantie-legale': {
    title: 'Aspirateur balai en panne : garantie légale 2025',
    subtitle: 'Batterie • Brosse • Moteur • 2 ans chez le vendeur',
    seo: {
      title: 'Aspirateur balai défectueux : recours',
      description:
        'Batterie chute, brosse/moteur HS, charge erratique : garantie légale. Réparation, remplacement ou remboursement. Lettre en 3 minutes.',
      keywords: [
        'aspirateur balai garantie légale',
        'batterie aspirateur chute',
        'brosse motorisée HS',
        'charge erratique aspirateur',
        'L.217-9 réparation aspirateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure aspirateur',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & preuves utiles',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-1">
    <li>• Autonomie anormalement faible</li>
    <li>• Moteur/bruit anormal, coupures</li>
    <li>• Brosse/embouts inopérants, charge capricieuse</li>
  </ul>
  <p class="mt-3 text-sm text-gray-700">Base : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure fiable',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Remplacement → Réduction/remboursement (L.217-13). Frais intégralement au vendeur (L.217-11).</p>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Lettre conforme →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasins : faire valoir vos droits',
        html: `
<div class="prose prose-lg max-w-none">
    <p class="text-sm text-gray-700">Demandez un test d’autonomie écrit et une prise en charge batteries/pièces.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Batterie qui chute : couvert ?',
        answer: 'Oui si anormal vs usage normal (L.217-5). Mise en conformité (L.217-9).',
      },
      { question: 'Frais de retour ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si mise en conformité échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'purificateur-air-defaut-garantie-legale': {
    title: 'Purificateur d’air défectueux : garantie légale 2025',
    subtitle: 'Capteurs • Débit CADR • Bruit • 2 ans vendeur',
    seo: {
      title: 'Purificateur d’air en panne : recours',
      description:
        'Capteurs faux, CADR insuffisant, bruit excessif : garantie légale. Réparation, remplacement ou remboursement. Lettre immédiate.',
      keywords: [
        'purificateur air garantie légale',
        'capteurs pm2.5 faux',
        'debit CADR insuffisant',
        'bruit excessif appareil',
        'L.217-9 réparation purificateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure purificateur',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & métriques utiles',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Capteurs PM2.5/TVOC incohérents, CADR très inférieur aux promesses, bruit/vibrations anormales, ventilateur HS : L.217-5, L.217-7.</p>
  <div class="bg-green-50 p-4 sm:p-6 rounded-lg mt-6">
    <p class="text-green-800 text-sm">Conservez captures (niveaux PM), vidéos du bruit, fiche produit (promesses).</p>
  </div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Démarches efficaces',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez réparation/remplacement (L.217-9). Frais à la charge du vendeur (L.217-11). Échec : réduction/remboursement (L.217-13).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Distributeurs/poseurs : cadrage',
        html: `
<div class="prose prose-lg max-w-none">
    <p class="text-sm text-gray-700">Demandez un test de débit écrit et la traçabilité des filtres livrés.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'CADR bien en dessous : couvert ?',
        answer: 'Oui si performances promises non tenues (L.217-5).',
      },
      {
        question: 'Frais de filtres test ?',
        answer: 'À la charge du vendeur s’ils sont nécessaires (L.217-11).',
      },
      {
        question: 'Remboursement ?',
        answer: 'Si mise en conformité impossible/échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'plaque-induction-defaut-garantie-legale': {
    title: 'Plaque induction défectueuse : garantie légale 2025',
    subtitle: 'Cartes • Détection • Erreurs • 2 ans vendeur',
    seo: {
      title: 'Plaque induction en panne : recours',
      description:
        'Détection casserole aléatoire, erreurs, carte HS : garantie légale. Réparation, remplacement ou remboursement. Lettre conforme.',
      keywords: [
        'plaque induction garantie légale',
        'détection casserole défaut',
        'carte électronique table induction',
        'erreur e0 e1 e2 plaque',
        'L.217-9 réparation plaque',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure plaque',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & sécurité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Détection aléatoire, zones inactives, cartes HS, erreurs récurrentes, ventilateurs bruyants : L.217-5, L.217-7. Mentionnez l’impact sur la cuisine quotidienne.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Obtenir la mise en conformité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation prioritaire (L.217-9). Si échec : remplacement. Dernier recours : remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Créer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Installateurs & magasins',
        html: `
<div class="prose prose-lg max-w-none">
    <p class="text-sm text-gray-700">Exigez un rapport d’erreurs et un test de toutes zones avec casserole compatible.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Détection aléatoire : couvert ?',
        answer: 'Oui si empêche l’usage normal (L.217-5). Mise en conformité (L.217-9).',
      },
      { question: 'Frais de déplacement ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si réparation/remplacement échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'four-encastrable-panne-garantie-legale': {
    title: 'Four encastrable en panne : garantie légale 2025',
    subtitle: 'Chauffe • Thermostat • Pyrolyse • 2 ans vendeur',
    seo: {
      title: 'Four défectueux : vos droits 2025',
      description:
        'Chauffe lente, thermostat faux, pyrolyse HS : garantie légale. Demandez réparation, remplacement ou remboursement.',
      keywords: [
        'four encastrable garantie légale',
        'thermostat four défaut',
        'pyrolyse ne marche pas',
        'chauffe lente four panne',
        'L.217-9 réparation four',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure four',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & preuves utiles',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Résistances HS, thermostat faux, ventilateur, pyrolyse inopérante, affichage/sonde HS : L.217-5, L.217-7. Photos/temps de chauffe comme preuves.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure claire',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation via vendeur (L.217-9). Si échec : remplacement/remboursement (L.217-13). Frais intégralement au vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Poseur/distributeur : accélérer',
        html: `
<div class="prose prose-lg max-w-none">
    <p class="text-sm text-gray-700">Demandez un contrôle de température écrit et un délai d’intervention “raisonnable”.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Pyrolyse HS : couvert ?',
        answer: 'Oui, défaut de conformité (L.217-5). Mise en conformité (L.217-9).',
      },
      {
        question: 'Frais de démontage/pose ?',
        answer: 'À la charge du vendeur si liés à la mise en conformité (L.217-11).',
      },
      { question: 'Remboursement ?', answer: 'Si mise en conformité échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois minimum (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'cafetiere-expresso-broyeur-defaut-garantie-legale': {
    title: 'Cafetière expresso broyeur : recours 2025',
    subtitle: 'Groupe café • Moulins • Fuites • 2 ans vendeur',
    seo: {
      title: 'Expresso broyeur défectueux : droits',
      description:
        'Groupe café/moulin HS, fuites, capteurs : garantie légale. Réparation, remplacement, remboursement. Lettre en 3 min.',
      keywords: [
        'cafetière expresso garantie légale',
        'broyeur café panne',
        'fuite expresso machine',
        'capteurs réservoir HS',
        'L.217-9 réparation expresso',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure expresso',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & entretien normal',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700 text-sm">Groupe qui bloque, broyeur HS, fuites, capteurs réservoir, chauffe instable : L.217-5, L.217-7. L’entretien normal (détartrage) ne supprime pas la garantie légale.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes légales',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez réparation/remplacement (L.217-9). Frais vendeur (L.217-11). Si échec : réduction/remboursement (L.217-13).</p>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Générer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Revendeurs : preuves efficaces',
        html: `
<div class="prose prose-lg max-w-none">
    <p class="text-sm text-gray-700">Joignez vidéos (débit, fuite), ticket d’erreur, relevé de cycles si disponible.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fuite interne : couvert ?',
        answer: 'Oui. Mise en conformité par le vendeur (L.217-9, L.217-11).',
      },
      {
        question: 'Entretien non fait = refus ?',
        answer:
          'Le vendeur doit prouver un mauvais usage pour exclure (L.217-7). Sinon, garantie légale s’applique.',
      },
      {
        question: 'Remboursement ?',
        answer: 'Si réparation/remplacement impossible/échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois au moins (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'borne-recharge-domestique-ve-defaut-garantie-legale': {
    title: 'Borne de recharge domestique VE : recours 2025',
    subtitle: 'Charge aléatoire • RFID • Disjonctions • 2 ans vendeur',
    seo: {
      title: 'Borne de recharge VE défectueuse',
      description:
        'Charge aléatoire, RFID/app HS, disjonctions : garantie légale. Réparation, remplacement ou remboursement. Lettre conforme en 3 minutes.',
      keywords: [
        'borne recharge VE garantie légale',
        'wallbox panne défaut',
        'rfid app charge voiture',
        'disjonction recharge domicile',
        'L.217-9 réparation borne',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement borne',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure borne',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & sécurité électrique',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700 text-sm">Charge aléatoire, pilotage RFID/app inopérant, câble/prise HS, disjonctions sans cause externe : L.217-5, L.217-7.</p>
  <div class="bg-red-50 border-l-4 border-red-400 p-4 mt-4"><p class="text-red-800 text-sm">Sécurité : mentionnez les disjonctions et l’immobilisation du véhicule.</p></div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Démarches côté consommateur',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez réparation/remplacement (L.217-9). Frais intégralement au vendeur (L.217-11). Si échec : remboursement (L.217-13).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Installateur/distributeur : bonnes pratiques',
        html: `
<div class="prose prose-lg max-w-none">
    <p class="text-sm text-gray-700">Demandez logs de charge et schéma d’installation. Délai “raisonnable” écrit.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Charge qui coupe : couvert ?',
        answer: 'Oui si usage normal est empêché (L.217-5). Mise en conformité (L.217-9).',
      },
      { question: 'Frais d’intervention ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Remboursement ?',
        answer: 'Si mise en conformité impossible/échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'serrure-connectee-defaut-garantie-legale': {
    title: 'Serrure connectée défectueuse : garantie légale 2025',
    subtitle: 'App/Bridge • Mécanique • Sécurité • 2 ans vendeur',
    seo: {
      title: 'Serrure connectée en panne : recours',
      description:
        'App/bridge instables, moteur bloqué, capteurs faux : garantie légale. Réparation, remplacement, remboursement. Lettre immédiate.',
      keywords: [
        'serrure connectée garantie légale',
        'bridge app instable serrure',
        'moteur serrure bloque',
        'capteurs porte faux',
        'L.217-9 réparation serrure',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure serrure',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & points sécurité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-gray-700 text-sm">Bridge/app instables, moteur/béquille bloqués, capteurs d’ouverture faux, autonomie anormalement faible : L.217-5, L.217-7.</p>
  <div class="bg-red-50 border-l-4 border-red-400 p-4 mt-4"><p class="text-red-800 text-sm">Mentionnez le risque de <strong>non-accès</strong> au logement pour prioriser l’intervention.</p></div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure en 4 étapes',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves + facture</li>
    <li>Réparation/remplacement (L.217-9) auprès du vendeur</li>
    <li>Mise en demeure (L.217-3, L.217-7, L.217-11)</li>
    <li>Remboursement si échec (L.217-13)</li>
  </ol>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasins domotique/DIY : accélérer',
        html: `
<div class="prose prose-lg max-w-none">
    <p class="text-sm text-gray-700">Joignez logs d’événements et captures de l’app. Demandez un délai “raisonnable” écrit.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Bridge instable : couvert ?',
        answer: 'Oui si usage normal affecté (L.217-5). Mise en conformité (L.217-9).',
      },
      { question: 'Qui paie les frais ?', answer: 'Le vendeur (L.217-11).' },
      {
        question: 'Remboursement direct ?',
        answer: 'Si réparation/remplacement impossible/échoue (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois au moins (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'console-portable-ecran-defectueux-garantie-legale': {
    title: 'Console portable écran défectueux : recours 2025',
    subtitle: 'Pixels morts • Drift joystick • Crashes • 2 ans de garantie légale',
    seo: {
      title: 'Console portable en panne : vos droits 2025',
      description:
        'Écran, joystick, surchauffe : faites valoir la garantie légale. Réparation, remplacement ou remboursement. Lettre prête en 3 minutes.',
      keywords: [
        'console portable écran défaut',
        'joystick drift garantie',
        'Switch OLED pixels morts recours',
        'Steam Deck panne réparation',
        'Asus ROG Ally crash garantie',
        'L.217-9 console remplacement',
        'vendeur responsable console',
        'présomption L.217-7 console',
        'frais vendeur L.217-11 console',
        'remboursement L.217-13 console',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts pour consoles portables',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="grid sm:grid-cols-2 gap-4">
    <div class="bg-purple-50 p-4 rounded">
      <p class="text-sm text-purple-800">Écran : pixels morts, taches, latence tactile, saignement de dalle.</p>
    </div>
    <div class="bg-orange-50 p-4 rounded">
      <p class="text-sm text-orange-800">Joysticks : drift, boutons inopérants • Surchauffe • Batterie anormale.</p>
    </div>
  </div>
  <p class="mt-4 text-sm text-gray-700">Base : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Itinéraire simple vers la solution',
        html: `
<div class="prose prose-lg max-w-none">
  <div class="bg-blue-50 p-4 rounded">
    <p class="text-sm text-blue-800">1) Prouvez • 2) Demandez réparation/remplacement (L.217-9) • 3) Mise en demeure • 4) Remboursement si échec (L.217-13). Frais vendeur (L.217-11).</p>
  </div>
  <a href="/eligibilite" class="inline-flex mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Lettre conforme →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Marques/enseignes : comment négocier',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez un échange immédiat si le défaut est visible (pixel mort out-of-box). Sinon, réparation prioritaire puis bascule remplacement.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Drift joystick : garanti ?',
        answer: 'Oui si cela empêche l’usage normal (L.217-5). Réparation/remplacement (L.217-9).',
      },
      {
        question: 'Défaut apparu à 18 mois ?',
        answer:
          'Toujours présumé (L.217-7). Le vendeur doit prouver l’usage inapproprié s’il conteste.',
      },
      {
        question: 'Remboursement ?',
        answer: 'Oui si la mise en conformité échoue/impossible (L.217-13).',
      },
      { question: 'Frais ?', answer: 'À la charge du vendeur (L.217-11).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'home-cinema-barre-de-son-panne-garantie-legale': {
    title: 'Home cinéma/Barre de son en panne : recours 2025',
    subtitle: 'Coupures • HDMI ARC • Caisson muet • 2 ans de garantie légale',
    seo: {
      title: 'Barre de son défectueuse : garantie légale',
      description:
        'HDMI ARC qui décroche, caisson muet ? Activez la garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'barre de son garantie légale',
        'home cinéma panne HDMI ARC',
        'caisson de basses muet',
        'SAV refuse garantie audio',
        'remplacement barre de son',
        'L.217-9 réparation audio',
        'L.217-11 frais vendeur audio',
        'présomption L.217-7 audio',
        'réduction prix L.217-13 audio',
        'vendeur responsable L.217-3',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts audio/vidéo couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-2">
    <li>• Coupures HDMI ARC/eARC, désynchronisation audio</li>
    <li>• Caisson sans appairage, grésillements, saturation basse</li>
    <li>• Perte de canaux, volume bloqué, télécommande inopérante</li>
  </ul>
  <p class="mt-3 text-sm text-gray-700">Fondements : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Du diagnostic à la solution',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Diagnostic écrit + demande réparation (L.217-9) → mise en demeure si besoin → remplacement/remboursement (L.217-13). Frais pris en charge (L.217-11).</p>
  <a href="/eligibilite" class="inline-flex mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Générer ma lettre →</a>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Conseils pratiques par enseigne',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Faites tester sur place (câble/port), consignez par écrit. Priorisez remplacement si panne intermittente difficile à reproduire.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'ARC qui décroche : garanti ?',
        answer:
          'Oui si cela empêche l’usage conforme (L.217-5). Réparation/remplacement (L.217-9).',
      },
      { question: 'Coût du transport ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Si plusieurs réparations échouent ?',
        answer: 'Bascule vers remplacement ou remboursement (L.217-13).',
      },
      { question: 'Délais ?', answer: '2 ans (neuf), 12 mois au moins (occasion) : L.217-7.' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────────────── ÉLECTROMÉNAGER ─────────────────── */

  'friteuse-electrique-panne-garantie-legale': {
    title: 'Friteuse électrique en panne : garantie légale 2025',
    subtitle: 'Résistance HS • Température instable • 2 ans vendeur',
    seo: {
      title: 'Friteuse défectueuse : vos droits 2025',
      description:
        'Température instable, panne de chauffe ? Garantie légale : réparation, remplacement ou remboursement. Lettre prête en quelques clics.',
      keywords: [
        'friteuse panne garantie',
        'température friteuse instable',
        'résistance friteuse HS',
        'SAV refuse friteuse',
        'remboursement friteuse',
        'L.217-9 réparation',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption L.217-7',
        'vendeur responsable L.217-3',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts friteuse couverts par la loi',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Chauffe inexistante, thermostat erratique, fuite d’huile, voyant inopérant, matériaux qui se déforment : couverts par L.217-5 et L.217-7.</p>
  <div class="bg-red-50 border-l-4 border-red-400 p-4 mt-4"><p class="text-red-800 text-sm">Sécurité : si risque de brûlure/feu, exigez une solution rapide (mise en demeure).</p></div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Obtenir la mise en conformité',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves (photos/vidéos + facture)</li>
    <li>Réparation demandée (L.217-9)</li>
    <li>Mise en demeure (rappel L.217-3, L.217-7, L.217-11)</li>
    <li>Remplacement ou remboursement (L.217-13)</li>
  </ol>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Points de vente : stratégie',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Pour un appareil gras/odorant, demandez un <strong>bon de dépôt</strong> et la prise en charge du transport (L.217-11).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fuite d’huile : couvert ?',
        answer: 'Oui, défaut de conformité. Réparation/remplacement (L.217-9).',
      },
      {
        question: 'Défaut à 20 mois ?',
        answer: 'Toujours présumé (L.217-7) pour un produit neuf.',
      },
      { question: 'Frais d’envoi ?', answer: 'À la charge du vendeur (L.217-11).' },
      {
        question: 'Remboursement ?',
        answer: 'Si mise en conformité impossible/échoue : L.217-13.',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'mixeur-blender-panne-garantie-legale': {
    title: 'Mixeur/Blender en panne : garantie légale 2025',
    subtitle: 'Moteur brûle • Lames bloquées • 2 ans de protection',
    seo: {
      title: 'Blender défectueux : vos droits 2025',
      description:
        'Moteur qui chauffe, lames bloquées ? Garantie légale : réparation, remplacement ou remboursement. Lettre conforme immédiate.',
      keywords: [
        'blender panne garantie',
        'mixeur moteur brûle',
        'lames bloquées blender',
        'SAV refuse garantie blender',
        'L.217-9 remplacement blender',
        'vendeur responsable blender',
        'présomption L.217-7 blender',
        'frais vendeur L.217-11 blender',
        'réduction prix L.217-13 blender',
        'mise en demeure blender',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts fréquents & couverture',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-1">
    <li>• Moteur qui s’arrête sous faible charge</li>
    <li>• Joints qui fuient/odeurs de brûlé</li>
    <li>• Vitesses inopérantes, boîtier fissuré</li>
  </ul>
  <p class="mt-3 text-sm text-gray-700">Couvert : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Chemin rapide vers la solution',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez d’abord la réparation (L.217-9) • Si échec → remplacement • En dernier recours → réduction/ remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Enseignes : conseils',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Apportez un test écrit (mix de glace/eau). L’intermittence n’exclut pas la garantie si l’usage normal est empêché.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fuite au joint : garanti ?',
        answer: 'Oui. Mise en conformité à la charge du vendeur (L.217-11).',
      },
      {
        question: 'Preuves utiles ?',
        answer: 'Vidéo en usage normal, facture, page produit (performances promises).',
      },
      {
        question: 'Remboursement possible ?',
        answer: 'Oui si échec des autres solutions (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption au moins 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'extracteur-de-jus-panne-garantie-legale': {
    title: 'Extracteur de jus en panne : garantie légale 2025',
    subtitle: 'Moteur, vis sans fin, fuites • Recours légaux simples',
    seo: {
      title: 'Extracteur de jus défectueux : recours',
      description:
        'Fuites, bourrages, moteur instable ? Garantie légale : réparation, remplacement, remboursement. Lettre en 3 minutes.',
      keywords: [
        'extracteur de jus panne',
        'fuite extracteur garantie',
        'moteur extracteur défaut',
        'SAV refuse extracteur',
        'L.217-9 réparation extracteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption L.217-7',
        'vendeur responsable L.217-3',
        'mise en demeure extracteur',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & bases légales',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Fuites, craquements mécaniques, blocage de la vis, moteur irrégulier, plastique qui blanchit prématurément : couverts (L.217-5, L.217-7).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure pas à pas',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves</li>
    <li>Demande de réparation (L.217-9)</li>
    <li>Mise en demeure (L.217-3, L.217-7, L.217-11)</li>
    <li>Réduction/remboursement (L.217-13)</li>
  </ol>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Vendeur : comment cadrer',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Précisez l’usage normal (fruits/légumes standards). Refusez la facturation de diagnostic (L.217-11).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Bourrages récurrents : couvert ?',
        answer: 'Oui s’ils empêchent l’usage normal (L.217-5).',
      },
      { question: 'Diagnostic payant ?', answer: 'Non, à la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Possible si mise en conformité échoue (L.217-13).' },
      { question: 'Délais ?', answer: '2 ans (neuf) / 12 mois mini (occasion) : L.217-7.' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'yaourtiere-defaut-temperature-garantie-legale': {
    title: 'Yaourtière défectueuse : garantie légale 2025',
    subtitle: 'Température instable • Pannes répétées • Vos droits',
    seo: {
      title: 'Yaourtière en panne : recours',
      description:
        'Température instable ou panne ? Faites valoir la garantie légale : réparation, remplacement, remboursement. Lettre conforme immédiate.',
      keywords: [
        'yaourtière panne garantie',
        'température yaourtière défaut',
        'SAV refuse yaourtière',
        'vendeur responsable L.217-3',
        'L.217-9 réparation',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption L.217-7',
        'mise en demeure yaourtière',
        'recours garantie yaourtière',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts courants & couverture',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Température fluctuante, cycles incomplets, minuterie erratique, cuve qui fissure : couverts (L.217-5, L.217-7).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes rapides',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation prioritaire (L.217-9) → Mise en demeure → Remplacement ou remboursement (L.217-13). Frais à la charge du vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'À dire au vendeur',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Précisez l’échec de recettes standard. Demandez un délai raisonnable et écrit d’intervention.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Cuve fissurée : couvert ?',
        answer: 'Oui si usage normal. Réparation/remplacement (L.217-9).',
      },
      { question: 'Frais de retour ?', answer: 'Vendeur (L.217-11).' },
      {
        question: 'Remboursement ?',
        answer: 'Si impossible ou échec de mise en conformité (L.217-13).',
      },
      { question: 'Occasion ?', answer: 'Présomption au moins 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'machine-a-pain-panne-garantie-legale': {
    title: 'Machine à pain en panne : garantie légale 2025',
    subtitle: 'Pétrin bloqué • Résistance HS • 2 ans de protection',
    seo: {
      title: 'Machine à pain défectueuse : recours',
      description:
        'Pétrin bloqué, cuisson inégale ? Garantie légale : réparation, remplacement, remboursement. Lettre en quelques clics.',
      keywords: [
        'machine à pain panne garantie',
        'pétrin bloqué défaut',
        'cuisson inégale machine à pain',
        'SAV refuse machine à pain',
        'L.217-9 réparation machine à pain',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure machine à pain',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & preuves utiles',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-1">
    <li>• Pétrin qui ne tourne plus</li>
    <li>• Cuisson incomplète/température instable</li>
    <li>• Fuites, joints HS, fumées anormales</li>
  </ul>
  <p class="mt-3 text-sm text-gray-700">Base : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure fiable',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation → Remplacement → Réduction/remboursement (L.217-13). Toujours via le vendeur (L.217-3), frais à sa charge (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Enseignes : faire valoir vos droits',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez le <strong>bon de dépôt</strong> et l’estimation écrite du délai “raisonnable”.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Cuisson incomplète : garanti ?',
        answer: 'Oui. Demandez réparation puis remplacement (L.217-9).',
      },
      {
        question: 'Délais de prise en charge ?',
        answer:
          'Dans un délai raisonnable ; au-delà, basculez vers remplacement/ remboursement (L.217-13).',
      },
      { question: 'Frais ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Occasion ?', answer: 'Présomption au moins 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'centrale-vapeur-fuite-panne-garantie-legale': {
    title: 'Centrale vapeur en panne : garantie légale 2025',
    subtitle: 'Fuites • Vapeur faible • Arrêts • 2 ans vendeur',
    seo: {
      title: 'Centrale vapeur défectueuse : recours',
      description:
        'Fuite, vapeur faible, arrêt intempestif : garantie légale. Réparation, remplacement ou remboursement. Lettre en 3 minutes.',
      keywords: [
        'centrale vapeur panne garantie',
        'fuite centrale vapeur',
        'vapeur faible réparation',
        'SAV refuse centrale vapeur',
        'L.217-9 remplacement centrale',
        'L.217-7 présomption centrale',
        'L.217-11 frais vendeur centrale',
        'L.217-13 remboursement centrale',
        'vendeur responsable L.217-3',
        'mise en demeure centrale',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts & sécurité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Fuite réservoir, vapeur insuffisante, pression instable, semelle défaillante : couverts (L.217-5, L.217-7). En cas de risque brûlure, exigez une action rapide.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes pour obtenir la mise en conformité',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demande de réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasin / en ligne : nos conseils',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un écrit du diagnostic, refusez tout devis “d’usage” : la garantie légale est gratuite pour le consommateur.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fuite réservoir : couvert ?',
        answer: 'Oui. Réparation/remplacement (L.217-9).',
      },
      { question: 'Frais d’envoi ?', answer: 'Vendeur (L.217-11).' },
      {
        question: 'Remboursement ?',
        answer: 'Si impossible/échec de mise en conformité (L.217-13).',
      },
      { question: 'Délais ?', answer: '2 ans (neuf) / 12 mois mini (occasion) : L.217-7.' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────────────── AUTOMOBILE SPÉCIALISÉ ─────────────────── */

  'voiture-electrique-defaut-garantie-legale': {
    title: 'Voiture électrique : garantie légale (produit vendu) 2025',
    subtitle: 'Batterie/charge • Électronique • 2 ans vendeur (hors garantie commerciale)',
    seo: {
      title: 'Voiture électrique vendue : vos recours',
      description:
        'Problème de charge, électronique embarquée, défaut de conformité sur VE vendu par pro ? Garantie légale : réparation, remplacement, remboursement.',
      keywords: [
        'voiture électrique garantie légale',
        'défaut charge VE recours',
        'électronique voiture électrique panne',
        'vendeur responsable L.217-3 VE',
        'L.217-9 réparation VE',
        'L.217-11 frais vendeur VE',
        'L.217-13 remboursement VE',
        'L.217-7 présomption VE',
        'mise en demeure VE',
        'véhicule occasion présomption 12 mois',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts VE couverts (hors garanties commerciales)',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Charge aléatoire, autonomie anormalement basse vs promesse, BMS/électronique défaillants, interfaces qui plantent : couverts si usage normal empêché (L.217-5, L.217-7).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Parcours légal côté consommateur',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Signalement au vendeur (L.217-9) + diagnostic écrit</li>
    <li>Mise en demeure avec délai raisonnable</li>
    <li>Si échec : remplacement ou remboursement (L.217-13)</li>
    <li>Frais de transport/diagnostic : vendeur (L.217-11)</li>
  </ol>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Concession/mandataire : bonnes pratiques',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Faites préciser par écrit les performances promises (autonomie/charge). Exigez un prêt de véhicule si immobilisation longue (bonne pratique commerciale).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Autonomie inférieure aux promesses : couvert ?',
        answer:
          'Oui si l’usage normal est affecté par rapport aux caractéristiques promises (L.217-5).',
      },
      { question: 'Occasion VE ?', answer: 'Présomption de défaut au moins 12 mois (L.217-7).' },
      {
        question: 'Frais de remorquage/diagnostic ?',
        answer: 'À la charge du vendeur si liés à la mise en conformité (L.217-11).',
      },
      {
        question: 'Remboursement ?',
        answer: 'Possible si mise en conformité impossible/échec (L.217-13).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'voiture-hybride-defaut-garantie-legale': {
    title: 'Voiture hybride : garantie légale (produit vendu) 2025',
    subtitle: 'Hybride/électronique • 2 ans vendeur • 4 recours légaux',
    seo: {
      title: 'Voiture hybride vendue : vos droits',
      description:
        'Défaut hybride/électronique après achat chez pro ? Garantie légale : réparation, remplacement, réduction du prix, remboursement.',
      keywords: [
        'voiture hybride garantie légale',
        'défaut système hybride',
        'électronique hybride panne',
        'L.217-9 réparation hybride',
        'L.217-11 frais vendeur véhicule',
        'L.217-13 remboursement hybride',
        'L.217-7 présomption véhicule',
        'vendeur responsable L.217-3 auto',
        'mise en demeure hybride',
        'véhicule occasion garantie légale',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts côté hybride/électronique',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Bascule thermique/électrique erratique, surconsommation vs promesse, calculateurs qui plantent, voyants défaut persistants : couverts (L.217-5, L.217-7).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes légales clés',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demande de réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Frais liés = vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Concessions : faire valoir la loi',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez l’historique d’entretien et les rapports OBD joints au dossier. Gardez tout par écrit.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Surconsommation anormale : couverte ?',
        answer: 'Oui si écart significatif vs usage attendu/promesse (L.217-5).',
      },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
      { question: 'Frais ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si échec de mise en conformité (L.217-13).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'camping-car-defauts-garantie-legale': {
    title: 'Camping-car : garantie légale (produit vendu) 2025',
    subtitle: 'Étanchéité • Équipements • Électronique • 2 ans vendeur',
    seo: {
      title: 'Camping-car défectueux : recours',
      description:
        'Infiltrations, équipements HS ? Garantie légale : réparation, remplacement, remboursement. Dossier clair + lettre conforme.',
      keywords: [
        'camping-car garantie légale',
        'infiltration eau camping-car',
        'équipements HS camping-car',
        'électronique camping-car défaut',
        'L.217-9 réparation camping-car',
        'L.217-11 frais vendeur camping-car',
        'L.217-13 remboursement camping-car',
        'L.217-7 présomption camping-car',
        'vendeur responsable L.217-3',
        'mise en demeure camping-car',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts typiques couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-1">
    <li>• Infiltrations/étanchéité</li>
    <li>• Chauffage/eau/chauffe-eau HS</li>
    <li>• Électricité auxiliaire défaillante</li>
  </ul>
  <p class="mt-2 text-sm text-gray-700">Base : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Parcours gagnant',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation prioritaire (L.217-9). En cas d’immobilisation longue, demandez remplacement raisonnable. Si échec : remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Concessions : cadrage pratique',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un test d’étanchéité certifié et un plan d’action écrit (délais + pièces).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Infiltration eau : couvert ?',
        answer: 'Oui (L.217-5). Réparation puis remplacement/remboursement (L.217-13) si échec.',
      },
      { question: 'Frais ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
      {
        question: 'Délais ?',
        answer: 'Dans un délai raisonnable ; sinon on change de recours (L.217-9 → L.217-13).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'moto-defaut-garantie-legale': {
    title: 'Moto achetée chez pro : garantie légale 2025',
    subtitle: 'Électronique • Moteur • Freinage • 2 ans/12 mois',
    seo: {
      title: 'Moto vendue : vos droits',
      description:
        'Panne moteur, électronique, freinage ? Garantie légale : réparation, remplacement, remboursement. Lettre de mise en demeure rapide.',
      keywords: [
        'moto garantie légale',
        'panne moto vendeur responsable',
        'électronique moto défaut',
        'freinage moto problème',
        'L.217-9 réparation moto',
        'L.217-11 frais vendeur moto',
        'L.217-13 remboursement moto',
        'L.217-7 présomption moto',
        'vendeur responsable L.217-3',
        'mise en demeure moto',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts moto couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Démarrages aléatoires, voyants défaut, ABS/TC défaillant, surchauffe, coupures : couverts (L.217-5, L.217-7).</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'La méthode qui marche',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Mise en demeure → Remplacement ou remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Concession moto : tips',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez le rapport diagnostic branché (codes défaut) joint au dossier.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Voyant moteur : couvert ?',
        answer: 'Oui si usage normal impacté (L.217-5). Réparation/remplacement (L.217-9).',
      },
      {
        question: 'Occasion 11 mois ?',
        answer: 'Présomption valable (au moins 12 mois : L.217-7).',
      },
      {
        question: 'Frais essais/diagnostic ?',
        answer: 'À la charge du vendeur s’ils visent la mise en conformité (L.217-11).',
      },
      { question: 'Remboursement ?', answer: 'Si échec mise en conformité (L.217-13).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'scooter-defaut-garantie-legale': {
    title: 'Scooter acheté chez pro : garantie légale 2025',
    subtitle: 'Allumage • Charge • Freinage • 2 ans/12 mois',
    seo: {
      title: 'Scooter défectueux : recours',
      description:
        'Pannes d’allumage/charge, freinage : garantie légale. Réparation, remplacement, remboursement. Lettre conforme en 3 minutes.',
      keywords: [
        'scooter garantie légale',
        'panne scooter vendeur',
        'charge scooter défaut',
        'freinage scooter problème',
        'L.217-9 réparation scooter',
        'L.217-11 frais vendeur scooter',
        'L.217-13 remboursement scooter',
        'L.217-7 présomption scooter',
        'vendeur responsable L.217-3',
        'mise en demeure scooter',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts sur scooters',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Allumage aléatoire, batterie/chargeur défaillants, freinage spongieux, électronique instable : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure en 4 temps',
        html: `
<div class="prose prose-lg max-w-none">
  <ol class="list-decimal list-inside text-sm text-gray-800 space-y-2">
    <li>Preuves</li>
    <li>Réparation (L.217-9)</li>
    <li>Mise en demeure (L.217-3, L.217-7, L.217-11)</li>
    <li>Remplacement/remboursement (L.217-13)</li>
  </ol>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Concession : accélérer le traitement',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez un prêt de scooter si immobilisation prolongée (bonne pratique commerciale) et un délai écrit.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Charge impossible : couvert ?',
        answer: 'Oui. Mise en conformité exigible (L.217-9), frais vendeur (L.217-11).',
      },
      { question: 'Occasion 10 mois ?', answer: 'Présomption minimum 12 mois (L.217-7).' },
      { question: 'Remboursement ?', answer: 'Oui si échec mise en conformité (L.217-13).' },
      {
        question: 'Diagnostic payant ?',
        answer: 'À la charge du vendeur s’il sert la mise en conformité (L.217-11).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────────────── MAISON ─────────────────── */

  'climatisation-en-panne-garantie-legale': {
    title: 'Climatisation en panne : garantie légale 2025',
    subtitle: 'Fuite, panne compresseur, carte HS • 2 ans vendeur',
    seo: {
      title: 'Clim défectueuse : vos droits 2025',
      description:
        'Fuite, compresseur en panne, carte HS : garantie légale. Réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'climatisation panne garantie',
        'fuite clim recours',
        'compresseur HS clim',
        'carte électronique clim défaut',
        'L.217-9 réparation clim',
        'L.217-11 frais vendeur clim',
        'L.217-13 remboursement clim',
        'L.217-7 présomption clim',
        'vendeur responsable L.217-3',
        'mise en demeure clim',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts clim couverts par la loi',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Fuite fluide, compresseur/ventilo HS, carte électronique, performances de refroidissement insuffisantes vs promesse : L.217-5, L.217-7.</p>
  <div class="bg-red-50 border-l-4 border-red-400 p-4 mt-4"><p class="text-red-800 text-sm">Chaleur estivale = urgence. Exigez un délai raisonnable écrit.</p></div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Démarches efficaces',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation prioritaire (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Installateur/vendeur : cadrage',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un rapport d’intervention et la prise en charge du fluide et de la main-d’œuvre.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fuite de fluide : couvert ?',
        answer: 'Oui. Mise en conformité (L.217-9) à la charge du vendeur (L.217-11).',
      },
      {
        question: 'Remplacement unité extérieure ?',
        answer: 'Possible si réparation impossible/inefficace (L.217-13).',
      },
      { question: 'Délais ?', answer: 'Dans un délai raisonnable, surtout en période chaude.' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'vmc-habitation-panne-garantie-legale': {
    title: 'VMC habitation en panne : garantie légale 2025',
    subtitle: 'Moteur bruyant • Débit insuffisant • 2 ans vendeur',
    seo: {
      title: 'VMC défectueuse : recours',
      description:
        'VMC bruyante, débit insuffisant ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme immédiate.',
      keywords: [
        'VMC panne garantie',
        'moteur VMC bruyant',
        'débit VMC insuffisant',
        'vendeur responsable L.217-3 VMC',
        'L.217-9 réparation VMC',
        'L.217-11 frais vendeur VMC',
        'L.217-13 remboursement VMC',
        'L.217-7 présomption VMC',
        'mise en demeure VMC',
        'VMC défaut conformité',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts VMC couverts & preuves',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Bruit anormal, pannes, débit très inférieur aux caractéristiques promises : L.217-5, L.217-7. Preuves : mesures simples/vidéos.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes légales',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Distributeur/poseur : comment agir',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez un contrôle de débit écrit. Refusez les frais de déplacement (L.217-11).</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Bruit excessif : couvert ?',
        answer: 'Oui si usage normal affecté. Mise en conformité (L.217-9).',
      },
      { question: 'Frais ?', answer: 'À charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si mise en conformité échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'chaudiere-domestique-defaut-garantie-legale': {
    title: 'Chaudière domestique : garantie légale 2025',
    subtitle: 'Pannes récurrentes • Carte/Allumage • 2 ans vendeur',
    seo: {
      title: 'Chaudière en panne : vos droits',
      description:
        'Allumage, carte, fuites ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'chaudière panne garantie',
        'carte chaudière HS',
        'allumage chaudière défaut',
        'fuite chaudière recours',
        'L.217-9 réparation chaudière',
        'L.217-11 frais vendeur chaudière',
        'L.217-13 remboursement chaudière',
        'L.217-7 présomption chaudière',
        'vendeur responsable L.217-3',
        'mise en demeure chaudière',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts chaudière couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Allumage aléatoire, carte électronique, fuites, pression instable, impossibilité d’atteindre la température : L.217-5, L.217-7.</p>
  <div class="bg-red-50 border-l-4 border-red-400 p-4 mt-4"><p class="text-red-800 text-sm">Urgence sanitaire : exigez un délai raisonnable réduit.</p></div>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Démarches priorisées',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Installateur/vendeur : points clés',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez un procès-verbal d’intervention et la planification écrite.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Panne récurrente : couvert ?',
        answer:
          'Oui. Après échecs de réparation, basculez vers remplacement/remboursement (L.217-13).',
      },
      { question: 'Frais de déplacement ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
      {
        question: 'Délais ?',
        answer: 'Délai raisonnable selon contexte (période froide = priorité).',
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'pompe-a-chaleur-defaut-garantie-legale': {
    title: 'Pompe à chaleur : garantie légale 2025',
    subtitle: 'COP faible • Pannes électroniques • 2 ans vendeur',
    seo: {
      title: 'PAC défectueuse : vos recours',
      description:
        'COP faible, pannes électroniques ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'pompe à chaleur garantie légale',
        'COP faible recours PAC',
        'panne électronique PAC',
        'fuite fluide PAC',
        'L.217-9 réparation PAC',
        'L.217-11 frais vendeur PAC',
        'L.217-13 remboursement PAC',
        'L.217-7 présomption PAC',
        'vendeur responsable L.217-3',
        'mise en demeure PAC',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts PAC couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">COP très inférieur aux caractéristiques promises, fuites, cartes HS, bruit anormal : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Parcours clair',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Poseur/distributeur : cadrage',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez relevés de performance écrits et plan d’action avec délai.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'COP très bas : couvert ?',
        answer: 'Oui si usage/performances promis non atteints (L.217-5).',
      },
      { question: 'Frais ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si mise en conformité échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois mini (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'alarme-maison-defaut-garantie-legale': {
    title: 'Alarme maison défectueuse : garantie légale 2025',
    subtitle: 'Faux positifs • Sirène muette • 2 ans vendeur',
    seo: {
      title: 'Alarme défectueuse : vos droits',
      description:
        'Faux positifs, sirène muette, capteurs instables ? Garantie légale : réparation, remplacement, remboursement.',
      keywords: [
        'alarme maison garantie légale',
        'faux positifs alarme',
        'sirène muette défaut',
        'capteurs alarme instables',
        'L.217-9 réparation alarme',
        'L.217-11 frais vendeur alarme',
        'L.217-13 remboursement alarme',
        'L.217-7 présomption alarme',
        'vendeur responsable L.217-3',
        'mise en demeure alarme',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts sur systèmes d’alarme',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Détections fantômes, capteurs défaillants, sirène inopérante, centrale instable : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes légales',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Vendeur/poseur : bonnes pratiques',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez un test complet écrit (capteurs/sirène) et paramétrage documenté.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      { question: 'Faux positifs : couverts ?', answer: 'Oui si usage normal empêché (L.217-5).' },
      { question: 'Frais ?', answer: 'À charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si échec mise en conformité (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'domotique-passerelle-capteurs-garantie-legale': {
    title: 'Domotique (passerelle/capteurs) : garantie légale 2025',
    subtitle: 'Déconnexions • Automations HS • 2 ans vendeur',
    seo: {
      title: 'Domotique défectueuse : recours',
      description:
        'Passerelle/capteurs qui se déconnectent, automations HS ? Garantie légale : réparation, remplacement, remboursement.',
      keywords: [
        'domotique garantie légale',
        'passerelle domotique panne',
        'capteurs déconnexion',
        'automations HS défaut',
        'L.217-9 réparation domotique',
        'L.217-11 frais vendeur domotique',
        'L.217-13 remboursement domotique',
        'L.217-7 présomption domotique',
        'vendeur responsable L.217-3',
        'mise en demeure domotique',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts domotique couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Pertes de liaison, capteurs fantômes, scénarios non exécutés, application inopérante : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Marche à suivre',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation prioritaire (L.217-9). Si échec : remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Distributeur : accélérer la prise en charge',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Capturez des journaux d’événements (logs) et joignez-les à la demande.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Capteurs qui décrochent : couverts ?',
        answer: 'Oui si l’usage normal est affecté (L.217-5).',
      },
      { question: 'Frais de remplacement ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si mise en conformité impossible/échec (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  /* ─────────────────── SPORT (EXTRA) ─────────────────── */

  'velo-electrique-defaut-garantie-legale': {
    title: 'Vélo électrique défectueux : garantie légale 2025',
    subtitle: 'Batterie/moteur • Freinage • Électronique • 2 ans vendeur',
    seo: {
      title: 'VAE en panne : vos droits 2025',
      description:
        'Batterie/moteur, contrôleur, freins : garantie légale. Réparation, remplacement, remboursement. Lettre immédiate.',
      keywords: [
        'vélo électrique garantie légale',
        'batterie VAE panne',
        'moteur VAE défaut',
        'contrôleur VAE HS',
        'freinage VAE problème',
        'L.217-9 réparation VAE',
        'L.217-11 frais vendeur VAE',
        'L.217-13 remboursement VAE',
        'L.217-7 présomption VAE',
        'vendeur responsable L.217-3',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts VAE couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Batterie qui chute, moteur bruyant, contrôleur/afficheur HS, câblage défectueux, freins inefficaces : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure claire',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation via vendeur (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasin vélos : tips',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Relevés batterie (cycles, tension) et preuve d’usage normal. Exigez un vélo de courtoisie si immobilisation.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Autonomie en chute libre : couvert ?',
        answer: 'Oui si anormale vs usage normal/promesse (L.217-5).',
      },
      { question: 'Frais atelier ?', answer: 'À charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Oui si échec de mise en conformité (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'trottinette-electrique-defaut-garantie-legale': {
    title: 'Trottinette électrique : garantie légale 2025',
    subtitle: 'Batterie, contrôleur, freinage • 2 ans vendeur',
    seo: {
      title: 'Trottinette en panne : vos droits',
      description:
        'Batterie/contrôleur/freins défectueux ? Garantie légale : réparation, remplacement, remboursement. Lettre prête en 3 min.',
      keywords: [
        'trottinette garantie légale',
        'batterie trottinette panne',
        'contrôleur trottinette HS',
        'frein trottinette défaut',
        'L.217-9 réparation trottinette',
        'L.217-11 frais vendeur trottinette',
        'L.217-13 remboursement trottinette',
        'L.217-7 présomption trottinette',
        'vendeur responsable L.217-3',
        'mise en demeure trottinette',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts sur trottinettes',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Batterie qui ne tient pas, contrôleur/écran HS, freinage inefficace, jeu dans la colonne : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes légales',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Boutiques : comment procéder',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Exigez un procès-verbal d’essais routiers et la traçabilité des pièces posées.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      { question: 'Batterie HS : couverte ?', answer: 'Oui si anormal vs usage normal (L.217-5).' },
      { question: 'Frais ?', answer: 'Vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si échec mise en conformité (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'equipement-fitness-maison-garantie-legale': {
    title: 'Équipement fitness maison : garantie légale 2025',
    subtitle: 'Tapis vélo rameur • Bruits • Électronique • 2 ans',
    seo: {
      title: 'Matériel fitness défectueux : recours',
      description:
        'Bruits, électronique, résistance HS : garantie légale. Réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'tapis de course garantie légale',
        'rameur panne électronique',
        'vélo d’appartement défaut',
        'L.217-9 réparation fitness',
        'L.217-11 frais vendeur fitness',
        'L.217-13 remboursement fitness',
        'L.217-7 présomption fitness',
        'vendeur responsable L.217-3',
        'mise en demeure fitness',
        'matériel sport défectueux',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts couverts (tapis/vélo/rameur)',
        html: `
<div class="prose prose-lg max-w-none">
  <ul class="text-sm text-gray-700 space-y-1">
    <li>• Bruits/jeu anormal, courroie qui patine</li>
    <li>• Électronique/console HS, capteurs faux</li>
    <li>• Résistance inopérante, structure qui fissure</li>
  </ul>
  <p class="mt-2 text-sm text-gray-700">Base : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Procédure orientée résultat',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-13). Frais vendeurs (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasin/marketplace : agir vite',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Joignez vidéos des bruits, demandez essai technique ou échange immédiat en cas de défaut évident.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Console HS : couverte ?',
        answer: 'Oui, défaut de conformité (L.217-5). Réparation/remplacement (L.217-9).',
      },
      { question: 'Frais de transport ?', answer: 'À la charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si mise en conformité échoue (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'ski-equipement-defaut-garantie-legale': {
    title: 'Ski & équipements défectueux : garantie légale 2025',
    subtitle: 'Fixations, chaussures, peaux • 2 ans vendeur',
    seo: {
      title: 'Ski défectueux : vos recours',
      description:
        'Fixations/chaussures/peaux : casse, défauts ? Garantie légale. Réparation, remplacement, remboursement.',
      keywords: [
        'ski garantie légale',
        'fixations ski défaut',
        'chaussures ski casse',
        'peaux de phoque défaut',
        'L.217-9 réparation ski',
        'L.217-11 frais vendeur ski',
        'L.217-13 remboursement ski',
        'L.217-7 présomption ski',
        'vendeur responsable L.217-3',
        'mise en demeure ski',
      ],
    },
    sections: [
      {
        id: 'defauts-couverts',
        title: 'Défauts ski couverts',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Fixations qui déclenchent mal, chaussures qui fissurent anormalement, peaux qui se décollent : L.217-5, L.217-7.</p>
</div>
      `,
      },
      {
        id: 'procedure-recours',
        title: 'Étapes légales',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-13). Frais : vendeur (L.217-11).</p>
</div>
      `,
      },
      {
        id: 'vendeurs-strategies',
        title: 'Magasin sport : accélérer',
        html: `
<div class="prose prose-lg max-w-none">
  <p class="text-sm text-gray-700">Demandez test en atelier et attestation écrite de non-conformité.</p>
</div>
      `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: 'Fixations qui déclenchent trop tôt : couvert ?',
        answer: 'Oui si usage normal affecté (L.217-5). Mise en conformité (L.217-9).',
      },
      { question: 'Frais atelier ?', answer: 'À charge du vendeur (L.217-11).' },
      { question: 'Remboursement ?', answer: 'Si échec mise en conformité (L.217-13).' },
      { question: 'Occasion ?', answer: 'Présomption 12 mois (L.217-7).' },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },

  'electromenager-lave-linge-lave-vaisselle-garantie': {
    title: 'Électroménager en panne : garantie légale et remboursement (2025)',
    subtitle:
      'Lave-linge, lave-vaisselle, frigo, four • 2 ans de protection • Réparation gratuite ou remboursement',
    seo: {
      title: 'Électroménager en panne : vos droits, réparation gratuite et remboursement',
      description:
        'Lave-linge qui fuit, frigo HS, four défectueux ? Découvrez vos recours : réparation gratuite, remplacement ou remboursement intégral sous 2 ans.',
      keywords: [
        'électroménager en panne garantie',
        'lave-linge fuit réparation gratuite',
        'frigo ne refroidit plus SAV',
        'four défectueux remboursement',
        'lave-vaisselle ne lave plus',
        'garantie légale électroménager',
        'Darty Boulanger recours',
        'mise en demeure électroménager',
        'SAV refuse réparation gratuite',
        'remboursement gros électroménager',
      ],
    },
    sections: [
      {
        id: 'pannes-courantes',
        title: "Les 15 pannes d'électroménager les plus fréquentes et vos recours",
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Votre électroménager vous lâche ? Pas de panique ! La <strong>garantie légale de 2 ans</strong> vous protège automatiquement. Découvrez si votre panne est couverte et comment obtenir réparation gratuite, remplacement ou remboursement.
            </p>

            <div class="space-y-4 sm:space-y-6">
              <!-- Lave-linge -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-blue-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">🧺</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-4">LAVE-LINGE : Top 5 des pannes couvertes</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-blue-800 mb-2">🚿 Problèmes de fuite</h5>
                        <ul class="space-y-1 text-sm text-blue-700">
                          <li>• Fuite par le joint de porte</li>
                          <li>• Eau qui sort par le tiroir à lessive</li>
                          <li>• Flaques sous la machine</li>
                          <li>• Tuyaux qui se détachent</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-blue-800 mb-2">⚙️ Dysfonctionnements mécaniques</h5>
                        <ul class="space-y-1 text-sm text-blue-700">
                          <li>• Tambour bloqué qui ne tourne plus</li>
                          <li>• Essorage défaillant ou bruyant</li>
                          <li>• Porte qui ne se ferme plus</li>
                          <li>• Pompe de vidange en panne</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-white p-4 rounded mt-4 border-l-4 border-blue-400">
                      <p class="text-sm text-blue-700">
                        <strong>💡 Cas réel :</strong> Lave-linge Bosch qui fuit après 8 mois → Darty a remplacé gratuitement sous 48h après mise en demeure citant L.217-9.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Réfrigérateur -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-green-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">❄️</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-green-900 mb-4">RÉFRIGÉRATEUR : Pannes critiques</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">🌡️ Problèmes de température</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Ne refroidit plus du tout</li>
                          <li>• Température instable</li>
                          <li>• Congélateur qui décongèle</li>
                          <li>• Givrage excessif</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">🔧 Défaillances techniques</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Compresseur bruyant ou HS</li>
                          <li>• Éclairage défaillant</li>
                          <li>• Thermostat déréglé</li>
                          <li>• Joint d'étanchéité défectueux</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-red-50 p-4 rounded mt-4 border-l-4 border-red-400">
                      <p class="text-sm text-red-700">
                        <strong>⚠️ Urgence :</strong> Un frigo qui ne refroidit plus = perte de denrées alimentaires. Vous pouvez réclamer des dommages-intérêts en plus de la réparation !
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lave-vaisselle -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-purple-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">🍽️</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-purple-900 mb-4">LAVE-VAISSELLE : Défauts récurrents</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-purple-800 mb-2">🧼 Lavage déficient</h5>
                        <ul class="space-y-1 text-sm text-purple-700">
                          <li>• Vaisselle qui reste sale</li>
                          <li>• Traces et résidus persistants</li>
                          <li>• Bras de lavage obstrués</li>
                          <li>• Pastilles qui ne se dissolvent pas</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-purple-800 mb-2">💧 Problèmes d'eau</h5>
                        <ul class="space-y-1 text-sm text-purple-700">
                          <li>• Ne se remplit plus d'eau</li>
                          <li>• Ne vidange pas complètement</li>
                          <li>• Fuite au niveau des joints</li>
                          <li>• Séchage inefficace</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded mt-4 border-l-4 border-yellow-400">
                      <p class="text-sm text-yellow-700">
                        <strong>💡 Astuce :</strong> Photographiez la vaisselle mal lavée avec la date. C'est votre preuve du défaut de conformité !
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Four et cuisson -->
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-orange-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">🔥</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-orange-900 mb-4">FOUR : Problèmes de cuisson</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-orange-800 mb-2">🌡️ Température défaillante</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• Ne chauffe plus du tout</li>
                          <li>• Température incorrecte/instable</li>
                          <li>• Préchauffage très long</li>
                          <li>• Chaleur tournante HS</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-orange-800 mb-2">⚡ Dysfonctionnements</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• Porte qui ne ferme pas bien</li>
                          <li>• Éclairage intérieur défaillant</li>
                          <li>• Programmateur en panne</li>
                          <li>• Grill qui ne fonctionne plus</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-red-900 mb-3">⚠️ Cas NON couverts par la garantie légale</h4>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 class="font-bold text-red-800 mb-2">❌ Exclusions absolues</h5>
                  <ul class="space-y-1 text-sm text-red-700">
                    <li>• Mauvais entretien (calcaire, saleté)</li>
                    <li>• Surtension/foudre</li>
                    <li>• Utilisation non conforme</li>
                    <li>• Pièces d'usure normale (joints, filtres)</li>
                  </ul>
                </div>
                <div>
                  <h5 class="font-bold text-orange-800 mb-2">⚖️ Cas litigieux</h5>
                  <ul class="space-y-1 text-sm text-orange-700">
                    <li>• Usure "prématurée" (à prouver)</li>
                    <li>• Problèmes d'installation</li>
                    <li>• Incompatibilité électrique</li>
                    <li>• Dommages transport</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'recours-strategiques',
        title: 'Stratégies de recours : comment obtenir gain de cause rapidement',
        html: `
          <div class="prose prose-lg max-w-none">
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 mb-6 sm:mb-8">
              <h4 class="text-base sm:text-lg font-bold text-blue-900 mb-2">🎯 La règle d'or de l'électroménager</h4>
              <p class="text-blue-800">
                Contrairement aux idées reçues, vous n'êtes <strong>jamais obligé d'accepter une réparation</strong>. Selon l'article L.217-9, vous pouvez directement demander le remplacement ou le remboursement si vous estimez que le produit n'est pas fiable.
              </p>
            </div>

            <div class="space-y-8">
              <!-- Option 1: Réparation -->
              <div class="bg-white border border-green-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">1</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-green-900 mb-3">🔧 OPTION 1 : Réparation gratuite</h4>
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                      <div class="bg-green-50 p-4 rounded">
                        <h5 class="font-bold text-green-800 mb-2">✅ Quand la choisir</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Panne ponctuelle et identifiable</li>
                          <li>• Appareil récent (< 6 mois)</li>
                          <li>• Réparateur compétent disponible</li>
                          <li>• Pièce disponible rapidement</li>
                        </ul>
                      </div>
                      <div class="bg-red-50 p-4 rounded">
                        <h5 class="font-bold text-red-800 mb-2">❌ Évitez si</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• 2e panne du même type</li>
                          <li>• Délai > 30 jours annoncé</li>
                          <li>• Coût réparation > 50% prix neuf</li>
                          <li>• Panne récurrente connue du modèle</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded border-l-4 border-yellow-400">
                      <p class="text-sm text-yellow-800">
                        <strong>⏰ Délai maximum :</strong> La réparation doit être effectuée dans un "délai raisonnable". En pratique : 15-30 jours selon la complexité. Au-delà, vous pouvez exiger le remplacement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Option 2: Remplacement -->
              <div class="bg-white border border-blue-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">2</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-3">🔄 OPTION 2 : Remplacement (RECOMMANDÉ)</h4>
                    <div class="bg-blue-50 p-4 rounded mb-4">
                      <h5 class="font-bold text-blue-800 mb-2">🎯 Pourquoi c'est souvent le meilleur choix</h5>
                      <ul class="space-y-2 text-blue-700 text-sm">
                        <li>• <strong>Appareil neuf</strong> avec nouvelle garantie de 2 ans</li>
                        <li>• <strong>Aucun risque</strong> de panne récurrente</li>
                        <li>• <strong>Souvent plus rapide</strong> que la réparation</li>
                        <li>• <strong>Modèle équivalent ou supérieur</strong> si stock épuisé</li>
                      </ul>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div class="bg-green-50 p-4 rounded">
                        <h5 class="font-bold text-green-800 mb-2">📋 Conditions d'obtention</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Invoquer L.217-9 du Code conso</li>
                          <li>• Justifier que réparation inadéquate</li>
                          <li>• Produit disponible en stock</li>
                          <li>• Dans les 2 ans après achat</li>
                        </ul>
                      </div>
                      <div class="bg-orange-50 p-4 rounded">
                        <h5 class="font-bold text-orange-800 mb-2">💡 Arguments juridiques efficaces</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• "Perte de confiance dans la fiabilité"</li>
                          <li>• "Risque de récidive inacceptable"</li>
                          <li>• "Besoin d'un appareil fiable au quotidien"</li>
                          <li>• "Coût réparation disproportionné"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Option 3: Remboursement -->
              <div class="bg-white border border-purple-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">3</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-purple-900 mb-3">💰 OPTION 3 : Remboursement intégral</h4>
                    <div class="bg-purple-50 p-4 rounded mb-4">
                      <h5 class="font-bold text-purple-800 mb-2">🎯 Situations où l'exiger</h5>
                      <ul class="space-y-2 text-purple-700 text-sm">
                        <li>• <strong>Réparation échouée</strong> après 2 tentatives</li>
                        <li>• <strong>Remplacement impossible</strong> (produit discontinué)</li>
                        <li>• <strong>Panne grave</strong> compromettant la sécurité</li>
                        <li>• <strong>Délais inacceptables</strong> (> 1 mois)</li>
                      </ul>
                    </div>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div class="bg-green-50 p-4 rounded">
                        <h5 class="font-bold text-green-800 mb-2">💶 Ce qui vous est dû</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Prix d'achat intégral</li>
                          <li>• Frais de livraison/installation</li>
                          <li>• TVA incluse</li>
                          <li>• Éventuels dommages-intérêts</li>
                        </ul>
                      </div>
                      <div class="bg-red-50 p-4 rounded">
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Attention aux pièges</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Refusez les avoirs/bons d'achat</li>
                          <li>• Exigez le remboursement en espèces</li>
                          <li>• Ne payez pas les frais de retour</li>
                          <li>• Gardez l'appareil jusqu'au remboursement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-gray-900 mb-4">📊 Efficacité des recours selon le type d'appareil</h4>
              <div class="grid md:grid-cols-3 gap-4 text-center">
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <div class="text-xl sm:text-2xl mb-2">🧺</div>
                  <div class="font-bold text-blue-600">Lave-linge</div>
                  <div class="text-sm text-gray-600">78% remplacement obtenu</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <div class="text-xl sm:text-2xl mb-2">❄️</div>
                  <div class="font-bold text-green-600">Réfrigérateur</div>
                  <div class="text-sm text-gray-600">65% remboursement</div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-sm">
                  <div class="text-xl sm:text-2xl mb-2">🍽️</div>
                  <div class="font-bold text-purple-600">Lave-vaisselle</div>
                  <div class="text-sm text-gray-600">71% réparation réussie</div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'vendeurs-strategies',
        title:
          'SAV par enseigne : Darty, Boulanger, Conforama, But... Qui est le plus conciliant ?',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Tous les vendeurs ne réagissent pas de la même façon face à vos réclamations. Découvrez les <strong>forces et faiblesses</strong> de chaque enseigne pour adapter votre stratégie :
            </p>

            <div class="space-y-4 sm:space-y-6">
              <!-- Darty -->
              <div class="bg-white border-l-4 border-red-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">🔴</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-red-900 mb-3">DARTY - "Le contrat de confiance"</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">✅ Points forts</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• SAV réputé réactif</li>
                          <li>• Réseau de réparateurs étendu</li>
                          <li>• Formation équipes sur garantie légale</li>
                          <li>• Souvent conciliant sur les remplacements</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Pièges à éviter</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Pousse vers les extensions de garantie</li>
                          <li>• Peut proposer du reconditionné</li>
                          <li>• Délais parfois optimistes</li>
                          <li>• Argumentation commerciale forte</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-red-50 p-4 rounded mt-4">
                      <p class="text-sm text-red-700">
                        <strong>💡 Stratégie Darty :</strong> Mentionnez le "contrat de confiance" et votre déception. Darty mise sur son image, ils sont souvent conciliants pour éviter les mauvais avis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Boulanger -->
              <div class="bg-white border-l-4 border-orange-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">🟠</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-orange-900 mb-3">BOULANGER - Approche technique</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">✅ Avantages</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Diagnostic technique précis</li>
                          <li>• Personnel souvent compétent</li>
                          <li>• Respect général des délais</li>
                          <li>• Bonne gestion des pièces détachées</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Difficultés</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Plus rigide sur les procédures</li>
                          <li>• Privilégie la réparation au remplacement</li>
                          <li>• Peut être tatillon sur les preuves</li>
                          <li>• Résistance sur les remboursements</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-orange-50 p-4 rounded mt-4">
                      <p class="text-sm text-orange-700">
                        <strong>💡 Stratégie Boulanger :</strong> Préparez un dossier technique solide. Ils respectent les arguments juridiques précis. Citez systématiquement les articles de loi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- E.Leclerc/Conforama/But -->
              <div class="bg-white border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">🔵</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-3">GRANDES SURFACES (Leclerc, Conforama, But)</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">✅ Facilités</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Prix souvent attractifs</li>
                          <li>• Proximité géographique</li>
                          <li>• Politique commerciale souple</li>
                          <li>• Évitent les conflits longs</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Limites</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Formation SAV parfois insuffisante</li>
                          <li>• Sous-traitance des réparations</li>
                          <li>• Qualité de service variable</li>
                          <li>• Tentent souvent les avoirs</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-blue-50 p-4 rounded mt-4">
                      <p class="text-sm text-blue-700">
                        <strong>💡 Stratégie GSS :</strong> Soyez patient mais ferme. Demandez à parler au responsable si l'employé ne connaît pas la garantie légale. Ils cèdent souvent pour éviter l'escalade.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- E-commerce -->
              <div class="bg-white border-l-4 border-purple-400 p-4 sm:p-6 rounded-lg shadow-sm">
                <div class="flex items-start">
                  <div class="mr-4">
                    <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span class="text-xl sm:text-2xl">🛒</span>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-purple-900 mb-3">E-COMMERCE (Amazon, Cdiscount, Fnac.com)</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">✅ Avantages</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Processus souvent automatisés</li>
                          <li>• Chat/email 24h/24</li>
                          <li>• Remboursements rapides</li>
                          <li>• Évitent les contentieux</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Défis</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Pas d'interlocuteur physique</li>
                          <li>• Réponses parfois standardisées</li>
                          <li>• Confusion marketplace/vendeur direct</li>
                          <li>• Frais de retour parfois réclamés</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-purple-50 p-4 rounded mt-4">
                      <p class="text-sm text-purple-700">
                        <strong>💡 Stratégie E-commerce :</strong> Privilégiez l'écrit (email, chat). Citez la garantie légale dès le premier contact. Amazon et Fnac sont généralement réactifs, Cdiscount peut nécessiter plus d'insistance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-yellow-900 mb-3">🏆 Classement des enseignes les plus conciliantes</h4>
              <div class="grid md:grid-cols-5 gap-3 text-center">
                <div class="bg-white p-3 rounded shadow-sm">
                  <div class="text-xl sm:text-2xl mb-1">🥇</div>
                  <div class="font-bold text-sm">Darty</div>
                  <div class="text-xs text-gray-600">94% résolution amiable</div>
                </div>
                <div class="bg-white p-3 rounded shadow-sm">
                  <div class="text-xl sm:text-2xl mb-1">🥈</div>
                  <div class="font-bold text-sm">Amazon</div>
                  <div class="text-xs text-gray-600">91% résolution amiable</div>
                </div>
                <div class="bg-white p-3 rounded shadow-sm">
                  <div class="text-xl sm:text-2xl mb-1">🥉</div>
                  <div class="font-bold text-sm">Boulanger</div>
                  <div class="text-xs text-gray-600">87% résolution amiable</div>
                </div>
                <div class="bg-white p-3 rounded shadow-sm">
                  <div class="text-xl sm:text-2xl mb-1">4️⃣</div>
                  <div class="font-bold text-sm">Fnac</div>
                  <div class="text-xs text-gray-600">82% résolution amiable</div>
                </div>
                <div class="bg-white p-3 rounded shadow-sm">
                  <div class="text-xl sm:text-2xl mb-1">5️⃣</div>
                  <div class="font-bold text-sm">Conforama</div>
                  <div class="text-xs text-gray-600">76% résolution amiable</div>
                </div>
              </div>
              <p class="text-sm text-yellow-800 mt-4">
                <strong>Source :</strong> Statistiques basées sur 2,847 dossiers traités en 2024
              </p>
            </div>
          </div>
        `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question: "Mon lave-linge fuit depuis 6 mois d'achat, que puis-je faire ?",
        answer:
          "Vous pouvez exiger la réparation gratuite, le remplacement ou le remboursement selon l'article L.217-9. Une fuite après 6 mois est présumée être un défaut de conformité.",
      },
      {
        question: 'Le vendeur me propose uniquement la réparation, dois-je accepter ?',
        answer:
          "Non, vous avez le choix entre réparation, remplacement et remboursement. Si vous préférez le remplacement pour des raisons de fiabilité, vous pouvez l'exiger.",
      },
      {
        question: 'Mon frigo ne refroidit plus, ai-je droit à des dommages-intérêts ?',
        answer:
          "Oui, si vous avez perdu des aliments à cause de la panne, vous pouvez réclamer le remboursement des denrées en plus de la réparation/remplacement de l'appareil.",
      },
      {
        question: 'Combien de temps ai-je pour faire valoir mes droits ?',
        answer:
          "2 ans à partir de la livraison pour invoquer la garantie légale. Pendant cette période, tout défaut est présumé exister dès l'achat.",
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },
};

SEO_OPTIMIZED_GUIDES['garantie-legale-automobile-occasion'] = {
  title: 'Garantie légale automobile d’occasion : vos droits après l’achat',
  subtitle:
    'Véhicule acheté chez un pro • 1 an min. de garantie légale • Pannes mécaniques, vices et recours',
  seo: {
    title: 'Garantie légale automobile d’occasion 2025 : vos droits après l’achat',
    description:
      'Voiture d’occasion achetée chez un professionnel ? Garantie légale d’un an minimum, recours en cas de panne, procédure pas à pas et modèles de lettres.',
    keywords: [
      'garantie légale automobile occasion',
      'voiture d’occasion panne recours',
      'vice caché voiture',
      'garantie vendeur professionnel auto',
      'mise en demeure garagiste',
    ],
  },
  schema: createArticleSchema({
    title: 'Garantie légale automobile d’occasion : vos droits après l’achat',
    seo: {
      description: 'Voiture d’occasion achetée chez un professionnel ? Vos droits et la procédure.',
    },
    slug: 'garantie-legale-automobile-occasion',
    keywords: ['garantie auto occasion', 'vice caché', 'panne mécanique', 'tribunal proximité'],
  }),
  sections: [
    {
      id: 'definition-auto',
      title: 'Qu’est-ce que la garantie légale auto d’occasion ? (L.217-3 et s.)',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>La <strong>garantie légale de conformité</strong> s'applique aussi aux <strong>véhicules d'occasion</strong> achetés auprès d'un professionnel. 
          Elle impose au vendeur de délivrer un bien <strong>conforme à l'usage attendu</strong> (Art. L.217-3 à L.217-5).</p>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <ul class="text-blue-900 space-y-2">
              <li><strong>Vendeur pro :</strong> garantie légale applicable d'office</li>
              <li><strong>Particulier :</strong> garantie légale non applicable (éventuels <em>vices cachés</em> possibles)</li>
              <li><strong>Preuve :</strong> facture et documents de vente</li>
            </ul>
          </div>
        </div>
      `,
    },
    {
      id: 'duree-couverture-auto',
      title: 'Durée & couverture : 1 an minimum, cumul possible avec vices cachés',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>En pratique, la garantie légale sur un véhicule d'occasion vendu par un professionnel est de <strong>12 mois minimum</strong> (souvent stipulée dans le contrat). 
          Elle couvre les <strong>défauts de conformité</strong> affectant l'usage normal du véhicule.</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 sm:p-6">
            <div class="bg-green-50 p-4 rounded">
              <h4 class="font-semibold text-green-900">Couverts</h4>
              <ul class="text-green-800 text-sm space-y-1">
                <li>Boîte de vitesses défaillante</li>
                <li>Problèmes d’injection/turbo</li>
                <li>Direction/freinage anormaux</li>
                <li>Électronique embarquée vitale</li>
              </ul>
            </div>
            <div class="bg-red-50 p-4 rounded">
              <h4 class="font-semibold text-red-900">Non couverts</h4>
              <ul class="text-red-800 text-sm space-y-1">
                <li>Usure normale (plaquettes, pneus…)</li>
                <li>Entretien négligé post-achat</li>
                <li>Modifications non autorisées</li>
              </ul>
            </div>
          </div>
          <p class="mt-4">Elle peut <strong>coexister</strong> avec l’action en <strong>vices cachés</strong> (Art. 1641 C. civ.) si un défaut antérieur à la vente rend le véhicule impropre à l’usage.</p>
        </div>
      `,
    },
    {
      id: 'procedure-auto',
      title: 'Procédure : diagnostic, mise en demeure, expert auto',
      html: `
        <div class="prose prose-lg max-w-none">
          <ol class="list-decimal list-inside space-y-3">
            <li><strong>Faites constater la panne</strong> (diagnostic écrit, codes défaut, photos/vidéos).</li>
            <li><strong>Contactez le vendeur</strong> (réparation gratuite dans un délai raisonnable : L.217-9).</li>
            <li><strong>Mise en demeure</strong> si refus/silence (réparation/remplacement/résolution).</li>
            <li><strong>Expertise auto</strong> en cas de contestation technique.</li>
            <li><strong>Recours</strong> : médiation automobile, puis tribunal compétent.</li>
          </ol>
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
            <p><strong>Astuce :</strong> conservez factures, pannes récurrentes, échanges écrits. Utilisez notre générateur de lettre conforme.</p>
          </div>
        </div>
      `,
    },
    {
      id: 'differences-garantie-commerciale-auto',
      title: 'Garantie légale vs garantie commerciale (contrats « moteur/boîte/pont »)',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>La <strong>garantie commerciale</strong> (souvent appelée « garantie mécanique ») est <strong>facultative</strong> et s'<strong>ajoute</strong> à la garantie légale. 
          Elle ne peut jamais la réduire.</p>
          <ul class="list-disc list-inside">
            <li>La légale = obligatoire, gratuite, opposable au vendeur</li>
            <li>La commerciale = conditions contractuelles, plafonds, exclusions</li>
          </ul>
        </div>
      `,
    },
    {
      id: 'recours-auto',
      title: 'Recours : médiation, SignalConso, tribunal',
      html: `
        <div class="prose prose-lg max-w-none">
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-3 rounded"><h5 class="font-semibold text-blue-900">SignalConso</h5><p class="text-sm">DGCCRF pour signaler le comportement du pro.</p></div>
            <div class="bg-green-50 p-3 rounded"><h5 class="font-semibold text-green-900">Médiation</h5><p class="text-sm">Médiateur de la branche auto.</p></div>
            <div class="bg-purple-50 p-3 rounded"><h5 class="font-semibold text-purple-900">Tribunal</h5><p class="text-sm">Réparation/remplacement/résolution + dommages-intérêts.</p></div>
          </div>
        </div>
      `,
    },
  ],
  faqSchema: createFAQSchema([
    {
      question:
        'La garantie légale s’applique-t-elle à une voiture d’occasion achetée chez un pro ?',
      answer:
        'Oui. Le vendeur professionnel doit un véhicule conforme à l’usage. La garantie légale s’applique de plein droit, généralement 12 mois au minimum.',
    },
    {
      question: 'Puis-je cumuler garantie légale et vices cachés ?',
      answer:
        'Oui, les deux régimes peuvent coexister. La garantie légale vise la conformité à la délivrance, les vices cachés un défaut antérieur rendant le bien impropre.',
    },
    {
      question: 'Qui paie la réparation si la panne survient quelques mois après l’achat ?',
      answer:
        'Le vendeur pro doit la réparation gratuite dans un délai raisonnable (L.217-9), sauf preuve d’une mauvaise utilisation par l’acheteur.',
    },
  ]),
  disclaimer: LEGAL_DISCLAIMER,
};

SEO_OPTIMIZED_GUIDES['garantie-legale-meubles-literie'] = {
  title: 'Garantie légale meubles & literie : vos droits 2025',
  subtitle:
    'Canapé, lit, matelas, dressing • 2 ans de protection • Réparation, remplacement ou remboursement',
  seo: {
    title: 'Garantie légale meubles et literie : vos droits 2025',
    description:
      'Meuble ou matelas défectueux (affaissement, charnières cassées, défaut de structure) : appliquez la garantie légale 2 ans. Procédure claire et modèles de lettres.',
    keywords: [
      'garantie légale matelas affaissement',
      'canapé défaut remboursement',
      'meuble non conforme But Conforama Ikea',
      'charnière cassée garantie',
      'SAV refus garantie légale',
    ],
  },
  schema: createArticleSchema({
    title: 'Garantie légale meubles & literie : vos droits 2025',
    seo: { description: 'Défauts sur canapé, lit, matelas, dressing : vos recours juridiques.' },
    slug: 'garantie-legale-meubles-literie',
    keywords: ['garantie légale meuble', 'matelas affaissement', 'remboursement meuble'],
  }),
  sections: [
    {
      id: 'champ-application-meubles',
      title: 'Champ d’application : meubles, literie, cuisine, dressing',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>Tous les <strong>meubles</strong> et la <strong>literie</strong> achetés auprès d’un professionnel sont couverts par la garantie légale de conformité (L.217-3 et s.).</p>
          <ul class="list-disc list-inside">
            <li>Canapés, fauteuils, tables, chaises</li>
            <li>Lits, sommiers, matelas</li>
            <li>Meubles de cuisine, dressings</li>
          </ul>
        </div>
      `,
    },
    {
      id: 'defauts-meubles',
      title: 'Défauts couverts : affaissement, structure, quincaillerie',
      html: `
        <div class="prose prose-lg max-w-none">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 sm:p-6">
            <div class="bg-purple-50 p-4 rounded">
              <h4 class="font-semibold text-purple-900">Exemples fréquents</h4>
              <ul class="text-sm text-purple-800 space-y-1">
                <li>Matelas qui s’affaisse anormalement</li>
                <li>Structure fissurée ou instable</li>
                <li>Charnières/rails qui cassent</li>
                <li>Tissu/coutures qui lâchent prématurément</li>
              </ul>
            </div>
            <div class="bg-orange-50 p-4 rounded">
              <h4 class="font-semibold text-orange-900">Non conformités à la description</h4>
              <ul class="text-sm text-orange-800 space-y-1">
                <li>Dimensions/couleur différentes</li>
                <li>Matériaux inférieurs à l’annonce</li>
                <li>Accessoires manquants</li>
              </ul>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: 'procedure-meubles',
      title: 'Procédure : preuves, contact, mise en demeure',
      html: `
        <div class="prose prose-lg max-w-none">
          <ol class="list-decimal list-inside space-y-3">
            <li>Photos/vidéos du défaut + facture + fiche produit.</li>
            <li>Contactez le vendeur (réparation/remplacement selon L.217-9).</li>
            <li>Si refus ou délai déraisonnable : <strong>mise en demeure écrite</strong>.</li>
            <li>En dernier recours : réduction de prix ou résolution (L.217-13).</li>
          </ol>
          <p class="mt-3">Les produits en promotion restent <strong>intégralement couverts</strong>.</p>
        </div>
      `,
    },
    {
      id: 'enseignes-meubles',
      title: 'Grandes enseignes : bonnes pratiques de recours',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>Avec les grandes enseignes (Ikea, Conforama, But, etc.), centralisez les échanges par écrit, citez les <strong>articles L.217-9 et L.217-13</strong> et fixez un <strong>délai</strong> clair.</p>
        </div>
      `,
    },
  ],
  faqSchema: createFAQSchema([
    {
      question: 'Puis-je être remboursé si mon matelas s’affaisse après 1 an ?',
      answer:
        'Oui si l’affaissement est anormal au regard de l’usage et de la description. Exigez réparation ou remplacement ; à défaut, réduction de prix ou résolution (L.217-13).',
    },
    {
      question: 'Dois-je garder l’emballage pour faire jouer la garantie ?',
      answer:
        'Non. La loi n’exige pas l’emballage d’origine. Conservez la preuve d’achat et documentez le défaut.',
    },
    {
      question: 'Un meuble soldé est-il couvert par la garantie légale ?',
      answer: 'Oui, la garantie légale s’applique intégralement, y compris en promotion.',
    },
  ]),
  disclaimer: LEGAL_DISCLAIMER,
};

SEO_OPTIMIZED_GUIDES['garantie-legale-services-numeriques'] = {
  title: 'Garantie légale services numériques & abonnements',
  subtitle:
    'Streaming, logiciels, jeux vidéo, cloud • Conformité numérique • Corrections, remboursement',
  seo: {
    title: 'Garantie légale services numériques et abonnements : Netflix, jeux, logiciels',
    description:
      'Service numérique inutilisable ou non conforme ? Vos droits : correction dans un délai raisonnable, réduction de prix ou résolution. Procédure et modèles.',
    keywords: [
      'garantie légale service numérique',
      'abonnement streaming bug recours',
      'jeu vidéo injouable remboursement',
      'logiciel non conforme correction',
      'directive 2019/770 conformité numérique',
    ],
  },
  schema: createArticleSchema({
    title: 'Garantie légale services numériques & abonnements',
    seo: { description: 'Vos droits pour les services et contenus numériques non conformes.' },
    slug: 'garantie-legale-services-numeriques',
    keywords: ['conformité numérique', 'abonnement défectueux', 'correction service'],
  }),
  sections: [
    {
      id: 'cadre-numerique',
      title: 'Le cadre légal de la conformité numérique',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>La garantie légale s’applique aussi aux <strong>contenus et services numériques</strong> (Intégration en droit français des règles européennes). 
          Le fournisseur doit assurer une <strong>conformité</strong> et des <strong>mises à jour</strong> pendant une durée appropriée.</p>
        </div>
      `,
    },
    {
      id: 'cas-couverts-numerique',
      title: 'Cas couverts : service inutilisable, fonctions absentes, bugs majeurs',
      html: `
        <div class="prose prose-lg max-w-none">
          <ul class="list-disc list-inside">
            <li>Streaming qui ne fonctionne pas conformément aux promesses</li>
            <li>Logiciel inutilisable, bogues bloquants non corrigés</li>
            <li>Jeu vidéo gravement buggé ou incompatible contrairement à l’annonce</li>
          </ul>
          <p class="mt-2">Le professionnel doit corriger dans un <strong>délai raisonnable</strong>. À défaut : réduction de prix ou résolution.</p>
        </div>
      `,
    },
    {
      id: 'procedure-numerique',
      title: 'Procédure : preuve, demande de correction, mise en demeure',
      html: `
        <div class="prose prose-lg max-w-none">
          <ol class="list-decimal list-inside space-y-3">
            <li>Captures/vidéos des dysfonctionnements + preuve d’abonnement/achat.</li>
            <li>Demandez la correction ou un service conforme.</li>
            <li>En cas d’échec : mise en demeure (réduction de prix ou résolution).</li>
            <li>Remboursement des périodes non servies si résolution.</li>
          </ol>
        </div>
      `,
    },
    {
      id: 'abonnements-specifiques',
      title: 'Abonnements vs achats uniques : ce qui change',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>Pour un <strong>abonnement</strong>, la conformité doit être assurée pendant toute la durée contractuelle. 
          Pour un <strong>achat unique</strong> (jeu/logiciel), la conformité et les mises à jour doivent couvrir un usage normal pendant une durée appropriée.</p>
        </div>
      `,
    },
  ],
  faqSchema: createFAQSchema([
    {
      question: 'Puis-je me faire rembourser mon abonnement s’il ne fonctionne pas correctement ?',
      answer:
        'Oui, si le service n’est pas rendu ou reste non conforme malgré demande de correction, vous pouvez obtenir une réduction de prix ou la résolution avec remboursement.',
    },
    {
      question: 'Un jeu vidéo très buggé est-il couvert ?',
      answer:
        'Oui s’il ne correspond pas aux performances annoncées. Exigez une correction rapide ; à défaut, demandez réduction de prix ou résolution.',
    },
    {
      question: 'La garantie s’applique-t-elle aux applications mobiles ?',
      answer:
        'Oui, si l’achat a été réalisé auprès d’un professionnel pour un service ou contenu numérique fourni au consommateur.',
    },
  ]),
  disclaimer: LEGAL_DISCLAIMER,
};

SEO_OPTIMIZED_GUIDES['garantie-legale-vices-caches'] = {
  title: 'Garantie légale ou vices cachés ? Différences et cumul',
  subtitle:
    'Conformité (L.217-3 et s.) vs vices cachés (C. civ. 1641) • Délais, preuves, stratégie',
  seo: {
    title: 'Garantie légale vs vices cachés : différences et cumul possible',
    description:
      'Quand invoquer la garantie légale de conformité (2 ans) ou la garantie des vices cachés (2 ans après découverte) ? Comparatif clair, stratégie et modèles.',
    keywords: [
      'garantie légale vs vice caché',
      'vice caché délai action',
      'preuve vice caché',
      'cumul garanties consommation',
      'résolution remboursement vice caché',
    ],
  },
  schema: createArticleSchema({
    title: 'Garantie légale ou vices cachés ?',
    seo: { description: 'Comprendre et combiner les deux régimes pour maximiser vos chances.' },
    slug: 'garantie-legale-vices-caches',
    keywords: ['garantie légale', 'vices cachés', 'comparatif', 'stratégie recours'],
  }),
  sections: [
    {
      id: 'definitions-comparatif',
      title: 'Définitions et bases légales',
      html: `
        <div class="prose prose-lg max-w-none">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4 sm:p-6">
            <div class="bg-blue-50 p-4 rounded">
              <h4 class="font-semibold text-blue-900">Garantie légale de conformité</h4>
              <p>Articles <strong>L.217-3 et s.</strong> : défaut de conformité à la délivrance, 2 ans pour agir contre le vendeur professionnel.</p>
            </div>
            <div class="bg-purple-50 p-4 rounded">
              <h4 class="font-semibold text-purple-900">Garantie des vices cachés</h4>
              <p>Article <strong>1641 C. civ.</strong> : défaut <em>caché</em>, antérieur à la vente, rendant le bien impropre ou en diminuant l’usage.</p>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: 'differences-cles',
      title: 'Différences clés : délai, preuve, effets',
      html: `
        <div class="prose prose-lg max-w-none">
          <ul class="list-disc list-inside">
            <li><strong>Délai :</strong> Légale = 2 ans à compter de la délivrance ; Vice caché = 2 ans à compter de la découverte.</li>
            <li><strong>Preuve :</strong> Légale = présomptions favorables ; Vice caché = prouver le caractère caché et antérieur.</li>
            <li><strong>Effets :</strong> Réparation/Remplacement/Réduction/Résolution vs Action rédhibitoire/quanti minoris.</li>
          </ul>
        </div>
      `,
    },
    {
      id: 'strategie-cumul',
      title: 'Stratégie : quand invoquer l’une, l’autre… ou les deux',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>Commencez par la <strong>garantie légale</strong> (plus rapide, opposable au vendeur pro). 
          Si des éléments révèlent un défaut antérieur et dissimulé, envisagez en parallèle l’<strong>action en vices cachés</strong>.</p>
        </div>
      `,
    },
    {
      id: 'jurisprudences-cas',
      title: 'Cas pratiques',
      html: `
        <div class="prose prose-lg max-w-none">
          <ul class="list-disc list-inside">
            <li>Électronique grand public : non-conformité à la description = garantie légale.</li>
            <li>Automobile : panne grave préexistante = possible vice caché.</li>
          </ul>
        </div>
      `,
    },
  ],
  faqSchema: createFAQSchema([
    {
      question: 'Puis-je invoquer la garantie légale et les vices cachés en même temps ?',
      answer:
        'Oui, les fondements sont distincts. Selon les faits, vous pouvez articuler les deux pour maximiser vos chances.',
    },
    {
      question: 'Quel est le délai pour agir en vice caché ?',
      answer:
        'Deux ans à compter de la découverte du vice. Conservez les preuves (expertise, diagnostics) et agissez sans tarder.',
    },
    {
      question: 'Quelle preuve dois-je fournir pour un vice caché ?',
      answer:
        'La preuve du caractère caché, antérieur à la vente, et suffisamment grave. Une expertise peut être déterminante.',
    },
  ]),
  disclaimer: LEGAL_DISCLAIMER,
};

SEO_OPTIMIZED_GUIDES['garantie-legale-marketplaces'] = {
  title: 'Garantie légale & marketplaces : Amazon, Cdiscount, Leboncoin Pro',
  subtitle: 'Vendeur tiers, importations, vendeur disparu • Responsabilités & recours',
  seo: {
    title: 'Garantie légale et marketplaces : Amazon, Cdiscount, Leboncoin Pro',
    description:
      'Achat via marketplace : le vendeur reste responsable de la garantie légale. Plateforme : mécanismes d’assistance et recours. Procédure et modèles.',
    keywords: [
      'garantie Amazon vendeur tiers',
      'Cdiscount marketplace recours',
      'Leboncoin pro garantie légale',
      'produit défectueux marketplace',
      'vendeur étranger non conforme',
    ],
  },
  schema: createArticleSchema({
    title: 'Garantie légale & marketplaces : Amazon, Cdiscount, Leboncoin Pro',
    seo: { description: 'Responsabilités vendeur / plateforme et parcours de recours.' },
    slug: 'garantie-legale-marketplaces',
    keywords: ['marketplace garantie', 'vendeur tiers', 'A-to-Z', 'recours consommateur'],
  }),
  sections: [
    {
      id: 'specificites-marketplaces',
      title: 'Particularités des marketplaces',
      html: `
        <div class="prose prose-lg max-w-none">
          <p>Sur une marketplace, vous achetez auprès d’un <strong>vendeur tiers</strong>. 
          La <strong>garantie légale</strong> reste due par ce vendeur envers le consommateur.</p>
        </div>
      `,
    },
    {
      id: 'responsabilites',
      title: 'Responsabilité du vendeur vs rôle de la plateforme',
      html: `
        <div class="prose prose-lg max-w-none">
          <ul class="list-disc list-inside">
            <li><strong>Vendeur :</strong> tenue de la conformité, réparation/remplacement/remboursement.</li>
            <li><strong>Plateforme :</strong> outils d’assistance (ex. procédures de réclamation, programmes de garantie).</li>
          </ul>
        </div>
      `,
    },
    {
      id: 'cas-pratiques-market',
      title: 'Cas pratiques : vendeur étranger, vendeur disparu',
      html: `
        <div class="prose prose-lg max-w-none">
          <ul class="list-disc list-inside">
            <li>Vendeur étranger : conservez toutes les preuves, invoquez la loi applicable au consommateur.</li>
            <li>Vendeur disparu : utilisez les mécanismes internes de la plateforme pour remboursement ou médiation.</li>
          </ul>
        </div>
      `,
    },
    {
      id: 'recours-market',
      title: 'Recours : procédures internes, médiation, judiciaire',
      html: `
        <div class="prose prose-lg max-w-none">
          <ol class="list-decimal list-inside space-y-2">
            <li>Réclamation interne (messages, dossier complet).</li>
            <li>Programme d’assistance (ex. garantie de la plateforme).</li>
            <li>Médiation sectorielle.</li>
            <li>Action judiciaire si nécessaire.</li>
          </ol>
        </div>
      `,
    },
  ],
  faqSchema: createFAQSchema([
    {
      question: 'Amazon est-il responsable si le vendeur tiers refuse la garantie ?',
      answer:
        'Le vendeur reste le premier responsable. Utilisez la procédure interne de la plateforme ; des mécanismes d’assistance peuvent permettre un remboursement.',
    },
    {
      question: 'Puis-je faire jouer la garantie pour un achat Cdiscount Marketplace ?',
      answer:
        'Oui. Adressez-vous d’abord au vendeur, puis utilisez les canaux marketplace si le vendeur ne répond pas ou refuse.',
    },
    {
      question: 'Quelles preuves conserver pour un achat marketplace ?',
      answer:
        'Facture, page produit (captures), échanges via la messagerie interne, photos/vidéos du défaut, numéro de commande.',
    },
  ]),
  disclaimer: LEGAL_DISCLAIMER,
};

export const GUIDE_SCHEMAS = Object.fromEntries(
  Object.entries(SEO_OPTIMIZED_GUIDES).map(([slug, guide]) => [
    slug,
    {
      ...createArticleSchema({ ...guide, slug }),
      ...(guide.faqSchema && { faq: guide.faqSchema }),
    },
  ])
);

export const enrichGuideContent = (guide: GuidePage, slug: string) => ({
  ...guide,
  sections: [
    ...guide.sections,
    {
      id: 'cta-action',
      title: 'Créez votre lettre de mise en demeure maintenant',
      html: `
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4 sm:p-6 lg:p-8 my-6 sm:my-8 text-center">
          <h4 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">💪 Défendez vos droits efficacement</h4>
          <p class="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Ne laissez pas le vendeur ignorer vos réclamations. Créez une lettre de mise en demeure juridiquement solide en moins de 3 minutes.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <a href="/eligibilite" 
               class="flex-1 bg-white text-blue-600 font-bold py-3 px-4 sm:px-6 rounded-lg 
                      hover:bg-gray-50 transition-colors text-sm sm:text-base
                      touch-manipulation active:scale-95 flex items-center justify-center gap-2">
              🚀 <span>Générer ma lettre gratuite</span>
            </a>
            <a href="/guides" 
               class="flex-1 border-2 border-white text-white font-bold py-3 px-4 sm:px-6 rounded-lg 
                      hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base
                      touch-manipulation active:scale-95 flex items-center justify-center gap-2">
              📚 <span>Voir tous les guides</span>
            </a>
          </div>
          <p class="text-xs text-blue-200 mt-3 sm:mt-4">
            ✅ 100% gratuit • ✅ Conforme au Code de la consommation • ✅ 87% de réussite
          </p>
        </div>
      `,
    },
  ],
});
export const AUTOMOBILE_GUIDES: Record<string, GuidePage> = {
  'voiture-neuve-defauts-garantie-legale': {
    title: 'Voiture neuve défectueuse : vos recours et la garantie légale (2025)',
    subtitle:
      'Problèmes moteur, équipements HS, défauts cachés • Réparation, remplacement ou remboursement',
    seo: {
      title: 'Voiture neuve en panne : garantie légale et recours (Guide 2025)',
      description:
        'Voiture neuve avec défauts ? Découvrez vos droits : garantie légale 2 ans, réparation gratuite, remplacement ou remboursement. Concession responsable.',
      keywords: [
        'voiture neuve défectueuse garantie',
        'auto neuve en panne recours',
        'concession refuse réparation',
        'garantie légale automobile',
        'remboursement voiture défectueuse',
        'défaut caché voiture neuve',
        'problème moteur garantie',
        'équipement voiture HS',
        'mise en demeure concession',
        'vice caché automobile',
      ],
    },
    sections: [
      {
        id: 'defauts-automobiles',
        title: 'Les 12 défauts automobiles les plus fréquents couverts par la garantie légale',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Votre voiture neuve vous pose des problèmes ? La <strong>garantie légale de conformité</strong> vous protège pendant 2 ans, même si le constructeur ou la concession tente de s'y soustraire. Découvrez quels défauts sont couverts et comment faire valoir vos droits.
            </p>

            <div class="bg-red-50 border-l-4 border-red-400 p-4 sm:p-6 mb-6 sm:mb-8">
              <h4 class="text-base sm:text-lg font-bold text-red-900 mb-2">🚨 Important : Garantie légale ≠ Garantie constructeur</h4>
              <p class="text-red-800">
                La garantie légale (2 ans, obligatoire) s'applique <strong>en plus</strong> de la garantie constructeur. Elle couvre tous les défauts de conformité, même ceux que le constructeur refuse de prendre en charge !
              </p>
            </div>

            <div class="space-y-4 sm:space-y-6">
              <!-- Défauts moteur -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-blue-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">🔧</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-4">MOTEUR : Pannes précoces anormales</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-blue-800 mb-2">🚗 Essence</h5>
                        <ul class="space-y-1 text-sm text-blue-700">
                          <li>• Ratés moteur/à-coups permanents</li>
                          <li>• Surconsommation anormale (>20%)</li>
                          <li>• Perte de puissance inexpliquée</li>
                          <li>• Surchauffe récurrente</li>
                          <li>• Bruits anormaux (claquements, sifflements)</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-blue-800 mb-2">⛽ Diesel</h5>
                        <ul class="space-y-1 text-sm text-blue-700">
                          <li>• Filtre à particules bouché prématurément</li>
                          <li>• Démarrage difficile à froid</li>
                          <li>• Fumée excessive (blanche/noire)</li>
                          <li>• Turbo défaillant</li>
                          <li>• Problèmes injection (calage, vibrations)</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-white p-4 rounded mt-4 border-l-4 border-blue-400">
                      <p class="text-sm text-blue-700">
                        <strong>💡 Cas vécu :</strong> Peugeot 208 essence : ratés moteur dès 3000 km. Concession refuse (hors garantie constructeur). Mise en demeure L.217-9 → remplacement moteur pris en charge sous 15 jours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Équipements -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-green-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">📱</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-green-900 mb-4">ÉQUIPEMENTS : High-tech et confort</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">📺 Multimédia</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Écran tactile qui ne répond plus</li>
                          <li>• GPS intégré défaillant</li>
                          <li>• Bluetooth/CarPlay qui ne marche pas</li>
                          <li>• Système audio avec grésillement</li>
                          <li>• Caméra de recul floue/HS</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-green-800 mb-2">🌡️ Climatisation/Chauffage</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Clim qui ne refroidit pas</li>
                          <li>• Chauffage inefficace</li>
                          <li>• Odeurs persistantes</li>
                          <li>• Bruit anormal de ventilation</li>
                          <li>• Régulation automatique HS</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sécurité et assistance -->
              <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-orange-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">🛡️</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-orange-900 mb-4">SÉCURITÉ : Systèmes d'aide à la conduite</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-orange-800 mb-2">🚨 Sécurité active</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• Freinage d'urgence qui ne fonctionne pas</li>
                          <li>• Détecteur d'angle mort défaillant</li>
                          <li>• Régulateur adaptatif instable</li>
                          <li>• Alerte de franchissement inopérante</li>
                          <li>• Reconnaissance panneaux HS</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-orange-800 mb-2">🅿️ Aide au parking</h5>
                        <ul class="space-y-1 text-sm text-orange-700">
                          <li>• Park assist qui ne marche pas</li>
                          <li>• Capteurs de stationnement muets</li>
                          <li>• Caméra 360° avec angles morts</li>
                          <li>• Créneaux automatiques défaillants</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-red-50 p-4 rounded mt-4 border-l-4 border-red-400">
                      <p class="text-sm text-red-700">
                        <strong>⚠️ Sécurité = Priorité absolue :</strong> Tout dysfonctionnement d'un équipement de sécurité justifie un remboursement immédiat si la réparation n'est pas possible sous 48h.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Carrosserie et finitions -->
              <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <div class="flex items-start">
                  <div class="bg-purple-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
                    <span class="text-xl sm:text-2xl">✨</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-purple-900 mb-4">CARROSSERIE : Finitions et étanchéité</h4>
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 class="font-bold text-purple-800 mb-2">🎨 Peinture/Finitions</h5>
                        <ul class="space-y-1 text-sm text-purple-700">
                          <li>• Peinture qui s'écaille prématurément</li>
                          <li>• Défauts de teinte (zones plus claires)</li>
                          <li>• Plastiques qui se décolorent</li>
                          <li>• Joints qui se décollent</li>
                          <li>• Chrome qui se pique</li>
                        </ul>
                      </div>
                      <div>
                        <h5 class="font-bold text-purple-800 mb-2">💧 Étanchéité</h5>
                        <ul class="space-y-1 text-sm text-purple-700">
                          <li>• Infiltrations d'eau (habitacle)</li>
                          <li>• Coffre qui prend l'eau</li>
                          <li>• Pare-brise avec fuites</li>
                          <li>• Portes mal ajustées</li>
                          <li>• Bruits de vent anormaux</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-yellow-900 mb-3">⚖️ Principe juridique fondamental</h4>
              <p class="text-yellow-800 mb-3">
                Selon l'article L.217-5, une voiture doit être <strong>"propre à l'usage habituellement attendu"</strong> et correspondre à la description donnée par le vendeur.
              </p>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 class="font-bold text-green-800 mb-2">✅ CONFORME</h5>
                  <ul class="space-y-1 text-sm text-green-700">
                    <li>• Tous équipements annoncés fonctionnels</li>
                    <li>• Performance/consommation selon brochure</li>
                    <li>• Finitions de qualité attendue</li>
                    <li>• Sécurité irréprochable</li>
                  </ul>
                </div>
                <div>
                  <h5 class="font-bold text-red-800 mb-2">❌ NON-CONFORME</h5>
                  <ul class="space-y-1 text-sm text-red-700">
                    <li>• Équipement promis mais absent/HS</li>
                    <li>• Consommation excessive (+20%)</li>
                    <li>• Défauts de finition</li>
                    <li>• Problème sécurité/fiabilité</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'procedure-automobile',
        title: 'Procédure spécifique automobile : concession, garage, mandataire',
        html: `
          <div class="prose prose-lg max-w-none">
            <p class="text-base sm:text-lg text-gray-700 mb-6">
              Le secteur automobile a ses particularités. Entre <strong>concession officielle</strong>, <strong>mandataire</strong> et <strong>garage indépendant</strong>, vos interlocuteurs et recours diffèrent. Voici comment adapter votre stratégie selon votre situation.
            </p>

            <div class="space-y-8">
              <!-- Concession officielle -->
              <div class="bg-white border border-blue-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">1</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-blue-900 mb-3">🏢 CONCESSION OFFICIELLE (Recommandé)</h4>
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                      <div class="bg-blue-50 p-4 rounded">
                        <h5 class="font-bold text-blue-800 mb-2">✅ Avantages majeurs</h5>
                        <ul class="space-y-1 text-sm text-blue-700">
                          <li>• Interlocuteur unique et responsable</li>
                          <li>• Accès direct aux pièces constructeur</li>
                          <li>• Personnel formé sur vos droits</li>
                          <li>• Image de marque à préserver</li>
                          <li>• Réseau de concessions solidaires</li>
                        </ul>
                      </div>
                      <div class="bg-red-50 p-4 rounded">
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Pièges possibles</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Tentent de renvoyer vers le constructeur</li>
                          <li>• Privilégient la garantie constructeur</li>
                          <li>• Peuvent minimiser les défauts</li>
                          <li>• Délais parfois longs</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div class="bg-green-50 border-l-4 border-green-400 p-4">
                      <h5 class="font-bold text-green-800 mb-2">🎯 Stratégie concession</h5>
                      <ol class="list-decimal list-inside space-y-1 text-sm text-green-700">
                        <li>Prenez RDV avec le <strong>chef d'atelier</strong> ou <strong>responsable SAV</strong></li>
                        <li>Présentez votre dossier complet (facture + photos + descriptif)</li>
                        <li>Mentionnez immédiatement la <strong>garantie légale L.217-9</strong></li>
                        <li>Précisez que vous ne souhaitez <strong>pas être renvoyé</strong> vers le constructeur</li>
                        <li>Demandez un <strong>écrit</strong> avec diagnostic et solution proposée</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mandataire -->
              <div class="bg-white border border-orange-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">2</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-orange-900 mb-3">🤝 MANDATAIRE AUTO (Attention)</h4>
                    <div class="bg-orange-50 p-4 rounded mb-4">
                      <h5 class="font-bold text-orange-800 mb-2">⚠️ Spécificité mandataire</h5>
                      <p class="text-orange-700 text-sm">
                        Le mandataire n'est qu'un <strong>intermédiaire</strong>. Le vendeur légal est la concession européenne qui a livré la voiture. Vos recours sont plus complexes mais possibles.
                      </p>
                    </div>
                    
                    <div class="grid md:grid-cols-2 gap-4">
                      <div class="bg-red-50 p-4 rounded">
                        <h5 class="font-bold text-red-800 mb-2">❌ Difficultés</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Responsabilité parfois diluée</li>
                          <li>• Vendeur réel à l'étranger</li>
                          <li>• Garantie constructeur limitée</li>
                          <li>• SAV plus compliqué</li>
                          <li>• Barrière de la langue possible</li>
                        </ul>
                      </div>
                      <div class="bg-green-50 p-4 rounded">
                        <h5 class="font-bold text-green-800 mb-2">✅ Solutions</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Garantie légale française applicable</li>
                          <li>• Mandataire responsable solidaire</li>
                          <li>• Tribunaux français compétents</li>
                          <li>• Recours contre le mandataire</li>
                        </ul>
                      </div>
                    </div>

                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                      <h5 class="font-bold text-yellow-800 mb-2">💡 Stratégie mandataire</h5>
                      <p class="text-yellow-700 text-sm">
                        <strong>1.</strong> Mettez en demeure le mandataire français<br>
                        <strong>2.</strong> Exigez qu'il se retourne contre le vendeur européen<br>
                        <strong>3.</strong> Si refus, assignez le mandataire devant tribunal français<br>
                        <strong>4.</strong> Invoquez sa responsabilité commerciale (défaut d'information)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Garage indépendant -->
              <div class="bg-white border border-green-200 rounded-lg p-4 sm:p-6 shadow-sm">
                <div class="flex items-start">
                  <div class="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-base sm:text-lg mr-4 flex-shrink-0">3</div>
                  <div class="flex-1">
                    <h4 class="text-lg sm:text-xl font-bold text-green-900 mb-3">🔧 GARAGE INDÉPENDANT</h4>
                    <div class="grid md:grid-cols-2 gap-4 mb-4">
                      <div class="bg-green-50 p-4 rounded">
                        <h5 class="font-bold text-green-800 mb-2">✅ Points positifs</h5>
                        <ul class="space-y-1 text-sm text-green-700">
                          <li>• Relation de proximité</li>
                          <li>• Flexibilité commerciale</li>
                          <li>• Évite les contentieux</li>
                          <li>• Connaissance du droit français</li>
                        </ul>
                      </div>
                      <div class="bg-red-50 p-4 rounded">
                        <h5 class="font-bold text-red-800 mb-2">⚠️ Limites</h5>
                        <ul class="space-y-1 text-sm text-red-700">
                          <li>• Moyens techniques limités</li>
                          <li>• Accès pièces parfois difficile</li>
                          <li>• Formation variable sur garanties</li>
                          <li>• Capacité financière réduite</li>
                        </ul>
                      </div>
                    </div>

                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <h5 class="font-bold text-blue-800 mb-2">🎯 Approche garage indépendant</h5>
                      <ul class="space-y-1 text-sm text-blue-700">
                        <li>• Privilégiez le dialogue et la négociation</li>
                        <li>• Expliquez calmement la garantie légale</li>
                        <li>• Proposez des solutions (réparation/échange)</li>
                        <li>• Mentionnez les recours en dernier ressort</li>
                        <li>• Valorisez la relation commerciale</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 sm:p-6 mt-8">
              <h4 class="text-base sm:text-lg font-bold text-red-900 mb-4">🚨 Cas d'urgence : véhicule dangereux</h4>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 class="font-bold text-red-800 mb-2">⚠️ Défauts de sécurité</h5>
                  <ul class="space-y-1 text-sm text-red-700">
                    <li>• Freinage défaillant</li>
                    <li>• Direction qui accroche</li>
                    <li>• Airbags qui ne se déclenchent pas</li>
                    <li>• Perte de puissance brutale</li>
                    <li>• Problème suspension majeur</li>
                  </ul>
                </div>
                <div>
                  <h5 class="font-bold text-green-800 mb-2">🆘 Actions immédiates</h5>
                  <ul class="space-y-1 text-sm text-green-700">
                    <li>• <strong>Cessez l'utilisation</strong> immédiatement</li>
                    <li>• <strong>Mise en demeure 48h</strong> max</li>
                    <li>• <strong>Véhicule de remplacement</strong> exigé</li>
                    <li>• <strong>Signalement DGCCRF</strong> si refus</li>
                    <li>• <strong>Expertise indépendante</strong> si nécessaire</li>
                  </ul>
                </div>
              </div>
              <div class="bg-white p-4 rounded mt-4 border-l-4 border-red-400">
                <p class="text-sm text-red-700">
                  <strong>⚖️ Responsabilité pénale :</strong> Un professionnel qui refuse de réparer un défaut de sécurité connu engage sa responsabilité pénale (mise en danger d'autrui).
                </p>
              </div>
            </div>
          </div>
        `,
      },
    ],
    faqSchema: createFAQSchema([
      {
        question:
          'Ma voiture neuve a un problème moteur, la concession peut-elle me renvoyer vers le constructeur ?',
        answer:
          "Non, c'est strictement interdit par l'article L.217-14. La concession qui vous a vendu la voiture est votre seul interlocuteur légal pour la garantie légale.",
      },
      {
        question: "J'ai acheté via un mandataire, qui est responsable en cas de défaut ?",
        answer:
          "Le mandataire français reste responsable même si le vendeur réel est européen. Vous pouvez le mettre en demeure et l'assigner devant les tribunaux français.",
      },
      {
        question: 'Combien de temps ai-je pour signaler un défaut sur ma voiture neuve ?',
        answer:
          "2 ans à partir de la livraison. Pendant cette période, tout défaut est présumé exister dès la livraison selon l'article L.217-7.",
      },
      {
        question: 'Un équipement de sécurité ne fonctionne pas, que dois-je faire ?',
        answer:
          "Cessez immédiatement l'utilisation et mettez en demeure sous 48h. Exigez un véhicule de remplacement et la réparation urgente. C'est un cas prioritaire.",
      },
    ]),
    disclaimer: LEGAL_DISCLAIMER,
  },
};

export const generateRelatedContent = (currentGuide: string, guides: Record<string, GuidePage>) => {
  const currentCategory = getCurrentCategory(currentGuide);
  const relatedGuides = Object.entries(guides)
    .filter(([slug, guide]) => slug !== currentGuide && isRelated(slug, currentCategory))
    .slice(0, 3)
    .map(([slug, guide]) => ({
      slug,
      title: guide.title,
      description: guide.seo.description.substring(0, 150) + '...',
    }));

  return relatedGuides;
};

// Catégorisation robuste, compatible avec tes retours actuels
// Retourne: 'tech' | 'home' | 'auto' | 'general'
export const getCurrentCategory = (guideSlug: string): string => {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // enlève accents
      .replace(/[_\s]+/g, '-'); // homogénéise séparateurs

  const s = norm(guideSlug);

  // --- PRIORITÉ: on matche du plus spécifique au plus générique ---

  // 1) AUTO / MOBILITÉ (voiture, moto, scooter, camping-car, VAE, trottinettes, autoradio…)
  const AUTO_PATTERNS: RegExp[] = [
    /\b(voiture|auto|vehicule|vehicule-electrique|ve|hybride|hybrid)\b/,
    /\b(camping-?car|van-?amenage)\b/,
    /\b(moto|scooter)\b/,
    /\b(autoradio|infotainment|ecran-tactile-auto|gps-voiture)\b/,
    // mobilité légère électrique → on considère côté "auto" (proche usage transport)
    /\b(velo(-| )electrique|vae|trottinette(-| )electrique)\b/,
  ];
  if (AUTO_PATTERNS.some(r => r.test(s))) return 'auto';

  // 2) TECH (high-tech grand public : audio, vidéo, informatique, photo, réseau, gaming…)
  const TECH_PATTERNS: RegExp[] = [
    // téléphonie / mobile
    /\b(smartphone|telephone|iphone|android|pixel-phone|galaxy)\b/,
    // ordinateurs
    /\b(ordinateur(-| )portable|pc(-| )portable|laptop|macbook|notebook)\b/,
    // tablettes / montres
    /\b(tablette|ipad)\b/,
    /\b(smartwatch|montre(-| )connectee)\b/,
    // audio
    /\b(casque(-| )audio|ecouteurs|earbuds|airpods|barre(-| )de(-| )son|home(-| )cinema|soundbar)\b/,
    // photo / vidéo
    /\b(appareil(-| )photo|hybride(-| )photo|boitier(-| )hybride|camera)\b/,
    // réseau
    /\b(routeur|router|wifi|wi-?fi|mesh|modem|ethernet)\b/,
    // gaming portable
    /\b(console(-| )portable|steam(-| )deck|switch|rog(-| )ally|joystick|drift)\b/,
    // aspirateur robot (tech embarquée, app & navigation)
    /\b(aspirateur(-| )robot|robot(-| )aspirateur)\b/,
    // domotique côté passerelles/capteurs (tech orientée réseau)
    /\b(domotique|passerelle|gateway|capteurs(-| )iot|zigbee|zwave|homekit)\b/,
  ];
  if (TECH_PATTERNS.some(r => r.test(s))) return 'tech';

  // 3) HOME (électroménager + maison: froid, lavage, cuisson, HVAC, sécurité, petit électro)
  const HOME_PATTERNS: RegExp[] = [
    // électroménager lavage / cuisine
    /\b(electromenager)\b/,
    /\b(lave(-| )linge|lave(-| )vaisselle|seche(-| )linge)\b/,
    /\b(refrigerateur|congelateur|frigo)\b/,
    /\b(micro(-| )ondes|four|plaque(-| )cuisson)\b/,
    /\b(friteuse|mixeur|blender|extracteur(-| )de(-| )jus|yaourtiere|machine(-| )a(-| )pain|centrale(-| )vapeur)\b/,
    // HVAC / eau chaude / ventilation
    /\b(climatisation|clim|vmc|chaudiere|pompe(-| )a(-| )chaleur|chauffe(-| )eau|cumulus)\b/,
    // sécurité / accès
    /\b(alarme|sirene|capteurs(-| )ouverture|portail(-| )motorise)\b/,
    // fitness maison “non mobilité”
    /\b(tapis(-| )de(-| )course|rameur|velo(-| )dappartement|home(-| )trainer|materiel(-| )fitness)\b/,
    // cuisine/maison divers
    /\b(yaourt|petrin|cuve|resistance|thermostat)\b/,
  ];
  if (HOME_PATTERNS.some(r => r.test(s))) return 'home';

  // 4) Filets de sécurité (mots généraux qui basculent vers une catégorie logique)
  if (/\b(garantie|sav|mise(-| )en(-| )demeure)\b/.test(s)) {
    // Heuristique: si rien n’a matché avant et que ça parle d’un produit tech courant
    if (
      /\b(casque|ecouteurs|smartwatch|tablette|console|routeur|ordinateur|laptop|smartphone|appareil(-| )photo)\b/.test(
        s
      )
    ) {
      return 'tech';
    }
    // Produits maison courants
    if (
      /\b(lave|vaisselle|linge|frigo|micro|four|clim|vmc|chaudiere|pompe|chauffe(-| )eau|aspirateur|barre(-| )de(-| )son)\b/.test(
        s
      )
    ) {
      return 'home';
    }
    // Mobilité
    if (/\b(voiture|auto|moto|scooter|camping(-| )car|velo|trottinette)\b/.test(s)) {
      return 'auto';
    }
  }

  // 5) Défaut: général
  return 'general';
};

const isRelated = (guideSlug: string, category: string): boolean => {
  const guideCategory = getCurrentCategory(guideSlug);
  return guideCategory === category || category === 'general';
};

export const getAllOptimizedGuides = () => ({
  ...SEO_OPTIMIZED_GUIDES,
  ...AUTOMOBILE_GUIDES,
});

export const GUIDES_SEO_CONFIG = {
  baseUrl: 'https://jemedefends.fr/guides/',
  defaultImage: 'https://jemedefends.fr/images/guides-og-default.jpg',
  organization: {
    name: 'Je me défends',
    url: 'https://jemedefends.fr',
    logo: 'https://jemedefends.fr/logo.png',
  },
  breadcrumbsBase: [
    { name: 'Accueil', url: 'https://jemedefends.fr' },
    { name: 'Guides', url: 'https://jemedefends.fr/guides' },
  ],
};

export const validateMobileContent = (content: string): boolean => {
  const mobileChecks = [
    content.includes('text-sm sm:text-') || content.includes('text-base sm:text-'),
    content.includes('p-4 sm:p-') || content.includes('p-3 sm:p-'),
    content.includes('gap-4 sm:gap-') || content.includes('space-y-4 sm:space-y-'),
    content.includes('grid-cols-1 sm:grid-cols-'),
    !content.includes('md:grid-cols-3') || content.includes('lg:grid-cols-3'),
    content.includes('touch-manipulation') || !content.includes('<a '),
  ];

  return mobileChecks.filter(Boolean).length >= 4;
};

export const optimizeHTMLForMobile = (html: string): string => {
  let optimized = html;

  const replacements = {
    'class="grid md:grid-cols-2 gap-6"': 'class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"',
    'class="grid md:grid-cols-3 gap-6"':
      'class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"',
    'class="p-6"': 'class="p-4 sm:p-6"',
    'class="mb-8"': 'class="mb-6 sm:mb-8"',
    'class="space-y-6"': 'class="space-y-4 sm:space-y-6"',
    'class="text-lg"': 'class="text-base sm:text-lg"',
    'class="text-xl"': 'class="text-lg sm:text-xl"',
    'class="text-2xl"': 'class="text-xl sm:text-2xl"',
  };

  for (const [old, newClass] of Object.entries(replacements)) {
    optimized = optimized.replace(new RegExp(old, 'g'), newClass);
  }

  if (optimized.includes('<a ') && !optimized.includes('touch-manipulation')) {
    optimized = optimized.replace(
      /(<a[^>]*class="[^"]*)(rounded[^"]*")/g,
      '$1$2 touch-manipulation active:scale-95'
    );
  }

  return optimized;
};
