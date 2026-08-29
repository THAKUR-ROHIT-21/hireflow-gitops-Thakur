# HireFlow Backend

Node.js + Express + Sequelize + PostgreSQL backend.

## Included

- HR registration
- Candidate registration
- JWT authentication
- PostgreSQL connection
- Sequelize models
- Model associations
- Database migration
- HR dashboard endpoint
- Candidate dashboard endpoint
- Docker support

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env`, then set the values.

Run migrations:

```bash
npm run db:migrate
```

Start:

```bash
npm run dev
```

## Docker

The backend expects PostgreSQL at the hostname `postgres` when running in Docker Compose.

Health endpoint:

```text
GET /api/health
```

Authentication:

```text
POST /api/auth/register/hr
POST /api/auth/register/candidate
POST /api/auth/login
```

Dashboards:

```text
GET /api/dashboard/hr
GET /api/dashboard/candidate
```

Protected dashboard routes require:

```text
Authorization: Bearer <JWT>
```

## Important

No fake seed data is included. Database records are created through real API operations.
