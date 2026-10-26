# LifeLink
# LifeLink: AI-Powered Organ Donor Management System

A full-stack web app to register organ donors and recipients, match them using
blood-group compatibility, and get AI-generated match explanations.

> **Disclaimer:** Academic demo project with dummy data only. Real organ
> allocation is done by doctors and authorities like NOTTO.

## Features

- Donor and recipient registration
- Smart matching: ABO blood-group compatibility, same organ, same city first
- AI match explainer (Google Gemini API)
- Organ donation assistant chatbot
- Layered Spring Boot architecture with global CORS and proper 404 handling

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Java 21, Spring Boot 4, Spring Data JPA |
| Database | MySQL 8 |
| AI | Google Gemini API |
| Tools | Eclipse, Maven, Postman |

## Architecture

```
React  ->  Controller  ->  Service  ->  Repository  ->  MySQL
                              |
                          AiService  ->  Gemini API
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/donors | Add donor |
| GET | /api/donors | List donors |
| POST | /api/recipients | Add recipient |
| GET | /api/recipients | List recipients |
| GET | /api/match/{id} | Compatible donors for a recipient |
| GET | /api/match/{id}/explain | AI explanation of the match |
| POST | /api/assistant | Donation assistant (body: `{"question": "..."}`) |

## Setup

### 1. Database
```sql
CREATE DATABASE organdb;
```

### 2. Backend
Set these environment variables (Eclipse: Run Configurations -> Environment):

| Variable | Value |
|---|---|
| DB_PASSWORD | your MySQL password |
| GEMINI_API_KEY | key from https://aistudio.google.com/apikey |

Run `Organapp1Application` (Spring Boot App). Backend starts on `http://localhost:8080`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## Screenshots

[Add 2-3 screenshots here: home page, match result, AI explanation]

## Author

Darshan, B.Sc. Computer Science
[LinkedIn link] | [GitHub link]
