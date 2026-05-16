# JobTrack

A full-stack job application tracker built with **ASP.NET Core 10** and **React**. Securely manage your job hunt — register, log applications, update statuses, and visualize your progress.

<!-- Add once deployed:
**Live demo:** https://jobtrack.example.com
**API docs:**  https://api.jobtrack.example.com/swagger
-->

<!-- Add screenshots here:
![Dashboard](docs/screenshots/dashboard.png)
![Applications](docs/screenshots/applications.png)
-->

---

## Features

- **User authentication** — register and log in with email + password (BCrypt-hashed).
- **JWT-protected API** — every job application endpoint requires a valid bearer token.
- **Per-user data isolation** — ownership checks enforced in the service layer; users can only access their own records.
- **Job application CRUD** — track company, position, link, status, description, and applied date.
- **Rate-limited authentication** — sliding- and fixed-window limiters protect login/register from abuse.
- **OpenAPI / Swagger UI** — interactive API documentation generated automatically.
- **CORS-configured SPA** — React frontend communicates with the API on a separate origin.

---

## Tech stack

### Backend (`Api/`)

| Concern         | Choice                                                       |
| --------------- | ------------------------------------------------------------ |
| Framework       | ASP.NET Core 10 Web API (C#)                                 |
| Database        | MongoDB Atlas via `MongoDB.Driver`                           |
| Authentication  | JWT bearer tokens (`Microsoft.AspNetCore.Authentication.JwtBearer`) |
| Password hashing| `BCrypt.Net-Next`                                            |
| Rate limiting   | Built-in `AspNetCore.RateLimiting` (sliding + fixed windows) |
| API docs        | Swashbuckle / OpenAPI                                        |
| Secret storage  | `dotnet user-secrets` in development; environment variables in production |

### Frontend (`frontend/`)

| Concern         | Choice                                                       |
| --------------- | ------------------------------------------------------------ |
| Framework       | React 18 + Vite                                              |
| Routing         | React Router                                                 |
| Server state    | TanStack Query                                               |
| Styling         | Tailwind CSS                                                 |
| Charts          | Recharts                                                     |
| Icons           | Lucide                                                       |

---

## Architecture

The backend is organized as three single-responsibility layers, each independently testable:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐
│  Controller  │ ─► │   Service    │ ─► │  Repository  │ ─► │  MongoDB  │
│ (HTTP only)  │    │ (business    │    │ (data access │    │           │
│              │    │  rules)      │    │   only)      │    │           │
└──────────────┘    └──────────────┘    └──────────────┘    └───────────┘
```

- **Controllers** translate HTTP requests, extract the authenticated user from the JWT, and return appropriate status codes. They contain no business logic.
- **Services** enforce invariants (ownership, timestamps, validation) and map between DTOs and domain entities. They have no awareness of HTTP or the database.
- **Repositories** are the only layer that talks to MongoDB. They expose typed methods (`GetByIdAsync`, `AddAsync`, `DeleteAsync`) and return domain entities.

Dependency injection wires the layers together; each is exposed through an interface, so any layer can be swapped or mocked without touching the others.

```
Api/
├─ Controllers/            # HTTP entry points
├─ Services/               # Business logic
│   └─ Interfaces/
├─ Repositories/           # MongoDB access
│   └─ Interfaces/
├─ Dto/                    # Request / response contracts
├─ Models/                 # Domain entities
├─ Shared/                 # MongoDBContext
└─ Program.cs              # Composition root
```

---

## API reference

Base URL (development): `http://localhost:5003`

### Authentication

| Method | Route                  | Auth | Description                          |
| ------ | ---------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/register`   | —    | Create a new user.                   |
| POST   | `/api/auth/login`      | —    | Exchange credentials for a JWT.      |

### Job applications

All endpoints below require `Authorization: Bearer <token>`.

| Method | Route                         | Description                          |
| ------ | ----------------------------- | ------------------------------------ |
| GET    | `/api/jobapplication`         | List the caller's job applications.  |
| POST   | `/api/jobapplication`         | Create a new job application.        |
| PUT    | `/api/jobapplication/{id}`    | Update an existing job application.  |
| DELETE | `/api/jobapplication/{id}`    | Delete a job application.            |

Full request/response schemas are available in Swagger at `/swagger` when running in development.

---

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (free tier is sufficient)

### 1. Clone the repository

```powershell
git clone <repo-url>
cd .net-web-api
```

### 2. Configure backend secrets

Sensitive values are kept out of source control and provided via .NET User Secrets in development:

```powershell
dotnet user-secrets set "MongoDB:ConnectionString" "<your-atlas-connection-string>" --project Api
dotnet user-secrets set "Jwt:SecretKey" "<random-256-bit-hex>" --project Api
```

Non-secret configuration (database name, collection names, rate-limit windows) lives in `Api/appsettings.json`.

### 3. Run the API

```powershell
dotnet run --project Api
```

The API listens on `http://localhost:5003`. Swagger UI is available at `http://localhost:5003/swagger`.

### 4. Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

The SPA serves at `http://localhost:5173`. CORS is preconfigured for this origin in `Api/Program.cs`.

---

## License

MIT
