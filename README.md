# SocialHub

A full-stack social media application built with React, TypeScript, and Node.js. Supports posts, comments, likes, follows, and stories.

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Redux Toolkit — state management
- Material UI — component library
- React Router v6 — routing
- Axios — HTTP client
- Vite — build tool

**Backend**
- Node.js + Express.js
- JWT — authentication
- bcryptjs — password hashing
- Multer — file uploads
- JSON file — database (`db.json`)

## Features

- Register / Login with JWT auth
- Create, delete, and like posts
- Comment on posts
- Follow / unfollow users
- User suggestions
- Stories bar
- Dark mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/meeeeeeerik/social-app.git
cd social-app
```

2. Install dependencies for both client and server

```bash
cd client && npm install
cd ../server && npm install
```

### Running the app

Start the backend (runs on port 4000):

```bash
cd server
npm run dev
```

Start the frontend (runs on port 5173):

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Demo Accounts

| Email | Password |
|---|---|
| alex@demo.com | password |
| sarah@demo.com | password |
| marcus@demo.com | password |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/posts` | Get feed posts |
| POST | `/api/posts` | Create post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like / unlike post |
| POST | `/api/comments` | Add comment |
| DELETE | `/api/comments` | Delete comment |
| GET | `/api/users` | Get users |
| PUT | `/api/users` | Update profile |
| POST | `/api/users/:id/follow` | Follow / unfollow user |
| GET | `/api/users/:id/suggestions` | Get suggested users |
| GET | `/api/stories` | Get stories |

## Project Structure

```
social-app/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── features/     # Redux slices
│   │   ├── pages/        # Route pages
│   │   └── types/        # TypeScript types
│   └── package.json
└── server/          # Express backend
    ├── routes/      # API route handlers
    ├── middleware/  # Auth middleware
    ├── db.json      # JSON database
    └── index.js
```

## License

MIT
