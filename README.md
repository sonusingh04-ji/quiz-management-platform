# 🎯 Quiz Management & Online Assessment Platform

A full-stack **Quiz Management and Online Assessment Platform** designed to provide an interactive environment for students to discover quizzes, attempt assessments, track performance, view results, and compete on leaderboards.

The platform also provides administrators with tools to manage users, quizzes, questions, categories, results, analytics, and reports.

---

## 📌 Overview

The **Quiz Management & Online Assessment Platform** is a full-stack web application developed with a separate frontend and backend architecture.

The system supports two primary roles:

- 👨‍🎓 **Student** — Discover and attempt quizzes, view performance, history, results, leaderboard rankings, and profile information.
- 🛡️ **Admin** — Manage quizzes, questions, users, categories, results, analytics, and reports.

The application is designed with a clean, modern, and responsive user interface and a structured REST API backend.

---

# ✨ Key Features

### 👨‍🎓 Student Features

- 🔐 Student registration and login
- https://github.com/sonusingh04-ji/quiz-management-platform/blob/49bcc608c4b1dee77988404a791f863056fd929a/1.png
- 🔑 Forgot and reset password
- 📊 Personalized student dashboard
- 🔎 Discover available quizzes
- 📝 Search and filter quizzes
- 🎯 Take timed quizzes
- 📈 Real-time quiz progress
- ✅ Automatic answer evaluation
- 🏆 Quiz completion and score calculation
- 📜 Quiz history
- 📊 Detailed quiz results
- 🔍 Attempt details and question review
- 🥇 Student leaderboard
- 👤 Student profile
- 📈 Performance tracking

### 🛡️ Admin Features

- 🔐 Secure admin authentication
- 📊 Admin dashboard
- 👥 User management
- 📝 Quiz management
- ❓ Question management
- 🗂️ Category management
- 📊 Result management
- 📈 Analytics dashboard
- 📄 Report management
- 🎯 Quiz creation and configuration
- 👨‍🎓 Student performance monitoring

---

# 🧑‍🎓 Student Module

The Student module provides a complete assessment experience.

## 1. Student Registration

Students can create an account by providing their basic information, email address, password, and account type.

![Student Registration](screenshots/student/student-01.png)

---

## 2. Student Dashboard

The dashboard provides students with an overview of available quizzes, completed quizzes, average score, ranking, and recent attempts.

![Student Dashboard](screenshots/student/student-02.png)

---

## 3. Discover Quizzes

Students can explore available quizzes and filter them based on quiz title, category, and difficulty.

![Discover Quizzes](screenshots/student/student-03.png)

---

## 4. Take Quiz

Students can attempt quizzes through an interactive quiz interface with question navigation, progress tracking, and a timer.

![Take Quiz](screenshots/student/student-04.png)

---

## 5. Quiz Completed

After submitting a quiz, students receive a performance summary containing their score, correct answers, wrong answers, unanswered questions, time taken, and result status.

![Quiz Completed](screenshots/student/student-05.png)

---

## 6. Quiz History

Students can view their previous quiz attempts, scores, correct and incorrect answers, submission time, and status.

![Quiz History](screenshots/student/student-06.png)

---

## 7. Leaderboard

The leaderboard displays student rankings based on quiz performance, including highest and average scores.

![Leaderboard](screenshots/student/student-07.png)

---

## 8. My Results

Students can review their overall quiz performance, including total attempts, average score, highest score, passed quizzes, failed quizzes, and success rate.

![My Results](screenshots/student/student-08.png)

---

## 9. Attempt Details

Students can view detailed information about a particular quiz attempt, including score, answers, time taken, status, and question review.

![Attempt Details](screenshots/student/student-09.png)

---

## 10. Student Profile

The profile page displays the student's account information, role, email address, and user details.

![Student Profile](screenshots/student/student-10.png)

---

## 11. Forgot Password

Students can request a password reset by entering the email address associated with their account.

![Forgot Password](screenshots/student/student-11.png)

---

# 🛡️ Admin Module

The Admin module provides centralized management and monitoring capabilities.

## Admin Dashboard

The admin dashboard provides an overview of the platform and important administrative information.

![Admin Dashboard](screenshots/admin/admin-01.png)

---

## Admin Management Screens

### User Management

Administrators can manage registered users and their account information.

![Admin User Management](screenshots/admin/admin-02.png)

### Quiz Management

Administrators can manage quizzes available on the platform.

![Admin Quiz Management](screenshots/admin/admin-03.png)

### Create Quiz

Administrators can create and configure new quizzes.

![Create Quiz](screenshots/admin/admin-04.png)

### Question Management

Administrators can manage questions and their associated quiz information.

![Question Management](screenshots/admin/admin-05.png)

### Category Management

Administrators can manage quiz categories.

![Category Management](screenshots/admin/admin-06.png)

### Results Management

Administrators can view and manage student quiz results.

![Admin Results](screenshots/admin/admin-07.png)

### Analytics

Administrators can review platform analytics and performance information.

![Admin Analytics](screenshots/admin/admin-08.png)

### Reports

The platform provides report-related functionality for administrative review.

![Admin Reports](screenshots/admin/admin-09.png)

### Additional Admin Functionality

Additional administrative screens are included in the platform for managing and monitoring the assessment system.

![Admin Screen](screenshots/admin/admin-10.png)

![Admin Screen](screenshots/admin/admin-11.png)

---

# 🛠️ Technology Stack

## Frontend

- ⚛️ React.js
- ⚡ Vite
- 🎨 CSS
- 🌐 JavaScript
- 🔗 REST API integration

## Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔐 Authentication & authorization
- 🛣️ RESTful API architecture

## Database

- 🐘 PostgreSQL

## Development Tools

- 💻 IntelliJ IDEA
- 🧑‍💻 Visual Studio Code
- 🐙 Git & GitHub
- 🌐 Google Chrome
- 🐘 PostgreSQL

---

# 🏗️ Project Architecture

The application follows a separate frontend and backend architecture.

```text
quiz-management-platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── database/
│   ├── docs/
│   ├── report/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│   ├── admin/
│   └── student/
│
├── README.md
└── .gitignore
