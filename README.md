This project has been created as part of the 42 curriculum by anschmit[, hreusing[, junruh[, nrauh[, pbohme]]]].

## Description 

This project, named "Clusterfuck" is a web application for 42berlin students. Students can find potential team members for their group projects. When the user is on a rank with group projects, they can see their upcoming group projects and see who else on campus needs to do those projects as well. They can message other students and add them as friends. Every user can also add their availability to their profile so everyone can see if the availability matches their needs - including preferred workdays and workplace.

On the login page you need to register, if it is your first time, with an email and a password, that needs to be 6 letters long. When you're already registered you just need to login with your email and password. After login you need to verify that you are a 42 student by authorizing your 42 intra account. This way the application gets all your 42 info, including your intra, mail, rank, etc.

The dashboard page includes a section for the upcoming group projects you still need to do and a section of your achievements.

You can search for users and projects or look at your upcoming projects to find students to team up with.

Under your chats you can find every message you wrote and start a new chat.

On the friends page you can see all your friendsand their online status and the students who requested you as a friend. You can accept the friend request on your friends page. You can add/remove friends on the profile page of the user.

On your own profile page you can change your profile picture and add/change your availability.

## Instructions

Prerequisits:
- install docker
- .env needs to be in folder next to docker-compose and contain the database url, the id, the secret and the redirect uri for the 42 API

To start:
Simply make



## Resources

Scrimba for learning react and sql
fastify server 
docker documentation

AI was used 
to get explanations of complex issues
for problem solving, like understanding error messages
get step by step suggestions for complex features

## Team Information

anschmit: Product Owner, Frontend (---)

hreusing: Project Manager, Setup with Docker/Postgresql/multiple users & Backend (Login & Authorization, Search, Friends System)

junruh: Tech Lead Backend, Backend (Chat, Availability, Profile settings)

nrauh: Tech Lead Frontend, Frontend (---)

pbohme: Developer, Backend (Server Setup, Project Matching, nginx)

## Project Management

At the beginning interests and availabilities were collected and roles were assigned accordingly.

Weekly Meeting with updates where everyone shared there progress and explained what they did and their code.

Miro was used as a PM-tool.
Github was used as a version control and branch system.
Online communication used slack.

## Technical Stack

Frontend: React, Tailwind
Backend: Fastify
Database: Prostgresql used with Prisma --> WHY used because of relational database capabilities

Libraries:

Justification

## Database Schema

VISUAL REPRESENTAION

## Features List

## Modules

## Individual Contributions

- [x]  2 Punkte - **Major: Use a framework for both the frontend and backend.**
    - [x]  Use a frontend framework (React, Vue, Angular, Svelte, etc.).
    - [x]  Use a backend framework (Express, NestJS, Django, Flask, Ruby on Rails,
    etc.).

!image.png

- [ ]  2 Punkte (Jake) - **Implement real-time features using WebSockets or similar technology.**
    - [ ]  Real-time updates across clients. → Frontend
    - [x]  Handle connection/disconnection gracefully.
    - [ ]  Efficient message broadcasting → Frontend

!image.png

- [ ]  2 Punkte - **Major: Allow users to interact with other users. The minimum requirements are:**
    - [ ]  A basic chat system (send/receive messages between users). (Jake)
        - [ ]  Anzeige im Frontend fehlt (man kann nur user anklicken → kein chat oeffnet sich) (Natatlie, Jake)
    - [ ]  A profile system (view user information).
        - [ ]  Bugfixing: Rank 0 und coalition null (Natalie)
        - [ ]  und “Rank: Fulgens” (Natalie)
    - [ ]  A friends system (add/remove friends, see friends list) (Hannah & Anna)
        - [ ]  add friend button (Anna & Hannah)

!image.png

- [x]  2 Punkte (Pia) - **Major: A public API to interact with the database with a secured API key, rate
limiting, documentation, and at least 5 endpoints:**
    - [x]  GET /api/{something}
    - [x]  POST /api/{something}
    - [x]  PUT /api/{something}
    - [x]  DELETE /api/{something}
        - [x]  umbauen!! (PIA)

!image.png

- [x]  1 Punkt - **Minor**: **Use an ORM for the database.**
    - [x]  Prisma ist ein ORM (Hannah

!image.png

- [x]  1 Punkt - **Minor: A complete notification system for all creation, update, and deletion ac-
tions**
    - [x]  Anna

!image.png

- [x]  1 Punkt (Natalie & Anna) - **Minor: Custom-made design system**
    - [x]  with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components).

!image.png

- [ ]  1 Punkt - **Minor: Support for additional browsers.**
    - [ ]  muss getestet werden: (PIA)
    - [ ]  Full compatibility with at least 2 additional browsers (Firefox, Safari, Edge,
    etc.).
    - [ ]  Test and fix all features in each browser.
    - [ ]  Document any browser-specific limitations.
    - [ ]  Consistent UI/UX across all supported browsers
    
    !image.png
    
- [ ]  2 Punkte - **Major: Standard user management and authentication.**
    - [ ]  Users can update their profile information.
    - [x]  Users can upload an avatar (with a default avatar if none provided).
    - [ ]  Users can add other users as friends and see their online status.
    - [x]  Users have a profile page displaying their information
        - [ ]  an sich alles angelegt, aber volle funktionsfaehigkeit noch nciht gegeben

!image.png

- [x]  1 Punkt - Minor: Implement remote authentication with OAuth 2.0 (Google, Github, 42, etc.)
    - [x]  42 (Hannah)

!image.png

## Unsure if we have it:

- [ ]  1 Punkt
    - [ ]  welche file types gehen ? verscheidene image files, aber keine txt files ?
    - [ ]  progress indicator? einfach zu implementieren?
    
    !image.png
    
- [x]  1 Punkt: Implement advanced search functionality (Hannah)
    - [ ]  bietet sich fuer projectmatching an (filtern nach rank etc → endpoints sind alle da, fehlt eigentlich nur filter button)

!image.png

## Possible for more points:

- [ ]  (1 Punkt)

!image.png

- [ ]  

# Andere Requirements

- [x]  The project must be a web application, and requires a frontend, backend, and a
database.
- [x]  Git must be used with clear and meaningful commit messages. The repository must
show:
◦ Commits from all team members.
◦ Clear commit messages describing the changes.
◦ Proper work distribution across the team
- [x]  Deployment must use a containerization solution (Docker, Podman, or equiva-
lent)
    - [x]  and run with a single command.
- [x]  Your website must be compatible with the latest stable version of Google Chrome.
- [ ]  No warnings or errors should appear in the browser console.
    - [ ]  offen lassen → erst am ende alles testen!
- [ ]  The project must include accessible Privacy Policy and Terms of Service pages
with relevant content (JAKE)
    - [ ]  Privacy Policy and Terms of Service: These pages will be verified
    during evaluation. They must:
    • Be easily accessible from the application (e.g., footer links).
    • Contain relevant and appropriate content for your project.
    • Not be placeholder or empty pages.
    Missing or inadequate Privacy Policy/Terms of Service pages will
    result in project rejection
- [ ]  Multi-user Support (Mandatory): Your website must support multiple
users simultaneously. This is a core requirement of the project.
Users should be able to interact with the application at the same
time without conflicts or performance issues. This includes:
• Multiple users can be logged in and active at the same time.
• Concurrent actions by different users are handled properly.
• Real-time updates are reflected across all connected users when
applicable.
• No data corruption or race conditions occur with simultaneous
user actions
    - [ ]  muessen wir an dem eval tag einrichten (HANNAH)
    - [ ]  im API project aendern (PIA)
- [x]  A frontend that is clear, responsive, and accessible across all devices.
- [x]  Use a CSS framework or styling solution of your choice (e.g., Tailwind CSS,
Bootstrap, Material-UI, Styled Components, etc.).
- [x]  Store credentials (API keys, environment variables, etc.) in a local .env file that is
ignored by Git, and provide an .env.example file.
- [x]  The database must have a clear schema and well-defined relations.
- [x]  Your application must have a basic user management system. Users must be
able to sign up and log in securely: (Hannah)
◦ At minimum: email and password authentication with proper security (hashed
passwords, salted, etc.).
◦ Additional authentication methods (OAuth, 2FA, etc.) can be implemented
via modules.
- [x]  All forms and user inputs must be properly validated in both the frontend and
backend.
- [ ]  For the backend, HTTPS must be used everywhere. NUR mit dieser .env!
    
    ```jsx
    FT_ID="u-s4t2ud-64c36487b0814f57872132c861cfa15ad40974008abc06885d36fbe03d67f84e"
    FT_SECRET="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"
    FT_REDIRECT_URI=https://localhost:8443/api/auth/42/callback
    DATABASE_URL=postgresql://pguser:1234@postgres:5432/postgres
    ```
    
- [ ]  README (Hannah)

- [x]  frontend must be responsive
- [ ]  .env.example file muessen wir providen
- [ ]  

