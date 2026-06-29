'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PaymentMethod {
  id: string
  type: string
  name: string
  accountHolder: string
  accountNumber: string
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

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    paymentMethod: '',
    phoneNumber: '',
    transactionCode: '',
  })

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/payment-methods')
      if (res.ok) {
        const methods = await res.json()
        setPaymentMethods(methods)
        if (methods.length > 0) {
          setFormData(prev => ({ ...prev, paymentMethod: methods[0].type }))
        }
      }
    } catch (err) {
      setError('Erreur lors du chargement des méthodes de paiement')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)

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
      setSubmitting(false)
    }
  }

  const currentMethod = paymentMethods.find(m => m.type === formData.paymentMethod)

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    )
  }

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
                {paymentMethods.length === 0 ? (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-yellow-700 dark:text-yellow-200 text-sm">
                    Aucune méthode de paiement disponible
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.type}
                        className="flex items-center p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.type}
                          checked={formData.paymentMethod === method.type}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="mr-3"
                          disabled={submitting}
                        />
                        <div>
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{method.accountHolder}</p>
                          <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{method.accountNumber}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions */}
              {currentMethod && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                  <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Instructions de paiement</p>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                    <li>
                      Envoyez <strong>{formatCurrency(amount)}</strong> à{' '}
                      <strong>{currentMethod.accountNumber}</strong> ({currentMethod.accountHolder})
                    </li>
                    <li>Complétez le formulaire avec vos données de transaction</li>
                    <li>Soumettez votre demande</li>
                    <li>Notre administrateur examinera et approuvera rapidement</li>
                  </ol>
                </div>
              )}

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
                    disabled={submitting}
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
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={submitting || paymentMethods.length === 0}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitting ? 'Traitement...' : 'Soumettre le paiement'}
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()} disabled={submitting}>
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
