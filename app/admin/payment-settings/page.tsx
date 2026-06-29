'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Loader2, Edit2, Trash2, Plus } from 'lucide-react'

interface PaymentMethod {
  id: string
  type: string
  name: string
  accountHolder: string
  accountNumber: string
  isActive: boolean
}

export default function PaymentSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    accountHolder: '',
    accountNumber: '',
    isActive: true,
  })

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/payment-methods')
      if (res.ok) {
        setPaymentMethods(await res.json())
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
    setSuccess(null)

    if (!formData.type || !formData.name || !formData.accountHolder || !formData.accountNumber) {
      setError('Tous les champs sont obligatoires')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId
        ? `/api/admin/payment-methods/${editingId}`
        : '/api/admin/payment-methods'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }

      setSuccess(editingId ? 'Méthode mise à jour avec succès' : 'Méthode créée avec succès')
      resetForm()
      loadPaymentMethods()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement?')) return

    try {
      const res = await fetch(`/api/admin/payment-methods/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Erreur lors de la suppression')

      setSuccess('Méthode supprimée avec succès')
      loadPaymentMethods()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    }
  }

  const handleEdit = (method: PaymentMethod) => {
    setFormData(method)
    setEditingId(method.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      type: '',
      name: '',
      accountHolder: '',
      accountNumber: '',
      isActive: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres de paiement</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Gérez les méthodes de paiement disponibles</p>
        </div>

        {error && (
          <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-200 text-sm mb-6">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md text-green-700 dark:text-green-200 text-sm mb-6">
            <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Card */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Modifier' : 'Ajouter'} une méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      disabled={!!editingId}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-neutral-800 disabled:opacity-50"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="orange_money">Orange Money</option>
                      <option value="mtn_mobile_money">MTN Mobile Money</option>
                      <option value="wave">Wave</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nom du service</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ex: Orange Money Sénégal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Titulaire du compte</label>
                    <Input
                      type="text"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      placeholder="ex: Tchoupe Ngassa Daniella"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Numéro de compte</label>
                    <Input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="ex: 692860695"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-neutral-300 focus:ring-primary-600"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                    Actif
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Enregistrer</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Méthodes de paiement</CardTitle>
              <CardDescription>Total: {paymentMethods.length} méthode(s)</CardDescription>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus size={16} className="mr-2" />
                Ajouter
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
                Aucune méthode de paiement configurée
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold">Titulaire</th>
                      <th className="text-left py-3 px-4 font-semibold">Numéro</th>
                      <th className="text-left py-3 px-4 font-semibold">Statut</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethods.map((method) => (
                      <tr key={method.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="py-3 px-4 font-semibold">
                          {method.type === 'orange_money'
                            ? 'Orange Money'
                            : method.type === 'mtn_mobile_money'
                            ? 'MTN Mobile Money'
                            : method.type}
                        </td>
                        <td className="py-3 px-4">{method.name}</td>
                        <td className="py-3 px-4">{method.accountHolder}</td>
                        <td className="py-3 px-4 font-mono text-xs">{method.accountNumber}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              method.isActive
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {method.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(method)}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(method.id)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
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
