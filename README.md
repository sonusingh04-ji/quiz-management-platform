# Quiz Management & Online Assessment Platform

A full-stack web application for creating, managing, conducting, and evaluating online quizzes and assessments.

The platform provides separate experiences for Students and Administrators, including quiz management, timed assessments, results, analytics, leaderboard functionality, and user management.

---

## 📌 Project Overview

The Quiz Management & Online Assessment Platform provides a centralized system for conducting online assessments.

Students can discover and attempt quizzes, submit answers, view results, track their performance, and check leaderboard rankings.

Administrators can manage users, categories, quizzes, questions, assessments, results, reports, and analytics through an administrative dashboard.

---

## ✨ Features

### 👨‍🎓 Student Features

- User registration and login
- Secure authentication
- Student dashboard
- Discover available quizzes
- Search and browse quizzes
- Take timed quizzes
- Question navigation
- Submit quiz attempts
- View quiz results
- View attempt details
- Quiz history
- Performance tracking
- Leaderboard
- Student profile management
- Password reset functionality

### 👨‍💼 Admin Features

- Admin dashboard
- User management
- Quiz management
- Create and manage quizzes
- Question management
- Category management
- Results management
- Reports
- Analytics dashboard
- Leaderboard management
- Student performance monitoring

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript (JSX)
- CSS
- Vite
- React Router

### Backend

- Node.js
- Express.js
- REST APIs
- Authentication & Authorization Middleware

### Database

- PostgreSQL

### Development Tools

- Git
- GitHub
- IntelliJ IDEA
- Vite

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │     Student/Admin   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   React + Vite       │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
          Controllers      Services      Middleware
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │    Repositories     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘