# KAUH Request Management System

A web-based hospital request management system developed for **King Abdullah University Hospital (KAUH)** as the final project of the DOT Jordan Full-Stack Web Development Bootcamp.

The system helps hospital departments manage supply and equipment requests through a centralized platform with role-based access control.

## Project Overview

KAUH Request Management System provides a digital solution for organizing and tracking hospital requests. It allows employees to submit requests and track their status, while administrators can manage requests, devices, departments, and system operations.

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- Bootstrap
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

## Main Features

- User authentication and login.
- Role-based authorization.
- Admin and Employee roles.
- Dashboard displaying system statistics.
- Create and manage hospital requests.
- Track request statuses.
- Approve, reject, and complete requests.
- Manage hospital devices.
- Manage departments.
- Search and filter requests and devices.
- Responsive user interface.

## User Roles

### Administrator
- Access the administration dashboard.
- View and manage requests.
- Approve, reject, and complete requests.
- Manage hospital devices.
- Access administrative functionality.

### Employee
- Log in to the system.
- Submit hospital requests.
- View available requests.
- Access features according to employee permissions.

## Project Structure

```text
KAUH-Request-Management-System/
│
├── backend/
│   ├── models/
│   ├── routers/
│   ├── middleware/
│   ├── controllers/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DanaAlTradat/KAUH-Request-Management-System.git
```

```bash
cd KAUH-Request-Management-System
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
DATABASE_URI=mongodb://127.0.0.1:27017/kauh_requests
JWT_SECRET=your_secret_key
SALT_ROUNDS=10
```

Start the backend server using the available script in `backend/package.json`.

### 3. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

```text
http://localhost:5173
```

## Database Setup

The project uses MongoDB as its database.

Make sure MongoDB is installed and running locally, or configure `DATABASE_URI` to point to your MongoDB connection.

The database used by default is:

```text
kauh_requests
```

## API Endpoints

The backend provides REST API endpoints for managing the system.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/login` | User login |
| POST | `/api/users` | Create a user |
| GET | `/api/users/profile` | Get authenticated user profile |
| GET | `/api/users/admin` | Admin-only endpoint |
| GET | `/api/departments` | Retrieve departments |
| POST | `/api/departments` | Create a department |
| GET | `/api/devices` | Retrieve devices |
| POST | `/api/devices` | Create a device |
| GET | `/api/requests` | Retrieve requests |
| POST | `/api/requests` | Create a request |
| GET | `/api/health` | Check server health |

Additional update and delete operations are available for supported resources.

## Authentication and Authorization

The system uses JSON Web Tokens (JWT) for authentication and bcrypt for password hashing.

Protected routes require a valid authentication token. Role-based authorization controls access to administrative features.

## Environment Variables

The backend requires the following environment variables:

| Variable | Description |
|---|---|
| PORT | Backend server port |
| DATABASE_URI | MongoDB connection string |
| JWT_SECRET | Secret key used for JWT authentication |
| SALT_ROUNDS | bcrypt password hashing rounds |

**Important:** Never upload your `.env` file or expose your secret keys in the GitHub repository.

## Project Information

**Project:** KAUH Request Management System  
**Institution:** King Abdullah University Hospital  
**Program:** DOT Jordan Full-Stack Web Development Bootcamp  
**Frontend:** React.js  
**Backend:** Node.js and Express.js  
**Database:** MongoDB

---

*Developed as a final project for the DOT Jordan Full-Stack Web Development Bootcamp.*