# FinFlow AI

FinFlow AI is a personal finance platform built with Spring Boot, PostgreSQL, and React, with planned AI capabilities using RAG, tool calling, and agentic workflows.

## Features

### Backend
- User registration and JWT authentication
- Checking and savings accounts
- Deposits and withdrawals
- Account-to-account transfers
- Beneficiary-based transfers
- Transaction history and categories
- Weekly and monthly budgets
- Budget usage and health tracking
- Dashboard analytics
- Pessimistic locking for safer concurrent transfers
- Centralized exception handling

### Dashboard Analytics
- Total balance
- Monthly income
- Monthly spending
- Net cash flow
- Spending by category
- Recent transactions
- Monthly cash-flow trends
- Budget health

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- JWT
- Maven

### Frontend
- React
- TypeScript
- Vite

### Planned AI Layer
- LLM integration
- Retrieval-Augmented Generation (RAG)
- Tool / function calling
- Agentic financial workflows

## Project Structure

```text
Projects/
├── finflow-backend/
├── finflow-frontend/
├── README.md
└── .gitignore
```

## Planned AI Capabilities

FinFlow AI will eventually support questions such as:

- Where did most of my money go this month?
- How much did I spend on groceries?
- Am I close to exceeding any budgets?
- How has my spending changed over time?
- What is my current cash flow?

The AI assistant will use FinFlow backend data and tools rather than operate as a generic chatbot.

## Current Status

Backend v1 is complete and ready for frontend integration.

Next:
1. React + TypeScript frontend
2. Dashboard UI
3. Accounts and transactions UI
4. Budgets and analytics
5. AI assistant
6. RAG and tool calling
7. Docker, CI/CD, and deployment

## Author

Arun Gyawali
