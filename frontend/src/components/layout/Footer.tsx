import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-black text-white mb-4">
              Je me défends
            </div>
            <p className="text-slate-400 leading-relaxed">
              Votre allié pour faire valoir vos droits de consommateur.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white">Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li><Link href="/eligibilite" className="hover:text-white">Éligibilité</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-white">Légal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/politique-confidentialite" className="hover:text-white">Confidentialité</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 Je me défends. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
