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
![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/49bcc608c4b1dee77988404a791f863056fd929a/1.png)


## 2. Student Dashboard

The dashboard provides students with an overview of available quizzes, completed quizzes, average score, ranking, and recent attempts.

![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/e9b9be67dd9882219a3c46199543b363ef44aad3/2.png)
---

## 3. Discover Quizzes

Students can explore available quizzes and filter them based on quiz title, category, and difficulty.

![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/21b9e4fba348c59779f7098155e0e2e102e1fef9/3.png)

---

## 4. Take Quiz

Students can attempt quizzes through an interactive quiz interface with question navigation, progress tracking, and a timer.

![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/020d88fddd4f0c171a637d38215f559a0b333812/4.png)

---

## 5. Quiz Completed

After submitting a quiz, students receive a performance summary containing their score, correct answers, wrong answers, unanswered questions, time taken, and result status.

![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/e169236abec3ea6a2ddb6d35197a5d2e34674e2c/5.png)

---

## 6. Quiz History

Students can view their previous quiz attempts, scores, correct and incorrect answers, submission time, and status.

![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/395d9fdeb5192f094d815b36570f46c5a2333918/6.png)

---

## 7. Leaderboard

The leaderboard displays student rankings based on quiz performance, including highest and average scores.

![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/6276faf13feb38276d8b6bd1923560f349d9f9ea/7.png)

---

## 8. My Results

Students can review their overall quiz performance, including total attempts, average score, highest score, passed quizzes, failed quizzes, and success rate.

![image alt](https://github.com/sonusingh04-ji/quiz-management-platform/blob/66e05b9b50d3a6934cb56eeaf7b6eb9d7e6becdc/8.png)

---

## 9. Attempt Details

Students can view detailed information about a particular quiz attempt, including score, answers, time taken, status, and question review.

![image alt]
---

## 10. Student Profile

The profile page displays the student's account information, role, email address, and user details.

![image alt]

---

## 11. Forgot Password

Students can request a password reset by entering the email address associated with their account.

![image alt]

---

# 🛡️ Admin Module

The Admin module provides centralized management and monitoring capabilities.

## Admin Dashboard

The admin dashboard provides an overview of the platform and important administrative information.

![image alt]

---

## Admin Management Screens

### User Management

Administrators can manage registered users and their account information.

![image alt]
### Quiz Management

Administrators can manage quizzes available on the platform.

![image alt]

### Create Quiz

Administrators can create and configure new quizzes.

![image alt]

### Question Management

Administrators can manage questions and their associated quiz information.

![image alt]

### Category Management

Administrators can manage quiz categories.

![image alt]
### Results Management

Administrators can view and manage student quiz results.

![image alt]

### Analytics

Administrators can review platform analytics and performance information.

![image alt]

### Reports

The platform provides report-related functionality for administrative review.

![image alt]

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
