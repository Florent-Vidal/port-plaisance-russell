# 🚤 Port de Plaisance Russell

Application web de gestion d'un port de plaisance : les capitaineries y gèrent les
**catways** (pontons d'amarrage), les **réservations** des plaisanciers et les
**comptes utilisateurs** de l'équipe.

Le projet associe une **API REST** sécurisée par JWT et une **interface
d'administration** rendue côté serveur avec EJS, le tout adossé à une base
**MongoDB**.

Projet réalisé dans le cadre de la formation Développeur Web et Web Mobile du
Centre Européen de Formation.

---

## Fonctionnalités

- Inscription et connexion, mots de passe hachés avec bcrypt
- Authentification par token JWT sur toutes les routes de gestion
- CRUD complet des catways, des réservations et des utilisateurs
- Validation des données au niveau du modèle (champs requis, longueurs, format
  d'email, date de fin postérieure à la date de début)
- Tableau de bord et pages de gestion rendus avec EJS
- Route de santé pour la supervision (`/health`)

---

## Stack technique

| Domaine          | Outils                                  |
| ---------------- | --------------------------------------- |
| Serveur          | Node.js, Express 5                      |
| Base de données  | MongoDB, Mongoose 9                     |
| Sécurité         | JSON Web Token, bcryptjs                |
| Vues             | EJS                                     |
| Outils           | dotenv, nodemon                         |

---

## Prérequis

- Node.js
- npm
- Une base MongoDB : installation locale **ou** cluster MongoDB Atlas

---

## Installation

```bash
# Cloner le projet
git clone https://github.com/Florent-Vidal/port-plaisance-russell.git
cd port-plaisance-russell

# Installer les dépendances
npm install

# Créer le fichier d'environnement à partir du modèle
cp .env.example .env
```

Renseigner ensuite les valeurs du fichier `.env` :

| Variable         | Rôle                                                    |
| ---------------- | ------------------------------------------------------- |
| `PORT`           | Port d'écoute du serveur (3000 par défaut)              |
| `MONGODB_URI`    | Chaîne de connexion MongoDB (locale ou Atlas)           |
| `JWT_SECRET`     | Clé de signature des tokens — longue chaîne aléatoire   |
| `JWT_EXPIRE`     | Durée de validité d'un token, par exemple `24h`         |
| `SESSION_SECRET` | Clé de signature des sessions                           |
| `NODE_ENV`       | `development` ou `production`                           |

Le serveur refuse de démarrer si `MONGODB_URI` est absente.

---

## Lancement

```bash
# Mode développement (redémarrage automatique)
npm run dev

# Mode production
npm start
```

L'application est alors disponible sur `http://localhost:3000`.

---

## Interface

| Page            | Route           |
| --------------- | --------------- |
| Accueil         | `/`             |
| Inscription     | `/register`     |
| Tableau de bord | `/dashboard`    |
| Catways         | `/catways`      |
| Réservations    | `/reservations` |
| Utilisateurs    | `/users`        |
| Santé du serveur| `/health`       |

---

## API

Toutes les routes marquées 🔒 exigent un token JWT dans l'en-tête :

```
Authorization: Bearer <token>
```

Un token absent renvoie `401`, un token invalide ou expiré renvoie `403`.

### Authentification

| Méthode | Route                | Description                  | Auth |
| ------- | -------------------- | ---------------------------- | ---- |
| POST    | `/api/auth/register` | Créer un compte              |      |
| POST    | `/api/auth/login`    | Se connecter, obtenir un token |    |
| GET     | `/api/auth/logout`   | Se déconnecter               |      |

### Utilisateurs

| Méthode | Route                | Description                   | Auth |
| ------- | -------------------- | ----------------------------- | ---- |
| GET     | `/api/users`         | Lister les utilisateurs       | 🔒   |
| GET     | `/api/users/:email`  | Détail d'un utilisateur       | 🔒   |
| POST    | `/api/users`         | Créer un utilisateur          | 🔒   |
| PUT     | `/api/users/:email`  | Modifier un utilisateur       | 🔒   |
| DELETE  | `/api/users/:email`  | Supprimer un utilisateur      | 🔒   |

### Catways

`:id` accepte le numéro du catway ou son identifiant MongoDB.

| Méthode | Route               | Description                          | Auth |
| ------- | ------------------- | ------------------------------------ | ---- |
| GET     | `/api/catways`      | Lister les catways                   | 🔒   |
| GET     | `/api/catways/:id`  | Détail d'un catway                   | 🔒   |
| POST    | `/api/catways`      | Créer un catway                      | 🔒   |
| PUT     | `/api/catways/:id`  | Modifier l'état d'un catway          | 🔒   |
| DELETE  | `/api/catways/:id`  | Supprimer un catway                  | 🔒   |

### Réservations

| Méthode | Route                                            | Description                        | Auth |
| ------- | ------------------------------------------------ | ---------------------------------- | ---- |
| GET     | `/api/catways/reservations/all`                  | Lister toutes les réservations     | 🔒   |
| GET     | `/api/catways/:id/reservations`                  | Réservations d'un catway           | 🔒   |
| GET     | `/api/catways/:id/reservations/:idReservation`   | Détail d'une réservation           | 🔒   |
| POST    | `/api/catways/:id/reservations`                  | Créer une réservation              | 🔒   |
| PUT     | `/api/catways/:id/reservations/:idReservation`   | Modifier une réservation           | 🔒   |
| DELETE  | `/api/catways/:id/reservations/:idReservation`   | Supprimer une réservation          | 🔒   |

---

## Exemples d'utilisation

### 1. Se connecter

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "capitaine@port-russell.fr", "password": "motdepasse"}'
```

Réponse :

```json
{
  "success": true,
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "username": "capitaine", "email": "capitaine@port-russell.fr" }
}
```

Le `token` est à réutiliser dans l'en-tête `Authorization` des requêtes suivantes.

### 2. Créer un catway

```bash
curl -X POST http://localhost:3000/api/catways \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"catwayNumber": 1, "catwayType": "long", "catwayState": "Bon état"}'
```

`catwayType` accepte `long` ou `short`.

### 3. Créer une réservation

```bash
curl -X POST http://localhost:3000/api/catways/1/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "clientName": "Jean Dupont",
    "boatName": "Le Navigateur",
    "startDate": "2026-07-01",
    "endDate": "2026-07-15"
  }'
```

---

## Structure du projet

```
port-plaisance-russell/
├── app.js              point d'entrée : middlewares, vues, montage des routes
├── config/db.js        connexion MongoDB
├── controllers/        logique métier (auth, catways, réservations, utilisateurs)
├── middleware/         vérification du token JWT
├── models/             schémas Mongoose (Catway, Reservation, User)
├── routes/             définition des routes de l'API
├── views/              pages EJS de l'interface
├── public/             fichiers statiques
└── data/               jeux de données initiaux (JSON)
```

---

## Auteur

**Florent Vidal** — Développeur Web et Web Mobile, Centre Européen de Formation.
[github.com/Florent-Vidal](https://github.com/Florent-Vidal)
