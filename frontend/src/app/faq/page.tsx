'use client';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, FileText, ChevronLeft, Star } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '@/components';

const metadata: Metadata = {
  title: 'FAQ - Questions fréquentes sur la garantie légale de conformité - Je me défends',
  description:
    'Toutes vos questions sur la garantie légale de conformité, vos droits de consommateur, les démarches et recours. Guide complet 2025.',
  alternates: { canonical: 'https://jemedefends.fr/faq' },
  openGraph: {
    title: 'FAQ - Questions fréquentes sur la garantie légale de conformité',
    description: 'Toutes vos questions sur vos droits de consommateur et la garantie légale.',
    url: 'https://jemedefends.fr/faq',
    siteName: 'Je me défends',
    type: 'website',
  },
};

// Structure FAQ avec catégories - AVEC QUESTIONS SUR LE SITE
const FAQ_DATA = {
  // TOP - Les plus importantes
  top: {
    title: 'Questions les plus importantes',
    icon: '⭐',
    color: 'yellow',
    items: [
      {
        id: 'garantie-duree',
        question: 'Combien de temps dure la garantie légale de conformité ?',
        answer:
          "La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs et <strong>1 an</strong> pour les biens d'occasion. Cette durée court à partir de la <strong>délivrance du bien</strong> (réception chez vous). C'est écrit dans l'article <strong>L.217-7</strong> du Code de la consommation.",
        popular: true,
      },
      {
        id: 'gratuit-obligatoire',
        question: 'La garantie légale est-elle vraiment gratuite et obligatoire ?',
        answer:
          'Oui ! La garantie légale est <strong>totalement gratuite</strong> (article L.217-14) et <strong>automatique</strong> dès que vous achetez chez un professionnel. Le vendeur ne peut pas la refuser, la facturer ou vous renvoyer vers le fabricant.',
        popular: true,
      },
      {
        id: 'preuve-defaut',
        question: "Dois-je prouver que le défaut existait à l'achat ?",
        answer:
          "Non ! Pendant les <strong>2 ans</strong> (1 an pour l'occasion), c'est <strong>présumé</strong> : le défaut est considéré comme existant dès la livraison. C'est au <strong>vendeur</strong> de prouver le contraire (article L.217-7).",
        popular: true,
      },
      {
        id: 'recours-possibles',
        question: 'Quels sont mes recours si mon produit ne marche pas ?',
        answer:
          "Vous avez le choix entre : <strong>réparation gratuite</strong>, <strong>remplacement gratuit</strong>, <strong>réduction du prix</strong> ou <strong>remboursement complet</strong>. Le vendeur doit accepter et agir dans un délai <strong>raisonnable</strong> sans vous causer d'inconvénients (L.217-9).",
        popular: true,
      },
    ],
  },

  // LE SITE - Nouvelles questions sur le fonctionnement
  site: {
    title: 'Le site Je me défends',
    icon: '🌐',
    color: 'indigo',
    items: [
      {
        id: 'pourquoi-gratuit',
        question: 'Pourquoi ce service est-il gratuit ?',
        answer:
          'Nous croyons que <strong>défendre ses droits ne doit pas coûter cher</strong>. La version gratuite donne accès au contenu juridique complet. Les options payantes ajoutent du confort (PDF, signature, envoi) pour ceux qui le souhaitent.',
      },
      {
        id: 'fonctionnement-site',
        question: 'Comment fonctionne concrètement le site ?',
        answer:
          'Simple : 1) Vous répondez à quelques questions sur votre situation 2) Notre algorithme vérifie votre éligibilité 3) Si éligible, votre lettre est générée avec les bons articles de loi 4) Vous choisissez : gratuit (à imprimer) ou payant (PDF + options).',
      },
      {
        id: 'choix-francais',
        question: "Pourquoi insister sur les 'choix français' ?",
        answer:
          "Par <strong>cohérence</strong> ! Nous aidons les consommateurs français contre les abus, donc nos fournisseurs sont français : <strong>Scaleway</strong> pour l'hébergement, <strong>Stancer</strong> pour les paiements, <strong>Merci Facteur</strong> pour l'envoi. Vos données restent en France 🇫🇷",
      },
      {
        id: 'qui-derriere',
        question: 'Qui se cache derrière Je me défends ?',
        answer:
          'Une petite équipe passionnée par le droit de la consommation et les outils numériques. Nous ne sommes pas avocats mais nous maîtrisons le Code de la consommation et voulons le rendre accessible à tous.',
      },
      {
        id: 'fiable-juridiquement',
        question: 'Vos lettres sont-elles juridiquement fiables ?',
        answer:
          "Oui ! Nous nous fondons <strong>uniquement sur les textes officiels</strong> : articles L.217-3 s. pour les biens, L.224-25-12 s. pour le numérique. Pas d'invention, que du droit positif. Mais attention : nous ne donnons pas de conseil juridique individualisé.",
      },
      {
        id: 'promesse-resultat',
        question: 'Garantissez-vous le succès de ma démarche ?',
        answer:
          "<strong>Non</strong>, et c'est honnête ! Nous fournissons un <strong>outil</strong> pour faire valoir vos droits, pas une garantie de résultat. L'issue dépend de votre situation, des preuves et de la bonne foi du vendeur.",
      },
    ],
  },

  // Bases juridiques
  bases: {
    title: 'Bases juridiques et définitions',
    icon: '⚖️',
    color: 'blue',
    items: [
      {
        id: 'definition-conformite',
        question: "Qu'est-ce qu'un défaut de conformité exactement ?",
        answer:
          "Un défaut de conformité c'est quand le produit : ne correspond pas à la description, ne fonctionne pas normalement, n'a pas les qualités annoncées, ne convient pas à l'usage habituel. Exemples : panne, fonctionnalité manquante, performance insuffisante.",
      },
      {
        id: 'article-217-4',
        question: "Que dit l'article L.217-4 du Code de la consommation ?",
        answer:
          "L'article L.217-4 définit la conformité : le bien doit correspondre à la description, avoir les qualités promises, être apte à l'usage habituel et présenter les qualités qu'un acheteur peut légitimement attendre.",
      },
      {
        id: 'difference-garanties',
        question: 'Quelle différence entre garantie légale et garantie commerciale ?',
        answer:
          'La <strong>garantie légale</strong> est obligatoire, gratuite, 2 ans, donnée par la loi. La <strong>garantie commerciale</strong> est facultative, payante ou offerte, durée variable, donnée par le vendeur/fabricant. La garantie commerciale ne remplace jamais la garantie légale !',
      },
      {
        id: 'consommateur-definition',
        question: 'Qui est considéré comme consommateur ?',
        answer:
          "Un consommateur est une personne physique qui agit à des fins qui n'entrent pas dans le cadre de son activité commerciale, industrielle, artisanale, libérale ou agricole (article liminaire du Code conso).",
      },
      {
        id: 'professionnel-definition',
        question: 'Qui est considéré comme professionnel ?',
        answer:
          'Un professionnel est une personne physique ou morale qui agit à des fins entrant dans le cadre de son activité commerciale, industrielle, artisanale, libérale ou agricole.',
      },
    ],
  },

  // Démarches pratiques
  demarches: {
    title: 'Démarches et procédures',
    icon: '📋',
    color: 'green',
    items: [
      {
        id: 'comment-agir',
        question: 'Comment faire valoir la garantie légale concrètement ?',
        answer:
          "1) Contactez d'abord le vendeur (pas le fabricant) 2) Envoyez une mise en demeure écrite (recommandé conseillé) 3) Laissez un délai raisonnable 4) Si échec : médiateur, associations, justice.",
      },
      {
        id: 'delai-raisonnable',
        question: "C'est quoi un 'délai raisonnable' ?",
        answer:
          "Il n'y a pas de durée fixe. En général : <strong>15 jours à 1 mois</strong> selon la complexité. Pour une réparation simple : 15 jours. Pour un remplacement : 1 mois. Le délai doit tenir compte de la nature du bien et du défaut.",
      },
      {
        id: 'frais-transport',
        question: 'Qui paie les frais de transport pour réparation/échange ?',
        answer:
          "Le <strong>vendeur</strong> ! Tous les frais liés à la mise en conformité sont à sa charge : transport, main d'œuvre, pièces détachées (article L.217-14). Vous ne devez rien payer.",
      },
      {
        id: 'vendeur-ferme',
        question: 'Que faire si le vendeur a fermé/fait faillite ?',
        answer:
          "Si le vendeur n'existe plus, vous pouvez vous retourner vers le <strong>fabricant</strong> pour la garantie légale (L.217-16). Sinon, vérifiez si vous avez une assurance ou protection juridique.",
      },
      {
        id: 'achat-internet',
        question: "La garantie légale s'applique-t-elle aux achats en ligne ?",
        answer:
          "Bien sûr ! La garantie légale s'applique quel que soit le canal d'achat : magasin, internet, téléphone, domicile... Du moment que vous achetez à un professionnel.",
      },
    ],
  },

  // Cas spécifiques
  cas: {
    title: 'Cas spécifiques par produit',
    icon: '🔧',
    color: 'purple',
    items: [
      {
        id: 'smartphone-ecran',
        question: "Mon écran de smartphone s'est fissuré, suis-je couvert ?",
        answer:
          "Ça dépend ! Si la fissure apparaît sans choc (défaut de fabrication), c'est couvert. Si c'est suite à une chute, c'est de l'usure normale non couverte. La nuance est importante.",
      },
      {
        id: 'electromenager-panne',
        question: 'Mon électroménager tombe en panne au bout de 18 mois, que faire ?',
        answer:
          "Vous êtes encore dans les 2 ans ! Contactez le vendeur pour réparation gratuite. Le défaut est présumé exister depuis l'achat. Pas besoin de prouver que c'est un vice de fabrication.",
      },
      {
        id: 'voiture-occasion',
        question: "J'ai acheté une voiture d'occasion, ai-je des droits ?",
        answer:
          "Oui ! <strong>1 an</strong> de garantie légale chez un professionnel. Pour les voitures, attention aux clauses d'exclusion abusives. Les défauts majeurs (moteur, transmission) restent couverts.",
      },
      {
        id: 'meuble-defaut',
        question: "Mon meuble a un défaut esthétique, c'est couvert ?",
        answer:
          "Si le défaut esthétique était présent à la livraison et non signalé dans la description, c'est un défaut de conformité. Rayure, tache, décoloration... peuvent être couverts.",
      },
      {
        id: 'ordinateur-lent',
        question: 'Mon ordinateur est très lent, puis-je invoquer la garantie ?',
        answer:
          "Si les performances sont très inférieures aux spécifications annoncées, c'est un défaut de conformité. Il faut comparer avec ce qui était promis à la vente.",
      },
    ],
  },

  // Données et sécurité - NOUVELLE CATÉGORIE
  donnees: {
    title: 'Données et sécurité',
    icon: '🔒',
    color: 'emerald',
    items: [
      {
        id: 'donnees-collectees',
        question: 'Quelles données personnelles collectez-vous ?',
        answer:
          "Le <strong>strict minimum</strong> : vos coordonnées (nom, adresse, email), celles du vendeur, les détails du produit/service (référence, date d'achat) et la description du problème. C'est tout ! Pas de données superflues.",
      },
      {
        id: 'pourquoi-ces-donnees',
        question: 'Pourquoi avez-vous besoin de ces informations ?',
        answer:
          "Pour générer une lettre <strong>juridiquement valable</strong> ! Il faut identifier l'expéditeur (vous), le destinataire (vendeur), l'objet du litige (produit) et les faits (problème rencontré). Sans ça, pas de mise en demeure efficace.",
      },
      {
        id: 'hebergement-france',
        question: 'Mes données restent-elles vraiment en France ?',
        answer:
          "Oui ! <strong>Scaleway</strong> héberge nos serveurs en France 🇫🇷. Les paiements sont traités par <strong>Stancer</strong> (français). L'envoi recommandé passe par <strong>Merci Facteur</strong> (France aussi). Vos données ne quittent jamais le territoire.",
      },
      {
        id: 'revente-donnees',
        question: 'Revendez-vous nos données à des tiers ?',
        answer:
          "<strong>Jamais !</strong> Nous ne vendons, ne louons, ni n'échangeons vos données. Elles servent uniquement à générer votre lettre. Point final. C'est contraire à notre éthique et à notre mission.",
      },
      {
        id: 'duree-conservation',
        question: 'Combien de temps gardez-vous nos données ?',
        answer:
          "Le temps nécessaire pour le service demandé, puis suppression. Pour la version gratuite : suppression immédiate après génération. Pour les versions payantes : conservation le temps du suivi d'envoi, puis suppression.",
      },
      {
        id: 'droit-suppression',
        question: 'Puis-je demander la suppression de mes données ?',
        answer:
          "Bien sûr ! Vous avez un <strong>droit à l'effacement</strong> (RGPD). Contactez-nous et nous supprimons immédiatement toutes vos données de nos systèmes. C'est gratuit et sans justification.",
      },
      {
        id: 'securite-technique',
        question: 'Comment protégez-vous techniquement nos données ?',
        answer:
          'Chiffrement HTTPS sur toutes les communications, base de données sécurisée, accès restreint aux seules personnes autorisées, sauvegardes chiffrées. Sécurité de niveau professionnel.',
      },
      {
        id: 'acces-donnees',
        question: 'Qui a accès à mes informations ?',
        answer:
          "Seule notre équipe technique restreinte, et uniquement en cas de problème technique. Nous n'accédons jamais aux données pour d'autres raisons. Aucun partenaire commercial n'a accès.",
      },
    ],
  },

  // Recours et alternatives
  recours: {
    title: 'Recours et alternatives',
    icon: '🆘',
    color: 'orange',
    items: [
      {
        id: 'signalconso',
        question: 'À quoi sert SignalConso ?',
        answer:
          '<strong>SignalConso</strong> permet de signaler un problème à la DGCCRF. Utile pour faire pression sur le professionnel et contribuer aux contrôles, mais ça ne règle pas directement votre litige.',
      },
      {
        id: 'association-conso',
        question: "Les associations de consommateurs peuvent-elles m'aider ?",
        answer:
          'Oui ! UFC-Que Choisir, 60 Millions, CLCV... offrent conseils, courriers types, médiation et parfois accompagnement juridique. Adhésion souvent nécessaire.',
      },
      {
        id: 'conciliateur',
        question: 'Comment ça marche un conciliateur de justice ?',
        answer:
          "Le conciliateur est <strong>gratuit</strong> et tente une résolution amiable. Compétent jusqu'à 5000€. Demande au tribunal judiciaire de votre domicile. Procédure simple et rapide.",
      },
      {
        id: 'tribunal-conso',
        question: 'Puis-je aller au tribunal sans avocat ?',
        answer:
          "Oui ! Jusqu'à <strong>10 000€</strong>, pas d'avocat obligatoire au tribunal judiciaire. Procédure simplifiée. Pensez à tenter la conciliation d'abord.",
      },
      {
        id: 'protection-juridique',
        question: 'Mon assurance couvre-t-elle les litiges de consommation ?',
        answer:
          "Vérifiez votre contrat d'assurance habitation/auto : beaucoup incluent une 'protection juridique' couvrant les litiges conso. Franchise souvent de 150-300€.",
      },
    ],
  },
};

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Recherche dans les FAQs
  const searchResults = searchTerm.trim()
    ? Object.entries(FAQ_DATA).flatMap(([categoryKey, category]) =>
        category.items
          .filter(
            item =>
              item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map(item => ({ ...item, category: categoryKey, categoryTitle: category.title }))
      )
    : [];

  const toggleItem = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const topQuestions = FAQ_DATA.top.items;
  const totalQuestions = Object.values(FAQ_DATA).reduce(
    (sum, category) => sum + category.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile-first */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 sm:py-8 max-w-4xl mx-auto">
          {/* Navigation */}
          <Reveal>
            <nav className="mb-4" aria-label="Fil d'ariane">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Accueil
              </Link>
            </nav>
          </Reveal>

          {/* Titre et stats */}
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  🤔 Questions fréquentes
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  Tout savoir sur vos droits de consommateur
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  {topQuestions.length} essentielles
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {totalQuestions} questions
                </div>
              </div>
            </div>
          </Reveal>

          {/* Recherche */}
          <Reveal delay={0.2}>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.3}>
            <Link
              href="/eligibilite"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Créer ma lettre maintenant
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="px-4 py-6 sm:py-8 max-w-4xl mx-auto">
        {/* Résultats de recherche */}
        {searchTerm.trim() && (
          <Reveal>
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Résultats de recherche ({searchResults.length})
              </h2>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map(item => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-start justify-between text-left"
                      >
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                        {openItems.includes(item.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        )}
                      </button>
                      {openItems.includes(item.id) && (
                        <div
                          className="mt-4 text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Aucun résultat trouvé.</p>
              )}
            </div>
          </Reveal>
        )}

        {/* Navigation par catégories si pas de recherche */}
        {!searchTerm.trim() && (
          <>
            {/* Navigation rapide */}
            <Reveal>
              <div className="mb-8 bg-white border border-gray-200 rounded-lg p-4">
                <h2 className="font-semibold text-gray-900 mb-3">Navigation rapide</h2>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(FAQ_DATA).map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => {
                        const element = document.getElementById(`category-${key}`);
                        element?.scrollIntoView({ behavior: 'smooth' });
                        setActiveCategory(key);
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${
                          activeCategory === key
                            ? `bg-${category.color}-100 text-${category.color}-700`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <span>{category.icon}</span>
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Catégories de FAQ */}
            <div className="space-y-8">
              {Object.entries(FAQ_DATA).map(([categoryKey, category], categoryIndex) => (
                <Reveal key={categoryKey} delay={categoryIndex * 0.1}>
                  <div
                    id={`category-${categoryKey}`}
                    className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
                      >
                        <span className="text-lg">{category.icon}</span>
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          {category.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {category.items.length} question{category.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {category.items.map(item => (
                        <div key={item.id} className="border border-gray-100 rounded-lg">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-start justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              {item.popular && (
                                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-1" />
                              )}
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                                {item.question}
                              </h3>
                            </div>
                            {openItems.includes(item.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                            )}
                          </button>
                          {openItems.includes(item.id) && (
                            <div
                              className="px-4 pb-4 text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {/* CTA final */}
        <Reveal>
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg sm:rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-green-900 mb-3">
              💡 Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p className="text-green-800 mb-6">
              Créez votre lettre personnalisée ! Notre outil vous guide selon votre situation
              précise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/eligibilite"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-5 h-5 mr-2" />
                Tester mon éligibilité
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                📚 Voir tous les guides
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
