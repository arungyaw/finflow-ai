# FinFlow AI

FinFlow AI is a full-stack personal finance platform built with Spring Boot, React, TypeScript, and PostgreSQL. It provides core banking and budgeting workflows today, with an AI-powered financial assistant planned as the next major layer.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected frontend routes
- Automatic logout and redirect when a session expires
- Logged-in user information displayed in the app layout

### Accounts
- Create checking and savings accounts
- View balances and account status
- Mask account numbers by default
- Show or hide full account numbers
- Deposit funds
- Withdraw funds with transaction categories
- Transfer money between FinFlow accounts
- Send money to saved beneficiaries

### Transactions
- View transactions by account
- Filter by transaction type
- Filter by transaction category
- Supported transaction types: Deposit, Withdrawal, Transfer In, Transfer Out

### Budgets
- Create weekly or monthly budgets
- Edit existing budgets
- Delete budgets
- Track spending by category
- Budget health data available through the dashboard

### Beneficiaries
- Add beneficiaries
- View saved beneficiaries
- Delete beneficiaries
- Transfer money to saved beneficiaries

### Dashboard
- Total account balance
- Monthly income
- Monthly spending
- Net cash flow
- Recent transactions
- Spending by category
- Monthly cash-flow history
- Budget health

### Responsive UI
- Desktop sidebar navigation
- Mobile hamburger menu
- Responsive layouts across all major pages
- Loading, error, empty, and success states

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- PostgreSQL
- Maven

### Frontend
- React
- TypeScript
- Vite
- React Router
- CSS
- Oxlint

## Project Structure

```text
Projects/
├── finflow-backend/
│   ├── src/
│   └── pom.xml
├── finflow-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## Backend Setup

### Prerequisites
- Java 21
- Maven
- PostgreSQL

### Environment Variables

Configure locally:

```text
DB_PASSWORD=<your PostgreSQL password>
JWT_SECRET=<your Base64 encoded JWT secret>
```

Do not commit real credentials or secrets to Git.

The backend reads the JWT secret from:

```properties
jwt.secret=${JWT_SECRET}
jwt.expiration=3600000
```

### Run the Backend

From `finflow-backend`:

```bash
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

## Frontend Setup

From `finflow-frontend`:

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Core API Endpoints

### Users

```text
POST /api/users/register
POST /api/users/login
GET  /api/users/me
```

### Accounts

```text
POST /api/accounts
GET  /api/accounts
POST /api/accounts/{accountId}/deposit
POST /api/accounts/{accountId}/withdraw
POST /api/accounts/{accountId}/transfer
POST /api/accounts/{accountId}/transfer/beneficiary
GET  /api/accounts/{accountId}/transactions
```

### Beneficiaries

```text
POST   /api/beneficiaries
GET    /api/beneficiaries
DELETE /api/beneficiaries/{beneficiaryId}
```

### Budgets

```text
POST   /api/budgets
GET    /api/budgets
PUT    /api/budgets/{budgetId}
DELETE /api/budgets/{budgetId}
GET    /api/budgets/{budgetId}/usage
GET    /api/budgets/usage
```

### Dashboard

```text
GET /api/dashboard/summary
GET /api/dashboard/spending-by-category
GET /api/dashboard/recent-transactions
GET /api/dashboard/monthly-cash-flow
GET /api/dashboard/budget-health
```

## Security

FinFlow uses stateless JWT authentication.

Public endpoints:

```text
/api/users/register
/api/users/login
```

All other API endpoints require authentication. The frontend attaches:

```text
Authorization: Bearer <token>
```

If an authenticated request returns `401 Unauthorized`, the frontend clears the stored token and redirects to the login page.

## Current Architecture

```text
React + TypeScript
        |
        v
Spring Boot REST API
        |
        v
Service Layer
        |
        v
Spring Data JPA
        |
        v
PostgreSQL
```

## Planned AI Layer

The next major phase is an AI-powered financial assistant. The assistant will use controlled FinFlow tools rather than directly accessing the database.

Planned read-only capabilities include:
- Where did most of my money go this month?
- How much did I spend on groceries?
- Which budgets are close to their limits?
- What was my net cash flow this month?
- What are my largest recent expenses?
- How has my spending changed month over month?

Planned architecture:

```text
React AI Assistant
        |
        v
Spring Boot AI Orchestration
        |
        v
FinFlow Read-Only Tools
        |
        v
Existing Services
        |
        v
PostgreSQL
```

Write operations through AI will be considered later and will require explicit safeguards and confirmation flows.

## Future Improvements

- AI financial assistant
- Tool calling for financial insights
- RAG where useful for financial documents or knowledge
- Refresh-token support
- More automated backend and frontend tests
- OpenAPI / Swagger documentation
- Flyway or Liquibase migrations
- Audit logging
- Rate limiting
- Docker
- GitHub Actions CI/CD
- Cloud deployment
- Kubernetes deployment

## Status

**Current milestone:** Core backend and frontend banking workflows completed.

**Next milestone:** FinFlow AI – Phase 1: read-only intelligent financial assistant.
