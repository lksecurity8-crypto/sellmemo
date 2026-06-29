'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Plus, Package, TrendingUp, Calendar, User } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger l'utilisateur et les commandes depuis localStorage pour la démo
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }

        // Charger les commandes
        const ordersRes = await fetch('/api/orders?userId=' + storedUser?.id)
        if (ordersRes.ok) {
          setOrders(await ordersRes.json())
        }

        // Charger les statistiques
        setStats({
          totalOrders: 0,
          deliveredToday: 0,
          pendingOrders: 0,
          deliveredOrders: 0,
        })
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            SellMemo
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {user?.name}
            </span>
            <Button variant="ghost" size="sm" onClick={() => {
              localStorage.removeItem('user')
              window.location.href = '/'
            }}>
              <LogOut size={16} className="mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue, {user?.name}!</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Plan: <span className="font-semibold text-primary-600">{user?.plan === 'free' ? 'Gratuit' : user?.plan === 'pro' ? 'Pro' : 'Business'}</span>
            </p>
          </div>
          <Link href="/dashboard/orders/new">
            <Button size="lg">
              <Plus className="mr-2" size={20} />
              Nouvelle commande
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total commandes', value: '0', icon: Package, color: 'primary' },
            { label: "Commandes d'aujourd'hui", value: '0', icon: Calendar, color: 'secondary' },
            { label: 'En attente', value: '0', icon: TrendingUp, color: 'orange' },
            { label: 'Livrées', value: '0', icon: User, color: 'green' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                      <Icon className={`text-${stat.color}-600`} size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Subscription Info */}
        {user?.plan === 'free' && (
          <Card className="mb-8 border-primary-200 dark:border-primary-900/30 bg-primary-50 dark:bg-primary-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Plan Gratuit - 5 commandes maximum</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Vous avez utilisé {orders.length} sur 5 commandes. Passez à Pro ou Business pour l'illimité.
                  </p>
                </div>
                <Link href="/dashboard/plans">
                  <Button>
                    Passer à Premium
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>Vos 10 dernières commandes</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto mb-4 text-neutral-400" size={48} />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">Aucune commande pour le moment</p>
                <Link href="/dashboard/orders/new">
                  <Button>Créer une commande</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 font-semibold">Produit</th>
                      <th className="text-left py-3 px-4 font-semibold">Quantité</th>
                      <th className="text-left py-3 px-4 font-semibold">Prix</th>
                      <th className="text-left py-3 px-4 font-semibold">Livraison</th>
                      <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="py-3 px-4">{order.clientName}</td>
                        <td className="py-3 px-4">{order.product}</td>
                        <td className="py-3 px-4">{order.quantity}</td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(order.price)}</td>
                        <td className="py-3 px-4">{formatDate(new Date(order.deliveryDate))}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'delivered'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {order.status === 'pending' ? 'En attente' : order.status === 'delivered' ? 'Livrée' : 'Annulée'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
