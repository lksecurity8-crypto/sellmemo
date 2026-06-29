'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const PAYMENT_METHODS = {
  orange_money: {
    name: 'Orange Money',
    number: '+221 77 000 0000',
  },
  mtn_mobile_money: {
    name: 'MTN Mobile Money',
    number: '+221 77 111 1111',
  },
}

const PLAN_PRICES: Record<string, number> = {
  free: 0,
  pro: 500,
  business: 1000,
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = (searchParams.get('plan') as string) || 'pro'
  const amount = PLAN_PRICES[plan] || 500

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    paymentMethod: 'orange_money',
    phoneNumber: '',
    transactionCode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.transactionCode,
          plan,
        }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const currentMethod = PAYMENT_METHODS[formData.paymentMethod as keyof typeof PAYMENT_METHODS]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Paiement</CardTitle>
            <CardDescription>Complétez votre paiement pour activer votre plan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-200 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-200 text-sm">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Paiement reçu! Redirection...</span>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-primary-50 dark:bg-primary-950/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Plan sélectionné</p>
                    <p className="text-lg font-semibold capitalize">{plan}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Montant</p>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(amount)}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <Label>Méthode de paiement</Label>
                <div className="grid gap-3">
                  {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
                    <label key={key} className="flex items-center p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={key}
                        checked={formData.paymentMethod === key}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="mr-3"
                        disabled={loading}
                      />
                      <div>
                        <p className="font-semibold">{method.name}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{method.number}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Instructions de paiement</p>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Envoyez {formatCurrency(amount)} à <strong>{currentMethod.number}</strong></li>
                  <li>Complétez le formulaire avec vos données de transaction</li>
                  <li>Soumettez votre demande</li>
                  <li>Notre administrateur examinera et approuvera rapidement</li>
                </ol>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phoneNumber">Numéro utilisé pour le paiement</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="ex: 77 123 45 67"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="transactionCode">Code de transaction</Label>
                  <Input
                    id="transactionCode"
                    placeholder="ex: ABC123DEF456"
                    value={formData.transactionCode}
                    onChange={(e) => setFormData({ ...formData, transactionCode: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Traitement...' : 'Soumettre le paiement'}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={loading}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
