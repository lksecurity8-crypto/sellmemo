import Link from 'next/link'
import { ArrowRight, Zap, Shield, Smartphone } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/20 dark:border-neutral-800/20">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            SellMemo
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400">
              Connexion
            </Link>
            <Link href="/auth/register" className="btn-primary">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container pt-32 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-white">
            Votre assistant personnel de vendeur
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
            SellMemo vous aide à mémoriser vos commandes, livraisons et clients. 
            Enregistrez une commande en moins de 15 secondes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
              Commencer maintenant <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="btn-secondary text-lg px-8 py-3">
              En savoir plus
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white dark:bg-neutral-900 py-20 border-t border-neutral-200 dark:border-neutral-800">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Fonctionnalités</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-primary-600" size={32} />,
                title: 'Ultra rapide',
                description: 'Enregistrez une commande en moins de 15 secondes'
              },
              {
                icon: <Shield className="text-primary-600" size={32} />,
                title: 'Sécurisé',
                description: 'Vos données sont protégées et sauvegardées dans le cloud'
              },
              {
                icon: <Smartphone className="text-primary-600" size={32} />,
                title: 'Mobile-first',
                description: 'Accédez depuis n\'importe quel appareil'
              },
            ].map((feature, i) => (
              <div key={i} className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Plans tarifaires</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Gratuit',
                price: '0',
                features: ['5 commandes', 'Support basique', 'Tableau de bord']
              },
              {
                name: 'Pro',
                price: '500',
                features: ['Commandes illimitées', 'Support prioritaire', 'Toutes les fonctionnalités'],
                highlighted: true
              },
              {
                name: 'Business',
                price: '1000',
                features: ['Tout de Pro', 'Statistiques avancées', 'Export Excel/PDF']
              },
            ].map((plan, i) => (
              <div key={i} className={`card p-8 ${plan.highlighted ? 'ring-2 ring-primary-600 scale-105' : ''}`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold text-primary-600 mb-6">{plan.price} <span className="text-lg text-neutral-600 dark:text-neutral-400">FCFA/mois</span></p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                      <span className="w-2 h-2 bg-primary-600 rounded-full"></span> {f}
                    </li>
                  ))}
                </ul>
                <button className={plan.highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  Choisir le plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
