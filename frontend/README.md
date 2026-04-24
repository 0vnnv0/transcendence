# How to use

To install all dependencies navigate inside the frontend folder and run:

```js
npm install
```

To start the frontend server run:

```js
npm run dev
```

To test a component for now, load it into the App.tsx file. Create a component inside the Components folder.


## Folder Structure in /src
```
src/
├── assets/          # Images, icons, fonts (e.g., logo.svg)
├── components/      # Reusable UI "building blocks" (Buttons, Inputs, Cards)
│   ├── ui/          # Generic "dumb" components (e.g., Button.tsx, Modal.tsx)
│   └── layout/      # Shared layout parts (Navbar.tsx, Sidebar.tsx, Footer.tsx)
├── features/        # Logic-specific components (e.g., Profile/, Chat/, Auth/)
├── hooks/           # Custom React hooks (e.g., useAuth.ts)
├── pages/           # High-level page components (Home.tsx, Login.tsx, Settings.tsx)
├── services/        # API calls (Axios/Fetch logic)
├── types/           # TypeScript interfaces and types
├── utils/           # Helper functions (formatDate.ts, validation.ts)
├── App.tsx          # Main entry point for routing and layout
├── index.css        # Tailwind imports and global styles
└── main.tsx         # The React mounting point
```
