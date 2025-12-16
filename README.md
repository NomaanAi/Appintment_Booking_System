# 🏥 Pro-Level Appointment Management System

> A production-ready, full-stack appointment booking engine built with the MERN stack. Features automated email reminders, role-based access control, and a powerful admin analytics dashboard.

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![Tech Stack](https://img.shields.io/badge/stack-MERN-blue)

## 🌟 Key Features

### 🤖 Intelligent Automation
*   **Zero-Touch Reminders**: Background Cron jobs automatically identify upcoming appointments (24h window) and send HTML email reminders.
*   **Duplicate Prevention**: Smart flagging ensures users never receive spam/duplicate notifications.
*   **Full Lifecycle Notifications**: Automated emails for Booking Confirmations, Status Changes (Approved/Rejected), and Cancellations.

### 🛡️ Enterprise-Grade Security
*   **Atomic Slot Locking**: MongoDB Transactions prevent race conditions (double-booking) under high concurrency.
*   **Role-Based Access**: Specialized portals for **Admins**, **Staff**, and **Customers**.
*   **Advanced Protection**: Integrated `helmet` for security headers, `express-rate-limit` for DDoS protection, and secure JWT Auth with Refresh Tokens.

### 📊 Powerful Admin Dashboard
*   **Business Intelligence**: Real-time KPIs including Cancellation Rate, Peak Booking Hours, and Staff Performance Leaderboards.
*   **Data Management**: Advanced server-side pagination, search, and filtering capabilities.
*   **Export**: One-click CSV export of appointment data for external reporting.
*   **Staff Availability**: Granular control over staff shifts, holidays, and buffer times.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), Tailwind CSS, Context API
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose Schema with Indexes)
*   **Automation**: `node-cron`, `nodemailer`
*   **Validation**: Joi (Input Validation)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/appointment-system.git
    cd appointment-system
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend Deps
    cd backend
    npm install

    # Install Frontend Deps
    cd ../frontend
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in `/backend` and add:
    ```env
    MONGO_URI=mongodb://localhost:27017/aps
    JWT_SECRET=your_super_secret_key
    JWT_REFRESH_SECRET=your_refresh_secret
    SMTP_HOST=smtp.ethereal.email
    SMTP_PORT=587
    SMTP_USER=your_smtp_user
    SMTP_PASS=your_smtp_pass
    ```

4.  **Seed Database (Optional)**
    Populate the DB with realistic demo data (Users, Staff, Appointments):
    ```bash
    cd backend
    node seed.js
    ```

5.  **Run the App**
    ```bash
    # Run Backend (Port 5000)
    cd backend
    npm start

    # Run Frontend (Port 5173)
    cd frontend
    npm run dev
    ```

## 🔐 Standard Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Staff** | `sarah@example.com` | `password123` |
| **User** | `alice@example.com` | `password123` |

## 📐 Architecture

The system follows a strict **Service-Controller-Route** architecture to maintain clean code and separation of concerns.

*   **/services**: Core business logic (Scheduler, Email, KPIs).
*   **/controllers**: request/response handling.
*   **/models**: Mongoose schemas with strict types.
*   **/middleware**: Security, Auth, and Validation layers.

---
*Built for scale and reliability.*
