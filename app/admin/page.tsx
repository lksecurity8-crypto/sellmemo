'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, DollarSign, TrendingUp, Loader2 } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        setStats(await res.json())
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Panneau administrateur</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Gérez SellMemo et visualisez les statistiques</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total utilisateurs',
              value: stats?.totalUsers || 0,
              icon: Users,
              color: 'primary',
            },
            {
              label: 'Total commandes',
              value: stats?.totalOrders || 0,
              icon: Package,
              color: 'secondary',
            },
            {
              label: 'Revenus',
              value: `${stats?.totalRevenue?._sum?.amount || 0} FCFA`,
              icon: DollarSign,
              color: 'green',
            },
            {
              label: 'Paiements en attente',
              value: stats?.pendingPayments || 0,
              icon: TrendingUp,
              color: 'orange',
            },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="text-primary-600 dark:text-primary-400" size={32} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accédez rapidement aux pages d'administration</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Gestion des utilisateurs', href: '/admin/users' },
              { title: 'Gestion des paiements', href: '/admin/payments' },
              { title: 'Statistiques détaillées', href: '/admin/stats' },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <p className="font-semibold text-primary-600 dark:text-primary-400">
                  {link.title}
                </p>
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
