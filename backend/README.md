# RallyPoint Backend (API)

Node/Express + MySQL/Knex backend for the RallyPoint (USAR community web) project.

This service exposes the REST API used by the frontend for:

- authentication & user info
- tournaments (list, detail, creation)
- divisions & registrations (MVP: read + simple registration)
- brackets & score reporting (post-MVP / later sprints)

## Tech Stack

- Node.js + Express
- MySQL (schema managed via Knex migrations)
- Knex.js for queries/migrations
- Jest for tests
- Deployed to AWS (RDS for MySQL, app host TBD)

Folder structure:

```text
backend/
  config/         # config helpers (DB, env, etc.)
  controllers/    # request handlers
  middleware/     # auth, logging, error handling
  migrations/     # Knex migrations
  routes/         # Express route definitions
  seeds/          # DB seed data (dev/demo)
  services/       # business logic
  tests/          # Jest tests
  utils/          # shared helpers
  index.js        # app bootstrap
  server.js       # HTTP server
```

## Setup on Local Machine

Environment Variables

Create backend/.env by copying .env.example and filling in values:

```text
# HTTP
# Database Configuration
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Environment
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=your_secret_key

# Cognito Configuration
SESSION_SECRET=your_session_secret_key
COGNITO_CLIENT_ID=example-client-id
COGNITO_CLIENT_SECRET=example-client-secret
COGNITO_USER_POOL_ID=example-user-pool-id
COGNITO_REGION=example-region
```

### Install dependencies

run these lines in your IDE terminal

```
cd backend
npm install
```
