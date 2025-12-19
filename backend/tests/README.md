# Tests

## How to Run
- From `backend/`: `npm test`
- Ensure test DB/env vars are set (e.g., `NODE_ENV=test`, DB credentials in `.env`); tests start/stop the server automatically.
- If seeds are needed, run `npx knex seed:run` before tests.

## Expected Responses (shape)
- Success: typically 200/201 with JSON payloads.
- Error shape (from global handler):  
  ```json
  { "message": "Reason", "code": "ErrorName" }
  ```
  Examples: 401 -> `UnauthorizedError`, 403 -> `ForbiddenError`, 404 -> `NotFoundError`, 400 -> `ValidationError`.

## Notable Coverage
- Auth: register/login, JWT uniqueness over time, protected route without token.
- Users: CRUD, validation, duplicate detection, 404 includes `code`.
- Organizations/Teams/Tournaments: happy paths plus 404s with `code`.
- Role auth: `/api/users` returns 403 for non-admin; succeeds for admin after role update.
