# ApexBank — Bank Management System

A full-stack bank management platform with two portals: a **staff/admin console** for
managing customers, accounts, and transactions, and a **customer portal** for online
banking (deposit, transfer, statement). Built with **Django REST Framework + JWT** on the
backend and **React + Vite + Tailwind CSS** on the frontend.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0-092E20?logo=django&logoColor=white)
![Django REST Framework](https://img.shields.io/badge/DRF-3.17-a30000?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Demo Credentials](#demo-credentials)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Seeding Demo Data](#seeding-demo-data)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Frontend Design System](#frontend-design-system)
- [Verification](#verification)
- [Production Checklist](#production-checklist)
- [License](#license)

---

## Features

### Staff Portal (ADMIN / MANAGER / TELLER)

- **JWT authentication** with role-based access (ADMIN, MANAGER, TELLER)
- **Dashboard** with live KPIs (total balance, customers, deposits, withdrawals) and charts
- **Customer management** — create, edit, delete, and search customers (paged)
- **Account management** — view all accounts, **create accounts** for existing customers with
  optional opening deposit
- **User management** — list all users (staff + customers) and **reset any user's password**
- **Operations** — deposit, withdraw, and transfer money between accounts
- **Transactions** — filterable history with running balances
- **Reports** — summaries with **CSV export** and print support
- **Profile** — edit own details and change password

### Customer Portal

- **Self-registration** — open a new Savings/Current account with a secure password
- **Online banking** — deposit to own account, transfer money, view statements
- **Account switcher** — jump between multiple accounts
- **Profile** — update details and change password

---

## Demo Credentials

Seeded via `python manage.py seed_demo` (see [Seeding Demo Data](#seeding-demo-data)).

| Portal | Username / Identifier | Password | Role |
| ------ | --------------------- | -------- | ---- |
| Staff  | `admin`               | `Admin@123` | ADMIN |
| Staff  | `manager`             | `Manager@123` | MANAGER |
| Staff  | `teller`              | `Teller@123` | TELLER |
| Customer | `rahul.sharma@example.com` or `SB100000001` | `Customer@123` | Savings |
| Customer | `priya.verma@example.com` or `SB100000002` | `Customer@123` | Current |
| Customer | ...`SB100000003` – `SB100000008` | `Customer@123` | mixed |

> Customers may also log in with any other seeded account number / email using `Customer@123`.

---

## Tech Stack

### Backend (`backend/`)

- Python 3.10+, Django 6.0, Django REST Framework 3.17
- Authentication: `djangorestframework-simplejwt` (60 min access / 7 day refresh, rotating)
- Database: MySQL (`mysqlclient`), `.env`-driven configuration (`python-dotenv`)
- API docs: `drf-spectacular` (Swagger UI)
- Apps: `authentication`, `customers`, `accounts`, `transactions`, `dashboard`, `reports`

### Frontend (`frontend/`)

- React 19 + Vite 8, React Router 7, React Hook Form
- Tailwind CSS 4 (`@tailwindcss/vite`) with a custom design-token theme
- Chart.js + react-chartjs-2 for analytics
- Axios with automatic JWT refresh interceptor
- Lazy-loaded routes, reusable UI kit (Button, Card, Table, Modal, Badge, etc.)

---

## Architecture

```
Browser (React SPA :5173)
      │  JWT (Bearer token, auto-refresh on 401)
      ▼
Django REST API (:8000 /api/*)
      ├── /api/token/                 JWT obtain/refresh
      ├── /api/auth/                  profile, change-password, users, set-password
      ├── /api/customers/             login, register, manage, deposit, transfer, transactions
      ├── /api/accounts/              accounts + create, balance
      ├── /api/transactions/          transaction log
      ├── /api/dashboard/             summary + recent transactions
      ├── /api/reports/               customers, accounts, transactions
      └── /api/docs/                  Swagger UI
      ▼
MySQL (bank_management_system)
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 5.7+ (create a database, e.g. `bank_management_system`)

### 1. Backend

```bash
cd backend

# Virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS / Linux

# Dependencies
pip install -r requirements.txt

# Configure .env (copy from example)
cp .env.example .env           # Windows: copy .env.example .env
#   Set DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT to match your MySQL

# Migrations + server
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

✅ Backend: `http://127.0.0.1:8000` · API docs: `http://127.0.0.1:8000/api/docs/`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend: `http://localhost:5173`

### 3. Log in

- **Staff:** `http://localhost:5173/login` → **Staff** tab → `admin` / `Admin@123`
- **Customer:** **Customer** tab → any seeded email/account + `Customer@123`
- **Django admin:** `http://127.0.0.1:8000/admin/` → `admin` / `Admin@123`

---

## Seeding Demo Data

```bash
cd backend
python manage.py seed_demo
```

Creates 3 staff users, 8 customers, 8 accounts (Savings/Current), and 25 realistic
transactions spread over the last month. The command is **idempotent** — it ensures staff
exist and skips data if customers are already present.

---

## API Overview

| Method | Endpoint | Description | Access |
| ------ | -------- | ----------- | ------ |
| POST | `/api/token/` | Staff JWT login | Public |
| POST | `/api/token/refresh/` | Refresh access token | Public |
| POST | `/api/customers/login/` | Customer login (account/email + password) | Public |
| POST | `/api/customers/register/` | Open a new customer account | Public |
| GET/PUT | `/api/auth/profile/` | Own profile | Auth |
| POST | `/api/auth/change-password/` | Change own password | Auth |
| GET | `/api/auth/users/` | List all users | Staff |
| POST | `/api/auth/set-password/` | Reset any user's password | Staff |
| CRUD | `/api/customers/manage/` | Customer management (search + pagination) | Staff |
| GET/POST | `/api/accounts/`, `/api/accounts/create/` | Accounts + create for customer | Staff |
| POST | `/api/customers/deposit/` | Deposit | Customer |
| POST | `/api/customers/transfer/` | Transfer | Customer |
| GET | `/api/customers/transactions/` | Customer statement | Customer |
| GET | `/api/dashboard/summary/` | KPIs + charts | Staff |
| GET | `/api/reports/*` | Export-ready data | Staff |

Interactive Swagger documentation is available at `/api/docs/`.

---

## Project Structure

```
BankManagementSystem/
├── backend/
│   ├── config/                 # Django settings, URLs, WSGI
│   ├── authentication/         # Profiles, permissions, profile/password endpoints
│   ├── customers/              # Customer model, register/login, services, seed_demo
│   ├── accounts/               # Account model, create/balance endpoints
│   ├── transactions/           # Transaction model + deposit/withdraw/transfer services
│   ├── dashboard/              # Summary + recent-transaction APIs
│   ├── reports/                # Customer/account/transaction report APIs
│   ├── requirements.txt
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/         # UI kit (ui/), layouts, route guards, modals
    │   ├── context/            # AuthContext (role-based sessions)
    │   ├── hooks/              # useAsync, useDebounce
    │   ├── lib/                # api client, format, charts, csv, constants
    │   ├── pages/              # staff/ and customer/ portals, Login, NotFound
    │   ├── routes/             # AppRoutes with lazy loading
    │   ├── services/           # API service modules
    │   ├── index.css           # Tailwind v4 theme + design tokens
    │   └── main.jsx
    ├── vite.config.js          # Tailwind plugin + dev proxy to :8000
    └── package.json
```

---

## Frontend Design System

The UI is built on a small reusable kit in `frontend/src/components/ui/`:

- `Button`, `Card`, `Badge`, `Field/Input/Select`, `Table`, `Pagination`, `Modal`,
  `ConfirmDialog`, `EmptyState`, `Spinner`, `StatCard`, `PageHeader`, `SearchInput`
- Shared business components: `MoneyForm` (deposit/withdraw/transfer), `AccountPicker`,
  `TransactionBadge`, `CustomerFormModal`, `AccountCreateModal`, `ResetPasswordModal`
- Theme via CSS custom properties in `frontend/src/index.css` (brand palette, radius, shadows)
- Dark marketing login screen with a light application shell

---

## Verification

- `python manage.py check` — no issues
- `npm run build` — clean production build (route-level code splitting)
- API smoke-tested with the Django test client: registration, login (password + legacy),
  change-password, staff user listing, password reset, account creation, and role
  restrictions (customer role is denied staff actions).

> `npm run lint` (oxlint) is configured; on some Windows machines the native oxlint binary
> is blocked by Application Control policy. `npm run build` is the reliable CI gate.

---

## Production Checklist

- [ ] `DEBUG=False` and a strong random `SECRET_KEY` in `.env`
- [ ] Restrict `ALLOWED_HOSTS` to your domain
- [ ] Use HTTPS with `SECURE_SSL_REDIRECT=True`, `SECURE_HSTS_*`
- [ ] Tighten CORS `CORS_ALLOWED_ORIGINS`
- [ ] Serve `frontend/dist` from a CDN/static host (or Django), disable dev proxy
- [ ] Rotate JWT secrets; keep access tokens short-lived
- [ ] Run with a production WSGI server (e.g. Gunicorn) behind a reverse proxy

---

## License

MIT
