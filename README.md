# ITC Hub

Website of the **IT Community (ITC)** club, Saad Dahleb University of Blida.
Members can browse events, register for them and chat with an AI assistant.

## Features
- Sign up, log in, log out
- Events list and event details
- Event registration
- Admin page to create events
- AI chatbot that knows the club's events
- 3 languages: Français, English, العربية (with right-to-left layout)
- Cyberpunk design in ITC colors, mobile friendly

## Tech stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **AI**: Ollama (llama3.2 model, running locally)

## Run the project

**Requirements**: Node.js, a MongoDB Atlas cluster, Ollama (`ollama pull llama3.2`).

**1. Backend**
```bash
cd backend
npm install
npm run dev
```
Copy `.env.example` to `.env` and fill in your values.

**2. Frontend** (in another terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Become an admin
In MongoDB Atlas, open the `users` collection, change `role` from `"member"` to `"admin"`, then log in again.

## Project structure
```
itc-hub/
├── frontend/   (React: pages, API, languages)
├── backend/    (Express: routes, models, middleware)
└── README.md
```

## Security
- Passwords hashed with bcrypt
- Token stored in an httpOnly cookie
- No secrets on GitHub (`.env` is ignored)

## Not done yet
Chat streaming, Redis cache, AWS deployment.


## Author
[chakib oudineche]