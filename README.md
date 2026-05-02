# Team Task Manager

A full-stack web application to manage team projects, assign tasks, and track progress with role-based access control.

## Live URL
**URL**: https://taskmanager-sm.up.railway.app/

## GitHub Repository
**Git Link**: https://github.com/Mohdsameer045/team-task-manager.git

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MySQL

### Deployment
- Railway

---

## Features

### Authentication
- User Signup
- User Login
- JWT Token Based Authentication

### Role Based Access

#### Admin
- Create Projects
- Assign Tasks to Members
- View Dashboard
- Track Overdue Tasks

#### Member
- View Assigned Tasks
- Update Task Status:
  - Pending
  - Progress
  - Completed

---

## Project Structure

team-task-manager/
├── client/
├── server/
└── README.md

---

## Installation

### Frontend

cd client
npm install
npm run dev

### Backend

cd server
npm install
npm start

---

## Environment Variables

Create `.env` file inside server folder:

PORT=5000
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_secret

---

## Demo Credentials

### Admin
Email: admin@example.com
Password: ******

### Member
Email: member@example.com
Password: ******

---

## Author

Mohammed Sameer