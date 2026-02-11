# SocialMediaSlop

Une application de réseau social moderne construite avec **Next.js**, **TypeScript**, **SQLite** et **Tailwind CSS**.

## 📋 Description

SocialMediaSlop est une plateforme de partage social qui permet aux utilisateurs de :
- 👤 Créer un compte et gérer leur profil
- 📝 Publier des posts avec du texte et des images
- ❤️ Liker les posts d'autres utilisateurs
- 👥 Suivre d'autres utilisateurs
- 🔐 S'authentifier de manière sécurisée avec JWT

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

1. Clonez le projet et installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📦 Stack technologique

- **Frontend** : [Next.js 16](https://nextjs.org) avec [React 19](https://react.dev)
- **Styling** : [Tailwind CSS](https://tailwindcss.com)
- **Base de données** : [SQLite](https://www.sqlite.org)
- **Authentification** : [JWT](https://jwt.io) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Langage** : [TypeScript](https://www.typescriptlang.org)

## 📁 Structure du projet

```
app/
├── api/                 # Routes API (login, register, posts, likes, followers)
├── components/          # Composants réutilisables (Button, PostCard, etc.)
├── models/              # Modèles de données (User, Post, Like, Follow)
├── lib/                 # Utilitaires (auth, jwt, validations, db)
├── feed/                # Page du flux
├── login/               # Page de connexion
├── register/            # Page d'inscription
├── profile/             # Pages de profil
└── post/                # Page détail d'un post
```

## 🔑 Fonctionnalités principales

### Authentification
- Inscription et connexion sécurisées
- Tokens JWT pour les sessions
- Hachage des mots de passe avec bcryptjs

### Gestion des posts
- Créer, lire et supprimer des posts
- Support des images
- Système de likes
- Compteur de likes

### Profil utilisateur
- Voir et modifier son profil
- Afficher les posts de l'utilisateur
- Gestion des followers

## 🛠️ Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile le projet
- `npm start` - Lance le serveur en production

## 📝 API Endpoints

- `POST /api/register` - Créer un nouveau compte
- `POST /api/login` - Se connecter
- `GET /api/posts` - Récupérer tous les posts
- `POST /api/createPost` - Créer un post
- `POST /api/like/[postId]` - Liker un post
- `GET /api/user/[id]` - Récupérer les infos d'un utilisateur
- `GET /api/followers/count/[userId]` - Compter les followers

## 🔒 Sécurité

- Mots de passe hachés avec bcryptjs
- Tokens JWT pour l'authentification
- Protection des routes API sensibles
