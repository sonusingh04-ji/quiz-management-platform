# Quiz Management & Online Assessment Platform

A full-stack web application for creating, managing, conducting, and evaluating online quizzes and assessments.

The platform provides separate experiences for Students and Administrators, including quiz management, timed assessments, results, analytics, leaderboard functionality, and user management.

---

## 📌 Project Overview

The Quiz Management & Online Assessment Platform provides a centralized system for online assessments.

### Student Features

- Student registration and login
- Browse available quizzes
- View quiz details
- Start and attempt quizzes
- Question navigation
- Answer selection
- Quiz timer
- Automatic quiz submission
- Score calculation
- Pass/fail result
- Result and answer review
- Attempt history
- Student dashboard
- Performance statistics
- Leaderboard
- Profile management

### Admin Features

- Admin authentication
- Admin dashboard
- User management
- Quiz creation
- Quiz editing
- Quiz deletion
- Publish/unpublish quizzes
- Category management
- Question management
- Option management
- Correct-answer configuration
- Admin results
- Analytics
- Reports
- Platform activity overview

---

## 🛠️ Technology Stack

### Frontend

- React.js
- React Router
- JavaScript (JSX)
- CSS
- Vite

### Backend

- Node.js
- Express.js
- REST APIs
- Authentication and authorization middleware

### Database

- PostgreSQL

### Development Tools

- Git
- GitHub
- IntelliJ IDEA
- Vite

The project specification recommends React.js for the frontend, Node.js/Express.js for the backend, and PostgreSQL for the database. :contentReference[oaicite:1]{index=1}

---

## 🏗️ Application Architecture

```text
                Student / Admin
                       │
                       ▼
                React Frontend
                       │
                       │ REST API
                       ▼
                Node.js + Express
                       │
                       ▼
                   PostgreSQL