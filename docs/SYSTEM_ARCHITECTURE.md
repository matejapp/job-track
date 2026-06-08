# JobTrack system architecture

This document describes the current shape of JobTrack as it exists in the codebase. It is meant for portfolio review and interview prep, so it focuses on the decisions that matter when someone wants to understand how the app works.

![JobTrack system architecture](architecture/jobtrack-system-architecture.drawio.png)

Diagram files:

- [Editable draw.io source](architecture/jobtrack-system-architecture.drawio)
- [Editable PNG export](architecture/jobtrack-system-architecture.drawio.png)
- [SVG export](architecture/jobtrack-system-architecture.svg)

## Request flow

The frontend is a React 18 + Vite app hosted as a Vercel SPA. React Router owns page navigation, TanStack Query owns server state, and a small typed fetch wrapper attaches the JWT from `localStorage` to protected calls.

The normal flow is:

```text
Browser -> React SPA -> typed API client -> ASP.NET Core API -> service layer -> repository layer -> MongoDB Atlas
```

Document upload adds one more branch:

```text
React SPA -> ASP.NET Core API -> DocumentService -> Supabase Storage
```

Password reset adds an email branch:

```text
AuthController -> AuthService -> EmailService -> SMTP provider
```

## Backend layers

The backend uses a conservative controller, service, repository structure.

Controllers:

- Read route parameters and request bodies.
- Extract the user id from JWT claims.
- Run FluentValidation for request DTOs.
- Return HTTP status codes and response objects.

Services:

- Enforce user ownership.
- Set creation and update timestamps.
- Map domain entities to response DTOs.
- Link documents to applications.
- Generate password reset tokens and call the email service.

Repositories:

- Wrap MongoDB collection access.
- Keep queries user-scoped where the operation allows it.
- Return domain models to the service layer.

The `MongoDBContext` creates these collections:

- `Users`
- `JobApplications`
- `Activities`
- `Notes`
- `Recruiters`
- `Documents`

It also creates useful indexes on startup, including a unique email index and user-scoped indexes for applications, activities, notes, and documents.

## Security and data ownership

Most API routes require JWT bearer auth. The service layer checks that the record belongs to the authenticated user before returning or changing it. When another user's application is requested, the API returns `404`, not `403`, so it does not reveal whether the record exists.

Auth uses BCrypt for password hashing. Login updates `LastLogin`, and password reset tokens expire after one hour. Auth routes use a stricter fixed-window rate limit. Most app routes use a sliding-window limit.

Configuration should come from user secrets or environment variables. Local `appsettings.json` files are ignored and should not be committed.

## Frontend structure

The frontend keeps most app behavior close to the feature pages:

- `src/api` contains the typed fetch wrapper and API-specific helpers.
- `src/providers` contains auth and theme providers.
- `src/pages` contains route-level screens.
- `src/components/shared` contains reusable app components.
- `src/components/ui` contains the Radix and Tailwind component primitives.
- `src/validation` contains reusable Zod schemas where the older shared forms still use them.

Dashboard and statistics pages currently compute aggregates from application and activity data on the client. The API helpers for future aggregate endpoints are marked as backend gaps.

## External services

MongoDB Atlas stores application data and user metadata.

Supabase Storage stores uploaded PDF and DOCX files. The API keeps the storage path in MongoDB and returns signed URLs when documents are listed.

SMTP handles password reset email. The code is compatible with a Resend SMTP setup.

PostHog is optional. The frontend initializes it only when `VITE_POSTHOG_KEY` is set.

## Testing and delivery

Backend tests use xUnit, `WebApplicationFactory`, and Testcontainers MongoDB. The suite covers auth flow, application CRUD, ownership isolation, health checks, and index behavior.

The repo includes frontend test coverage for the HTTP client and form behavior, plus a Playwright browser flow with API stubs. Those tests should be kept in sync as the UI names and routes change.

CI currently restores, builds, and tests the .NET solution through GitHub Actions. The frontend has local unit and E2E test scripts.

## Good interview talking points

- Why the service layer owns user checks instead of pushing that logic into controllers.
- Why the API returns `404` for cross-user records.
- How Testcontainers gives integration tests a real MongoDB instance without sharing state.
- Why document bytes go to Supabase Storage while document metadata stays in MongoDB.
- What would move server-side next: aggregate statistics, filtering, search, and pagination.
