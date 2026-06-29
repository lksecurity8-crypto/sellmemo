'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  plan: string
  subscriptionExpiresAt: string | null
  isActive: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        setUsers(await res.json())
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Visualisez tous les utilisateurs SellMemo</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tous les utilisateurs</CardTitle>
            <CardDescription>Total: {users.length} utilisateurs</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
                Aucun utilisateur trouvé
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Nom</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Plan</th>
                      <th className="text-left py-3 px-4 font-semibold">Expiration</th>
                      <th className="text-left py-3 px-4 font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="py-3 px-4 font-semibold">{user.name}</td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                            {user.plan.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {user.subscriptionExpiresAt
                            ? new Date(user.subscriptionExpiresAt).toLocaleDateString('fr-FR')
                            : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {user.isActive ? 'Actif' : 'Inactif'}
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
