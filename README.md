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

anschmit: Product Owner, Frontend (navbar, search, friends system)

hreusing: Project Manager, Setup with Docker/Postgresql/multiple users & Backend (Login & Authorization, Search, Friends System)

junruh: Tech Lead Backend, Backend (Chat, Availability, Profile settings)

nrauh: Tech Lead Frontend, Frontend (profile page, design system)

pbohme: Developer, Backend (Server Setup, Project Matching, nginx, public API)

## Project Management

At the beginning interests and availabilities were collected and roles were assigned accordingly.

Weekly Meeting with updates where everyone shared there progress and explained what they did and their code.

Miro was used as a PM-tool.
Github was used as a version control and branch system.
Online communication used slack.
Notion was used for Documentation.

## Technical Stack

Frontend: React, Tailwind
Backend: Fastify
Database: Prostgresql used with Prisma --> WHY used because of relational database capabilities

Libraries:

Justification

## Database Schema
This is your Prisma schema file

#### The TestUser represents each User and all their information and relations to e.g friendships, chats, and availability

```
model TestUser {
	id          Int      @id
	login       String   @unique

	intraEmail  	String?

	firstName   	String?
	lastName    	String?

	avatarUrl   	String?
	customAvatar	String?
	intraUrl    	String?
	
	campusId    	Int?
	campusName  	String?

	coalitionName	 String?
	coalitionSlug 	String?

	currentRank		Int?
	newCore			Boolean?
	bio				String?

	completedProjects Json?
	activeProjects    Json?

	availability	Availability?

	chats			Chat[]		@relation("UserToChat")
	sentMessages	ChatMessage[]
	isOnline		Boolean		@default(false)

	createdAt   DateTime @default(now())
	updatedAt   DateTime @updatedAt

	sentFriendships     Friendship[] @relation("SentFriendships")
  	receivedFriendships Friendship[] @relation("ReceivedFriendships")
}
```
#### The LoggesUser model is seperated from TestUser for transcendence purposes. In a real use case, the User will only login via 42 Authentication. No other Login is neccessary.
```
model LoggedUser {
	id				Int			@id @default(autoincrement())
	email			String		@unique
	password		String?
	createdAt		DateTime	@default(now())
}
```
#### Availability holds all information of the set availability of each profile
```
model Availability {
	id				Int			@id @default(autoincrement()) 
	user			TestUser		@relation(fields: [userId], references: [id])
	userId			Int			@unique
	usrId			Int?			@unique
	workDaysPerWeek	Int
	startDate		DateTime
	endDate			DateTime
	preferredDays	String[]
	isRemote		Boolean  	@default(false)
}
```
#### Chat and ChatMessages belong to the chat system. Chat relates to its users and ChatMessage holds each Message send to the chat and by which user.
```
model Chat {
	id				Int			@id @default(autoincrement()) 
	createdAt		DateTime	@default(now())
	updatedAt		DateTime	@updatedAt
	users			TestUser[]		@relation("UserToChat")
	messages		ChatMessage[]
}

model ChatMessage {
	id				Int			@id @default(autoincrement())
	chat			Chat		@relation(fields: [chatId], references: [id])
	chatId			Int
	sender			TestUser		@relation(fields: [senderId], references: [id])
	senderId		Int
	createdAt		DateTime	@default(now())
	content			String
}
```
#### Friendship carries the user ids of the sending and receiving user as well as the status, if the request is pending or accepted
```
model Friendship {
  id          Int              @id @default(autoincrement())
  
  senderId    Int
  sender      TestUser             @relation("SentFriendships", fields: [senderId], references: [id], onDelete: Cascade)

  receiverId  Int
  receiver    TestUser             @relation("ReceivedFriendships", fields: [receiverId], references: [id], onDelete: Cascade)

  status      FriendshipStatus @default(PENDING)

  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@unique([senderId, receiverId])
}
```
#### Blacklisted tokens are needed for web security.
```
model BlacklistedTokens {
	id				Int			@id @default(autoincrement())
	token			String		@unique
	expiresAt		DateTime
	createdAt		DateTime	@default(now())
}
```
#### Status categories
```
enum Status {
	NOT_STARTED
	IN_PROGRESS
	FINISHED
}

enum FriendshipStatus {
  PENDING
  ACCEPTED
}
```
## Features List

- See upcoming group projects and possible students (pbohme, nrauh)
- Chat with other students and see if they want to do a project together (junruh, anschmit, nrauh)
- See and edit your profile information, such as your availability and profile picture (nrauh, junruh)
- Add students as friends and see if they're online to chat. (hreusing, anschmit)
- Get project information (pbohme, nrauh)
- Authentication with 42 (hreusing)

## Modules

 2 pts - **Major: Use a framework for both the frontend and backend.**
 - React for frontend and Fastify for backend were chosen, because they are state of the art, commonly used and well documented. We chose Fastify over Express because it is more modern and will continue to grow

 2 pts - **Major: Implement real-time features using WebSockets or similar technology.**
 - for Chats we need Websockets and real-time updates

 2 pts - **Major: Allow users to interact with other users.**
 - that is the base for chats

 2 pts - **Major: A public API to interact with the database with a secured API key, rate limiting, documentation, and at least 5 endpoints:**
 - by having a public API other applications can use our data to display

 2 pts - **Major: Standard user management and authentication.**
 - our app hold user specific data that only the user themself should be able to edit, so a login is neccessary

 1 pt - **Minor: Use an ORM for the database.**
 - our data is intertwined so an ORM made the most sense

 1 pt - **Minor: A complete notification system for all creation, update, and deletion actions**
 - for changing a profile page or adding a friend, a notification elevates the user experience

 1 pt - **Minor: Custom-made design system**
 - we wanted a cohesive design and the frontend team developed wireframes and components early on to work with lateron

 1 pt - **Minor: Support for additional browsers.**
 - we want our app to be used by a wide variety of students with different needs

 1 pt - **Minor: Implement remote authentication with OAuth 2.0 (Google, Github, 42, etc.)**
 - our app is used only inside 42, so an authentication for 42 students is neccessary

 1 pt - **Minor: Implement advanced search functionality with filters, sorting, and pagination.**
 - with many search results filtering and sorting enhances the user experience

= 16 pts

## Individual Contributions

- **Major: Use a framework for both the frontend and backend.**
    - **anschmit & nrauh**: Use a frontend framework (React, Vue, Angular, Svelte, etc.). 
    - **pbohme & junruh**: Use a backend framework (Express, NestJS, Django, Flask, Ruby on Rails,
    etc.).



- **Major: Implement real-time features using WebSockets or similar technology.**
    - **junruh & nrauh**: Real-time updates across clients. → Frontend
    - **junruh**: Handle connection/disconnection gracefully.
    - **junruh & nrauh**: Efficient message broadcasting → Frontend



- **Major: Allow users to interact with other users. The minimum requirements are:**
    - **junruh**: A basic chat system (send/receive messages between users).
    - **nrauh & junruh**: A profile system (view user information).
    - **anschmit & hreusing**: A friends system (add/remove friends, see friends list)


- **Major: A public API to interact with the database with a secured API key, rate limiting, documentation, and at least 5 endpoints:**
    - **pbohme**:
	- GET /api/{something}
    - POST /api/{something}
    - PUT /api/{something}
    - DELETE /api/{something}


- **Minor: Use an ORM for the database.**
    - hreusing



- **Minor: A complete notification system for all creation, update, and deletion actions**
    - anschmit



- **Minor: Custom-made design system**
    - **nrauh & anschmit**: with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components).



- **Minor: Support for additional browsers.**
	- **pbohme**:
    - Full compatibility with at least 2 additional browsers (Firefox, Safari, Edge, etc.).
    - Test and fix all features in each browser.
    - Document any browser-specific limitations.
    - Consistent UI/UX across all supported browsers
    
    
    
- **Major: Standard user management and authentication.**
    - **nrauh & junruh**: Users can update their profile information.
    - **nrauh & junruh**: Users can upload an avatar (with a default avatar if none provided).
    - **hreusing & anschmit**: Users can add other users as friends and see their online status.
    - **nrauh**: Users have a profile page displaying their information


- **Minor: Implement remote authentication with OAuth 2.0 (Google, Github, 42, etc.)**
    - hreusing

- **Minor: Implement advanced search functionality with filters, sorting, and pagination.**
    - hreusing & pbohme


#### Challenges
- time pressure at the end
- frontend vs. backend distribution makes sense, but not in every case. Sometimes a feature based distribution may have made working more efficiently
- keep regular meetings and vacations
- room capacities at 42berlin