'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function PlansPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleUpgrade = (plan: string) => {
    setSelectedPlan(plan)
    // Redirection vers la page de paiement
    window.location.href = `/dashboard/payment?plan=${plan}`
  }

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      description: 'Parfait pour débuter',
      features: [
        'Jusqu\'à 5 commandes',
        'Tableau de bord',
        'Gestion de commandes basique',
        'Support par email',
      ],
      current: user?.plan === 'free',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 500,
      description: 'Pour les vendeurs actifs',
      features: [
        'Commandes illimitées',
        'Tableau de bord avancé',
        'Recherche et filtrage',
        'Support prioritaire',
        'Statistiques détaillées',
      ],
      current: user?.plan === 'pro',
      highlighted: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: 1000,
      description: 'Pour les grandes opérations',
      features: [
        'Tout de Pro',
        'Statistiques avancées',
        'Export PDF/Excel',
        'API Access',
        'Support 24/7 prioritaire',
      ],
      current: user?.plan === 'business',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-950 dark:to-neutral-900 p-4">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choisissez votre plan</h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Sélectionnez le plan qui convient à votre activité
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col ${
                plan.highlighted
                  ? 'ring-2 ring-primary-600 scale-105 shadow-lg'
                  : ''
              }`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">/mois</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300">
                      <span className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs">✓</span>
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.current}
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.current ? (
                    'Plan actuel'
                  ) : (
                    <>
                      Choisir ce plan
                      <ArrowRight className="ml-2" size={16} />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Vous avez une question? Contactez notre support
          </p>
          <Link href="mailto:support@sellmemo.com">
            <Button variant="outline">
              support@sellmemo.com
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
