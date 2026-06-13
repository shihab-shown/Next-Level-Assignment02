# Vehicle Rental & Booking Management System

A robust, secure, and production-ready RESTful API backend for a **Vehicle Rental & Booking System**. Built with **Node.js**, **Express.js**, **TypeScript**, and **PostgreSQL**, this backend provides complete management for users, vehicle, and booking flows, complete with role-based access control.

---

## 🔗 Project Links

*   [Live Deployment URL](https://l2a2-beta.vercel.app)
*   [GitHub Repository URL](https://github.com/shihab-shown/Next-Level-Assignment02)

---

## Features

### User & Authentication Management
*   **Secure Registration & Login:** Password hashing with `bcryptjs` and stateless session management using JSON Web Tokens (`JWT`).
*   **Role-Based Access Control (RBAC):** Users are classified into `customer` and `admin` roles, securing sensitive endpoints.
*   **Profile Management:** Users can update their profiles (name, email, phone, and password). Admins can manage all users, including updating their roles or deleting them.

### Vehicle Management
*   **Inventory Operations (CRUD):** Fully managed by administrators (create, read, update, delete).
*   **Availability Tracking:** Vehicles dynamically transition availability states (`available` vs `booked`) upon creation and completion of bookings.

### Booking & Rental Operations
*   **Automated Rent Calculator:** Automatically calculates the total rental price when a booking is created based on the daily rent price and rental duration (days).
*   **Self-Service Cancellation:** Customers can cancel bookings if the rental start date is in the future.
*   **Vehicle Returns & Transitions:** Booking statuses transition from `active` to `returned` or `cancelled`. Vehicles are instantly released back to `available` status upon return or cancellation.
*   **Access-Controlled Views:** Admins can view all bookings, while customers are restricted to viewing only their own bookings.

---

## 🛠️ Technology Stack

*   **Backend Framework:** Express.js (v5.2.1)
*   **Programming Language:** TypeScript (v6.0.3)
*   **Database:** PostgreSQL (v8.21.0 using `pg` connection pool)
*   **Authentication & Hashing:** JSON Web Tokens (`jsonwebtoken` v9.0.3) & `bcryptjs` (v3.0.3)
*   **Development & Watch Tools:** `tsx` (v4.22.4)
*   **Configuration Manager:** `dotenv` (v17.4.2)
*   **Platform & Deployment:** Vercel (using serverless functions)

---

## ⚙️ Setup & Installation Instructions

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/shihab-shown/Next-Level-Assignment02.git
cd Next-Level-Assignment02
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory. And fill in the credentials in the `.env` file:
```env
PORT=5000
CONNECTION_STRING=postgresql://your_db_user:your_db_password@your_db_host:5432/your_db_name?sslmode=require
JWT_SECRET=your_super_secret_key_here
```

### 4. Database Setup
Ensure that your PostgreSQL database is running and matching the connection string configured in the `.env`.
*The application is configured to automatically run migrations and create the tables if they do not exist when the server starts.*

### 5. Run the Server
#### Development Mode (with hot-reloading)
```bash
npm run dev
```
The server will start at `http://localhost:5000` (or the port specified in `.env`).

---

## ☁️ Deployment

This project is configured for deployment on [Vercel](https://vercel.com)
### How to Deploy
1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy the project:
   ```bash
   vercel
   vercel --prod
   ```
3. Set your production Environment Variables (`CONNECTION_STRING` and `JWT_SECRET`) in your Vercel Dashboard under **Project Settings > Environment Variables**.
