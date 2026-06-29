# SellMemo - Le mémo intelligent des vendeurs

**Plateforme SaaS professionnelle pour gérer vos commandes facilement.**

## 🚀 À propos

SellMemo est une application web moderne conçue pour les vendeurs qui vendent principalement via WhatsApp, Facebook, Instagram et d'autres réseaux sociaux.

Le problème qu'elle résout :
- Les vendeurs oublient souvent des commandes
- Les livraisons sont oubliées
- Les clients ne sont pas mémorisés

**Solution** : SellMemo devient votre assistant personnel.

## ✨ Fonctionnalités principales

- ✅ Enregistrer une commande en moins de 15 secondes
- ✅ Gestion complète des commandes (créer, modifier, supprimer)
- ✅ Suivi des statuts de livraison
- ✅ Tableau de bord intuitif avec statistiques
- ✅ Système d'abonnement (Gratuit, Pro, Business)
- ✅ Paiement manual (Orange Money, MTN Mobile Money)
- ✅ Panneau administrateur
- ✅ Mode sombre
- ✅ Design premium et moderne

## 🛠️ Stack technique

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS, shadcn/ui
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL avec Prisma ORM
- **Authentification** : Auth.js / NextAuth
- **Déploiement** : Vercel, Neon (PostgreSQL)

## 📋 Plans tarifaires

| Plan | Prix | Commandes | Fonctionnalités |
|------|------|-----------|----------------|
| Gratuit | 0 FCFA/mois | 5 max | Tableau de bord, gestion basique |
| Pro | 500 FCFA/mois | Illimitées | + Support prioritaire |
| Business | 1000 FCFA/mois | Illimitées | + Stats avancées, Export PDF/Excel |

## 🔧 Installation locale

### Prérequis
- Node.js 18+
- npm ou yarn
- PostgreSQL (ou Neon)

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/lksecurity8-crypto/sellmemo.git
cd sellmemo
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

Modifiez `.env.local` avec vos valeurs :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sellmemo"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-key"
ADMIN_EMAIL="admin@sellmemo.com"
```

4. **Créer la base de données**
```bash
npm run db:push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvert [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🚀 Déploiement

### Vercel (Recommandé)

1. Poussez votre code sur GitHub
2. Connectez votre repository sur Vercel
3. Configurez les variables d'environnement dans Vercel
4. Déployez automatiquement

### PostgreSQL avec Neon

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez une base de données PostgreSQL
3. Copiez le `DATABASE_URL` dans vos variables d'environnement
4. Exécutez `npm run db:push`

## 📚 Structure du projet

```
sellmemo/
├── app/                    # Routes et pages Next.js
│   ├── api/               # API endpoints
│   ├── auth/              # Pages d'authentification
│   ├── dashboard/         # Tableau de bord
│   ├── admin/             # Panneau administrateur
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   └── ui/               # Composants shadcn/ui
├── lib/                   # Utilitaires
├── prisma/               # Schéma et migrations
├── public/               # Fichiers statiques
└── .env.example          # Template variables d'environnement
```

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/session` - Session actuelle

### Orders
- `GET /api/orders` - Lister les commandes
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id` - Modifier une commande
- `DELETE /api/orders/:id` - Supprimer une commande

### Payments
- `POST /api/payments` - Créer une demande de paiement
- `GET /api/payments` - Lister les paiements

### Admin
- `GET /api/admin/users` - Lister les utilisateurs
- `GET /api/admin/payments` - Lister les paiements
- `PUT /api/admin/payments/:id` - Approuver/Refuser un paiement

## 🎨 Design

- **Palette** : Bleu marine (#1f54d4) + Bleu clair (#0ea5e9)
- **Police** : Inter
- **Style** : Apple / Stripe / Linear
- **Mode** : Light & Dark

## 🤝 Contribution

Les contributions sont bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 License

MIT License - voir LICENSE pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion :
- Email : support@sellmemo.com
- Twitter : @sellmemo

---

**SellMemo - Votre assistant personnel de vendeur** 🎉
