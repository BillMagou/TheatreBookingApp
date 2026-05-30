# Theatre Booking App

## Overview

The Theatre Booking App is a full-stack application developed for theatre reservation management. The system allows users to register, log in, browse available theatre shows, create reservations, view their reservations, and cancel existing bookings.

The project was developed using React Native (Expo) for the frontend, Node.js with Express.js for the backend, and MariaDB as the database system.

---

## Features

- User Registration
- User Login
- JWT Authentication
- Browse Available Shows
- Create Reservations
- View Personal Reservations
- Cancel Reservations
- Secure Password Hashing with bcrypt
- REST API Architecture

---

## Technologies Used

### Frontend
- React Native
- Expo
- TypeScript
- Fetch API

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens)
- bcryptjs

### Database
- MariaDB

---

## Database Structure

The application uses four main tables:

### Users
Stores registered user information.

### Theatres
Stores theatre information.

### Shows
Stores available theatre performances.

### Reservations
Stores reservation records created by users.

---

## API Endpoints

### Authentication

#### Register User
POST /users/register

#### Login User
POST /users/login

### Shows

#### Get All Shows
GET /shows

### Theatres

#### Get All Theatres
GET /theatres

### Reservations

#### Get User Reservations
GET /reservations

#### Create Reservation
POST /reservations

#### Cancel Reservation
DELETE /reservations/:id

---

## Installation

### Clone Repository

```bash
git clone https://github.com/BillMagou/TheatreBookingApp.git
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

### Database Setup

Create a MariaDB database and import the required tables:

- users
- theatres
- shows
- reservations

Configure database credentials in the `.env` file.

---

## Security

The application implements JWT authentication for protected routes and bcrypt password hashing for secure password storage.

---

## Author

Bill Magou

Metropolitan College

Software Development Project – Theatre Booking Application
