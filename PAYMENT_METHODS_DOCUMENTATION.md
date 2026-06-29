# Gestion des méthodes de paiement - Documentation

## Vue d'ensemble

La fonctionnalité de gestion des méthodes de paiement permet aux administrateurs de configurer et maintenir les informations de paiement sans modifier le code source.

## Architecture

### Base de données
- **Modèle**: `PaymentMethod` dans Prisma schema
- **Table**: `payment_methods`
- **Champs**:
  - `id`: Identifiant unique
  - `type`: Type de paiement (orange_money, mtn_mobile_money, etc.)
  - `name`: Nom du service de paiement
  - `accountHolder`: Titulaire du compte
  - `accountNumber`: Numéro de compte
  - `isActive`: Statut (actif/inactif)
  - `createdAt`: Date de création
  - `updatedAt`: Date de dernière mise à jour

### API Routes

#### Admin Routes (Privées)

**GET `/api/admin/payment-methods`**
- Récupère toutes les méthodes de paiement
- Accessible uniquement aux administrateurs
- Réponse: `PaymentMethod[]`

**POST `/api/admin/payment-methods`**
- Crée une nouvelle méthode de paiement
- Corps de la requête:
  ```json
  {
    "type": "orange_money",
    "name": "Orange Money Sénégal",
    "accountHolder": "Tchoupe Ngassa Daniella",
    "accountNumber": "692860695",
    "isActive": true
  }
  ```

**PUT `/api/admin/payment-methods/[id]`**
- Met à jour une méthode de paiement
- Paramètres: `id` (ID de la méthode)
- Corps: même structure que POST

**DELETE `/api/admin/payment-methods/[id]`**
- Supprime une méthode de paiement
- Paramètres: `id`

#### Public Routes

**GET `/api/payment-methods`**
- Récupère les méthodes actives uniquement
- Accessible publiquement (utilisateurs)
- Retourne uniquement les champs nécessaires
- Réponse:
  ```json
  [
    {
      "id": "...",
      "type": "orange_money",
      "name": "Orange Money Sénégal",
      "accountHolder": "Tchoupe Ngassa Daniella",
      "accountNumber": "692860695"
    }
  ]
  ```

## Pages

### Admin - Paramètres de paiement
**URL**: `/admin/payment-settings`

Page de gestion complète des méthodes de paiement avec:
- Tableau de toutes les méthodes
- Formulaire pour ajouter/modifier
- Boutons d'édition et suppression
- Messages de succès/erreur
- Indicateur de statut (Actif/Inactif)

### Utilisateur - Page de paiement
**URL**: `/dashboard/payment?plan=pro`

Page de paiement dynamique qui:
- Charge les méthodes depuis la base de données
- Affiche les informations mises à jour en temps réel
- Montre les instructions personnalisées
- Permet de sélectionner la méthode

## Données initiales

Deux méthodes sont créées automatiquement:

1. **Orange Money**
   - Type: `orange_money`
   - Titulaire: Tchoupe Ngassa Daniella
   - Numéro: 692860695

2. **MTN Mobile Money**
   - Type: `mtn_mobile_money`
   - Titulaire: Tchoupe Ngassa Daniella
   - Numéro: 652591205

## Flux d'utilisation

### Admin modifie les paramètres
1. Accède à `/admin/payment-settings`
2. Clique sur "Modifier" pour une méthode
3. Modifie les informations (nom, numéro, etc.)
4. Clique sur "Enregistrer"
5. Les changements sont sauvegardés en base de données

### Utilisateur effectue un paiement
1. Accède à `/dashboard/payment?plan=pro`
2. La page récupère les méthodes via GET `/api/payment-methods`
3. Les informations à jour s'affichent
4. L'utilisateur sélectionne une méthode et soumet le formulaire
5. Le paiement est enregistré

## Points clés

✅ **Pas de redéploiement nécessaire** - Les modifications sont instantanément disponibles
✅ **Sécurité** - Les routes admin sont séparées des routes publiques
✅ **Flexibilité** - Facile d'ajouter d'autres méthodes (Wave, PayPal, etc.)
✅ **Performance** - Cache possible côté client ou CDN
✅ **UX** - L'utilisateur voit toujours les informations correctes

## Prochaines étapes (optionnel)

- Ajouter middleware d'authentification admin
- Implémenter le cache avec Redis
- Ajouter logs d'audit pour les modifications
- Créer webhooks pour notifier de changements
- Ajouter validation des numéros de compte
