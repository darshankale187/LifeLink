# LifeLink: AI-Powered Organ Donor Management System

A full-stack web application to register organ donors and recipients, match them
using ABO blood-group compatibility, and get AI-generated explanations and answers
grounded in live database statistics.

> **Disclaimer:** This is an academic demo project with dummy data only. Real organ
> allocation is done by doctors and authorities such as NOTTO.

## Screenshots

| Login | Dashboard |
|---|---|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

| Donors | Match + AI explanation |
|---|---|
| ![Donors](screenshots/donors.png) | ![Match](screenshots/match.png) |

![AI Assistant](screenshots/assistant.png)

## Features

- JWT authentication (register and login) with BCrypt password hashing
- Protected REST APIs and protected React routes
- Donor and recipient registration with server-side validation
- Matching engine: ABO blood-group compatibility, same organ, same city first
- AI match explainer (Google Gemini API)
- AI chat assistant with conversation memory, grounded on live aggregated database
  counts (no names or phone numbers are sent to the AI)
- Dashboard with organ supply vs demand, light and dark theme

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Redux Toolkit, Context API, axios |
| Backend | Java 17+, Spring Boot 4, Spring Data JPA, Spring Security, JWT (jjwt) |
| Database | MySQL 8 |
| AI | Google Gemini API |
| Tools | Eclipse, Maven, Postman, Git |

## Architecture

```
React (Router, Redux, Context, axios)
   |  Authorization: Bearer <JWT>
   v
Controller -> Service -> Repository -> MySQL
                |
            AiService -> Gemini API
```

Backend packages: `controller`, `service`, `repository`, `model`, `security`,
`config`, `exception`.

## API Endpoints

All endpoints except `/api/auth/**` need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create an account, returns a JWT |
| POST | /api/auth/login | Login, returns a JWT |
| GET | /api/donors | List donors |
| POST | /api/donors | Add donor (validated) |
| GET | /api/recipients | List recipients |
| POST | /api/recipients | Add recipient (validated) |
| GET | /api/match/{id} | Compatible donors for a recipient |
| GET | /api/match/{id}/explain | AI explanation of the match |
| POST | /api/assistant | AI chat, body: `{"messages":[{"role":"user","text":"..."}]}` |

## Setup

### 1. Database

```sql
CREATE DATABASE organdb;
```

Tables are created automatically by JPA.

### 2. Backend

Set these environment variables (Eclipse: Run Configurations -> Environment, or a
`.env` file in the backend folder, see `.env.example`):

| Variable | Description |
|---|---|
| DB_PASSWORD | MySQL password |
| GEMINI_API_KEY | Key from https://aistudio.google.com/apikey |
| JWT_SECRET | Random string, at least 32 characters |
| ADMIN_PASSWORD | Password for the seeded `admin` user |

Run `Organapp1Application`. The backend starts on `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173` and sign in as `admin` with your `ADMIN_PASSWORD`, or
create a new account.

## Security Notes

- Passwords are stored as BCrypt hashes, secrets are read from environment variables
- The AI receives only aggregated counts, never names or phone numbers
- This is a demo: the JWT is kept in `localStorage`, and there is no refresh token
  or rate limiting yet

## Roadmap

- Role-based access (admin vs user)
- Edit and delete for donors and recipients
- Unit tests and deployment

## Author

Darshan, B.Sc. Computer Science
[LinkedIn](https://www.linkedin.com/in/YOUR_PROFILE) | [GitHub](https://github.com/YOUR_USERNAME)
