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

create all images in goinfre

Open your config: nano ~/.zshrc

Add this line at the bottom:

```bash
alias docker-clean='pkill -9 -u $(whoami) -f "docker|rootlesskit|containerd" && rm -rf /run/user/$(id -u)/dockerd-rootless /run/user/$(id -u)/docker.sock && echo "Docker processes cleaned."'

alias start-docker='dockerd-rootless.sh --data-root /home/$USER/goinfre/docker_storage'
```

Save and exit (Ctrl+O, Enter, Ctrl+X).

Apply changes: source ~/.zshrc

Start docker:
- close VS-Code
```bash
docker-clean
start-docker
```


Error Handling:

error: failed to lock /run/user/102526/dockerd-rootless/lock, another RootlessKit is running with the same state directory?

```bash
killall -9 dockerd rootlesskit containerd
```

```bash
rm -rf /run/user/102526/dockerd-rootless
```

You can test if a process still runs. The output should look like this:
- one root process
- one grep process

```bash
c0c6c3% ps aux | grep docker
root        1677  0.0  0.5 3023824 80860 ?       Ssl  08:40   0:03 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
hreusing   32025  0.0  0.0   8852  2460 pts/0    S+   13:15   0:00 grep docker
```

if not try (close VS-Code)
```bash
kill -9 <PID> <PID>
```

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

you can install the prisma extension in VS Code

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

```txt
Prisma runs on
http://localhost:5555
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

## Check out API

checkUser & checkQuest are two functions where you can see the data coming from the API
To get the output simply use in de backend directory:

```bash
npx ts-node src/data/checkQuest.ts
```

or

```bash
npx ts-node src/data/checkUser.ts
```

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
