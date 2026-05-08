================================================================================
TEAM TASK MANAGER - FULL-STACK ASSESSMENT
================================================================================

## 🚀 Live Links
- Frontend (Live App): https://patient-delight-production-6683.up.railway.app
- Backend (API Base URL): https://zooming-integrity-production-e3ba.up.railway.app


## 📌 Project Overview
The Team Task Manager is a full-stack MERN web application designed to help teams create projects, assign tasks, and track progress efficiently. It features a secure, role-based access control system (RBAC) ensuring that Administrators can manage the workflow while Team Members can focus on updating their assigned tasks.

## ⚙️ Key Features
1. Role-Based Access Control (RBAC):
   - Admin: Can create projects, assign tasks to members, and view all project statistics.
   - Member: Can only view projects they are assigned to and update the status of their specific tasks.
2. Secure Authentication: JWT-based user signup and login.
3. Dashboard & Analytics: Real-time tracking of Total Tasks, In Progress tasks, and automatically flagged Overdue tasks.
4. Task Lifecycle: Seamlessly move tasks from "To Do" -> "In Progress" -> "Done".

## 🛠️ Tech Stack
- Frontend: React.js, Tailwind CSS, Axios
- Backend: Node.js, Express.js, JSON Web Tokens (JWT)
- Database: MongoDB (Atlas), Mongoose
- Deployment: Railway.app

================================================================================
💻 HOW TO RUN LOCALLY
================================================================================

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB server)

### 1. Clone the Repository
git clone https://github.com/Jash-1th/team_task_manager 

cd team_task_manager

### 2. Backend Setup
cd backend
npm install

Create a `.env` file in the `/backend` directory and add:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

Start the backend server:
npm run dev
(Runs on http://localhost:5000)

### 3. Frontend Setup
Open a new terminal window.
cd frontend
npm install

Create a `.env` file in the `/frontend` directory and add:
VITE_API_URL=http://localhost:5000

Start the React development server:
 npm run dev
(Runs on http://localhost:5173)

### 4. Default Testing Accounts
You can register new users from the UI and select their roles, or use the app to test Admin/Member isolation.
