# Improvements Applied

This document summarizes the automated improvements applied to the repository to align it with TypeScript and Azure Functions best practices.

What I changed

- Enabled `strict` mode in `tsconfig.json` to improve type safety.
- Added a `messageService` (`src/services/messageService.ts`) to centralize data access logic.
- Introduced Zod-based validation utilities (`src/utils/validation.ts`) and applied them to `CreateMessages`.
- Refactored `CreateMessages.ts` and `GetMessages.ts` to use the service layer and centralized validation.
- Added `.env.example` documenting required environment variables.
- Updated `test/database.test.ts` to use an in-memory SQLite database for unit tests so tests do not require a running Postgres instance.
- Added a basic GitHub Actions CI workflow (`.github/workflows/ci.yml`) that installs deps, builds and runs tests.
- Added `zod` dependency and useful npm scripts to `package.json` (`lint`, `format`, `start:dev`).
- Fixed function handler tests to mock `InvocationContext` logging methods (`log`, `error`) as functions.
- Fixed a strict nullability assertion in `test/services/messageService.test.ts`.
- Added `sqlite3` as dev dependency and simplified the sqlite in-memory test to avoid Postgres-specific entity type mismatch.

How to use

Install dependencies and run tests locally:

```bash
npm ci
npm run build
npm test
```

Run functions locally (requires Azure Functions Core Tools):

```bash
npm start
```

Next recommended steps (not yet applied):

- Add ESLint + Prettier configs and run `npm run lint` as part of CI.
- Add `class-transformer`/`class-validator` if you prefer decorators-based validation.
- Add Git hooks (`husky`, `lint-staged`) for pre-commit checks.
- Add more unit tests for service layer (mocking `AppDataSource`) and integration tests for functions.
- Add production-grade logging and error handling middleware.
