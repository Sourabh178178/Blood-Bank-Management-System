#  Blood Bank Management System (MERN)

A full-stack **Blood Bank Management System** built using the **MERN stack (MongoDB, Express, React, Node)** to digitalize blood bank operations including donor management, hospital registration, blood stock management, and blood request handling.

---

##  Project Overview

This application helps blood banks and hospitals **store, track, and manage blood stock** in real-time. It allows **donors, hospitals, and admins** to register and perform actions based on their roles.

###  Purpose

To reduce manual workload, speed up emergency blood availability, and maintain a secure, transparent blood management process.

---

##  Features

| Feature                  | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| 👤 User Authentication   | Login & Register with secure JWT-based authentication |
| 🩸 Donor Management      | Add, view, and manage blood donors and their details  |
| 🏥 Hospital / Blood Bank | Register hospitals and manage blood inventories       |
| 📦 Blood Stock Tracking  | Add, update, monitor available blood units by group   |
| 🔄 Blood Requests        | Request and manage blood supply orders                |
| 📊 Admin Dashboard       | View platform statistics and manage system data       |
| 📱 Responsive UI         | Works on desktop, tablet and mobile                   |

---

##  Tech Stack

###  Frontend

* React.js
* HTML, CSS, JavaScript
* Axios (API calls)
* Tailwind CSS / Bootstrap

###  Backend

* Node.js
* Express.js
* JWT Authentication & bcrypt

### Database

* MongoDB (Mongoose ODM)

###  Additional Tools

* REST API Architecture
* Postman API Testing
* Nodemon (development)

---

##  Project Structure

```
Blood-Bank-Management-System/
├── client/                 # React frontend
├── server/                 # Node + Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth middleware
│   ├── config/             # DB connection
│   └── server.js           # Server entry
├── package.json
├── README.md
└── ...
```

---

##  Installation & Setup

### 1️ Clone the Repository

```bash
git clone https://github.com/Sourabh178178/Blood-Bank-Management-System.git
cd Blood-Bank-Management-System
```

### 2️ Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3️ Configure Environment Variables

Create a `.env` file inside `/server` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4️ Start the Application

#### Run Backend

```bash
cd server
npm start
```

#### Run Frontend

```bash
cd ../client
npm start
```

Now open browser at:
👉 [http://localhost:3000](http://localhost:3000)

---

##  API Routes Overview (Short)

| Method | Route              | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | /api/auth/register | User Registration      |
| POST   | /api/auth/login    | User Login             |
| POST   | /api/donor/add     | Add new blood donor    |
| GET    | /api/donor/all     | Get donor list         |
| POST   | /api/hospital/add  | Register new hospital  |
| POST   | /api/blood/add     | Add blood stock        |
| GET    | /api/blood/stock   | Get blood availability |
| POST   | /api/blood/request | Request for blood      |

---

###  Thank you for using Blood Bank Management System!
