# 🎄 Liste de Noël

Site de liste de cadeaux interactif avec réservation partagée en temps réel.

## Déploiement sur Vercel

### 1. Créer un dépôt GitHub et pousser ce dossier

```bash
cd christmas-list
git init
git add .
git commit -m "Liste de Noël"
gh repo create christmas-list --public --source=. --push
```

### 2. Connecter à Vercel

Allez sur [vercel.com](https://vercel.com) → **Add New Project** → importez le dépôt GitHub.

Ou via CLI :
```bash
npx vercel
```

### 3. Ajouter le stockage Vercel KV

Dans le tableau de bord Vercel de votre projet :

1. **Storage** → **Create Database** → **KV**
2. Nommez-la (ex: `christmas-reservations`)
3. **Create & Continue** → **Connect Project** → sélectionnez votre projet
4. Redéployez : `npx vercel --prod`

C'est tout ! Les réservations sont maintenant persistantes et partagées entre tous les visiteurs.

## Structure

```
christmas-list/
├── api/
│   ├── reservations.js     # GET /api/reservations
│   └── gift/
│       └── [id].js         # POST /api/gift/{id}
├── public/
│   └── index.html          # Le site complet
└── package.json
```

## Variables d'environnement

Vercel KV injecte automatiquement :
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Aucune configuration manuelle nécessaire.

## Fonctionnement

- `/api/reservations` retourne l'état de toutes les réservations
- `/api/gift/{id}` réserve un cadeau (atomic avec `nx: true` sur Redis)
- Le frontend recharge automatiquement toutes les 30 secondes
