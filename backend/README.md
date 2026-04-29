# Transcendence Backend (Fastify + Socket.IO)

## Overview

This is the backend prototype for our Transcendence project.

Current features:

* Fastify server
* Socket.IO integration
* TypeScript setup
* Dummy user generation
* User filtering
* Chat route simulation

---

# Tech Stack

* TypeScript
* Fastify
* Socket.IO
* Node.js

Planned later:

* React + Vite frontend
* PostgreSQL
* Prisma ORM
* Real-time chat
* Matching algorithm

---

# Project Structure

```txt
backend/
│
├── src/
│   ├── data/
│   │   └── loadUsers.ts
│   │
│   ├── routes/
│   │   ├── displayUsers.ts
│   │   └── chatRoutes.ts
│   │
│   ├── services/
│   │   └── filterUsers.ts
│   │
│   ├── types/
│   │   └── User.ts
│   │
│   ├── serverSetup.ts
│   ├── sockets.ts
│   └── index.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# Installation

## Clone project

```bash
git clone <repository>
cd backend
```

---

## Install dependencies

```bash
npm install
```


Docker (install without root priviliges)
```bash
dockerd-rootless-setuptool.sh install
```
---


---

# Required Packages

Main dependencies:

```bash
npm install fastify socket.io @fastify/cors
```

Development dependencies:

```bash
npm install -D typescript ts-node-dev @types/node
```

---

# Running the Server

Start development server:

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:3000
```

---

# Available Routes

## Get all users

```txt
GET /users
```

Example:

```bash
curl "http://localhost:3000/users"
```

---

## Filter users

Filter by campus:

```txt
GET /users?campus=Berlin
```

Filter by rank:

```txt
GET /users?rank=3
```

Combine filters:

```txt
GET /users?campus=Berlin&rank=3
```

Examples:

```bash
curl "http://localhost:3000/users?campus=Berlin"

curl "http://localhost:3000/users?campus=Berlin&rank=3"
```

---

## Chat simulation route

Single user:

```txt
GET /chat?id=2
```

Multiple users:

```txt
GET /chat?id=2&id=5&id=9
```

Examples:

```bash
curl "http://localhost:3000/chat?id=2"

curl "http://localhost:3000/chat?id=2&id=5&id=9"
```

---

# Dummy User System

Users are currently generated dynamically in:

```txt
src/data/loadUsers.ts
```

Each user contains:

* id
* login
* campus
* rank

Data is currently stored in-memory.

Later this will be replaced by:

* PostgreSQL
* Prisma ORM

---

# Current Architecture

* Fastify handles REST API routes
* Socket.IO handles realtime communication
* Dummy data simulates database users
* Services contain reusable logic (e.g. filtering)

---

# Future Improvements

Planned next steps:

* React frontend
* Real chat UI
* Socket.IO messaging
* User matching algorithm
* Database integration with Prisma + PostgreSQL
* Authentication system
* Chat rooms
