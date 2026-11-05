# ITC Hub

Site web du club **IT Community (ITC)**, Université Saad Dahleb Blida.
Les membres peuvent voir les événements, s'inscrire, et discuter avec un chatbot IA.

> Sharing Is Caring

## Fonctionnalités

- Inscription, connexion et déconnexion (JWT dans un cookie httpOnly)
- Liste des événements et page de détails
- Inscription à un événement (capacité limitée, pas de doublon)
- Création d'événements réservée aux administrateurs
- Chatbot « ITC Assistant » qui répond à partir des événements de la base
- Design cyberpunk aux couleurs ITC (rouge, noir, blanc), adapté au mobile

## Technologies

| Partie | Outils |
|---|---|
| Frontend | React, Vite, React Router |
| Backend | Node.js, Express |
| Base de données | MongoDB (Atlas), Mongoose |
| IA | Ollama (llama3.2) en local |
| Sécurité | bcryptjs, JWT, helmet, cors, express-rate-limit |

## Structure du projet

```
itc-hub/
├── frontend/   (React : pages, API, contexte d'authentification)
│   └── src/
│       ├── pages/ (Home, Events, EventDetails, Login, Register, Chat)
│       ├── api.js
│       ├── AuthContext.jsx
│       └── App.jsx
├── backend/    (API Express)
│   ├── models/      (User, Event, Registration, Message)
│   ├── routes/      (auth, events, chat)
│   ├── middleware/  (auth)
│   └── server.js
└── README.md
```

## Lancer le projet en local

### 1. Prérequis
- Node.js (version LTS)
- Un cluster MongoDB Atlas (ou MongoDB local)
- Ollama avec le modèle : `ollama pull llama3.2`

### 2. Backend
```bash
cd backend
npm install
```
Copie `.env.example` en `.env` et remplis tes valeurs :
```
PORT=5000
MONGO_URI=...
JWT_SECRET=...
CLIENT_URL=http://localhost:5173
OLLAMA_URL=http://127.0.0.1:11434
```
Puis :
```bash
npm run dev
```
Tu dois voir `MongoDB connecté` et `API sur le port 5000`.

### 3. Frontend
Dans un second terminal :
```bash
cd frontend
npm install
```
Copie `.env.example` en `.env` :
```
VITE_API_URL=http://localhost:5000
```
Puis :
```bash
npm run dev
```
Ouvre `http://localhost:5173`.

## Variables d'environnement

| Variable | Où | Rôle |
|---|---|---|
| PORT | backend | Port de l'API |
| MONGO_URI | backend | Adresse de MongoDB |
| JWT_SECRET | backend | Clé de signature des tokens |
| CLIENT_URL | backend | Adresse du frontend (CORS) |
| OLLAMA_URL | backend | Adresse d'Ollama |
| VITE_API_URL | frontend | Adresse de l'API |

Les fichiers `.env` ne sont jamais envoyés sur GitHub.

## API principale

| Méthode | Route | Accès |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/auth/me | connecté |
| POST | /api/auth/logout | public |
| GET | /api/events | public |
| GET | /api/events/:id | public |
| POST | /api/events | admin |
| POST | /api/events/:id/register | connecté |
| POST | /api/chat | connecté |
| GET | /api/chat/history | connecté |
| GET | /api/health | public |

Format des erreurs : `{ "success": false, "error": { "code": "...", "message": "..." } }`

## Architecture

```
Navigateur (React) ──fetch──▶ Express (API) ──Mongoose──▶ MongoDB
                                  │
                                  └──▶ Ollama (chatbot)
```

## Sécurité

- Mots de passe chiffrés avec bcrypt
- Cookie `httpOnly` pour le token
- CORS limité au frontend
- Limite de 20 messages par minute sur le chat
- Aucune clé ni mot de passe dans le code

## Ce qui reste à faire
- [ ] Streaming des réponses du chat
- [ ] Cache Redis
- [ ] Déploiement AWS

## Démo
[Lien vers la vidéo de démonstration]

## Auteur
[Ton nom], membre ITC