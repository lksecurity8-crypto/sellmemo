'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Users, CreditCard, TrendingUp, Loader2 } from 'lucide-react'

interface Payment {
  id: string
  userId: string
  amount: number
  paymentMethod: string
  transactionId: string
  status: string
  plan: string
  user?: { name: string; email: string }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    loadPayments()
  }, [filter])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/payments')
      if (res.ok) {
        let data = await res.json()
        if (filter !== 'all') {
          data = data.filter((p: Payment) => p.status === filter)
        }
        setPayments(data)
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      })

      if (res.ok) {
        loadPayments()
      }
    } catch (error) {
      console.error('Error approving payment:', error)
    }
  }

  const handleReject = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })

      if (res.ok) {
        loadPayments()
      }
    } catch (error) {
      console.error('Error rejecting payment:', error)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des paiements</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Approuvez ou refusez les demandes de paiement</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tous' : f === 'pending' ? 'En attente' : f === 'approved' ? 'Approuvés' : 'Refusés'}
            </Button>
          ))}
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes de paiement</CardTitle>
            <CardDescription>Liste de toutes les demandes de paiement</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
                Aucun paiement trouvé
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold">Montant</th>
                      <th className="text-left py-3 px-4 font-semibold">Méthode</th>
                      <th className="text-left py-3 px-4 font-semibold">Code TX</th>
                      <th className="text-left py-3 px-4 font-semibold">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold">{payment.user?.name || 'N/A'}</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">{payment.user?.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize">{payment.plan}</td>
                        <td className="py-3 px-4 font-semibold">{payment.amount} FCFA</td>
                        <td className="py-3 px-4 capitalize">{payment.paymentMethod.replace('_', ' ')}</td>
                        <td className="py-3 px-4 text-xs font-mono">{payment.transactionId}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            payment.status === 'approved'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : payment.status === 'rejected'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {payment.status === 'pending' ? 'En attente' : payment.status === 'approved' ? 'Approuvé' : 'Refusé'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {payment.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(payment.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 size={14} className="mr-1" />
                                Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(payment.id)}
                              >
                                <AlertCircle size={14} className="mr-1" />
                                Refuser
                              </Button>
                            </div>
                          )}
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
