# MERN Stack Task Management Dashboard
A full-stack responsive web application featuring secure user authentication, profile management, and a real-time task manager with complete CRUD functionality.

##🚀 Live Demo
Frontend: [(https://dashboard-five-omega-68.vercel.app/)]
Backend: [(https://dashboard-backend-2-a1qg.onrender.com/)]

##✨ Features
Authentication: Secure Signup and Login using JWT (JSON Web Tokens) stored in HTTP-only cookies.
Protected Routes: Frontend routes that verify session status before granting access to the Dashboard.
Profile Management: Users can view their profile and update their username.
Task Manager (CRUD): * Create new tasks.
Read/View personalized task lists.
Update task titles (inline editing) and completion status.
Delete tasks.
Responsive Design: Built with Tailwind CSS for a seamless experience on mobile and desktop.

##🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, React Router, React Toastify.
Backend: Node.js, Express.js.
Database: MongoDB Atlas with Mongoose ODM.
Security: Bcrypt.js for password hashing, JWT for session management, and CORS for cross-domain security.

##📦 API Endpoints
Auth Routes

POST	/signup	 Registers a new user
POST  /login   Authenticates user and sets cookie
POST  /logout  Clears the auth cookie
GET   /check   Verifies JWT and returns user data

## Task Routes (Protected)
GET        	/tasks	    Fetches all tasks for logged-in user
POST  	   /tasks	      Creates a new task
PUT  	    /tasks/:id	  Updates task title or status
DELETE  	/tasks/:id	  Deletes a task


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
