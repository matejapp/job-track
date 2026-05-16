# JobTrack — System Design & Roadmap

> Solo side-project. Calibrated for resume impact, not enterprise scale.

---

## 0. Critical first (do this before anything else)

`Api/appsettings.json` contains a **live MongoDB Atlas connection string and JWT secret** in plain text. If this is already pushed anywhere public:

1. Rotate the Atlas password immediately (Atlas → Database Access).
2. Generate a new JWT secret (any random 256-bit hex string).
3. Move both into **User Secrets** for dev and **environment variables** for prod.
4. Add `appsettings.Development.json` and any `.env*` to `.gitignore`.

```powershell
dotnet user-secrets init --project Api
dotnet user-secrets set "MongoDB:ConnectionString" "..." --project Api
dotnet user-secrets set "Jwt:SecretKey" "..." --project Api
```

That alone is a resume signal — "secret management with `IConfiguration` providers" beats most junior projects.

---

## 1. Current-state assessment

| Area | What you have | Gap |
|---|---|---|
| API surface | Auth + JobApplication CRUD, JWT, rate limiter, CORS, Swagger | Good foundation |
| Layering | Logic lives in controllers; `Services/` is empty | No separation of concerns |
| Models | Dates stored as ISO **strings** (User, JobApplication) | Loses type safety; no range queries |
| Validation | None (no `[Required]`, no FluentValidation) | Bad input crashes silently |
| Errors | No global handler; inconsistent responses (`BadRequest("string")` vs `Ok(object)`) | Frontend can't parse uniformly |
| Auth | 7-day JWT, no refresh, no logout | Acceptable for v1 |
| Logging | Default `ILogger` only | No structured logs |
| Tests | None | Biggest resume gap |
| CI/CD | None | Second biggest resume gap |
| Frontend | React + Vite + TanStack Query + Router + Tailwind | Solid; just needs wiring |

---

## 2. Target architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (React/Vite)                    │
│   pages → hooks (TanStack Query) → apiClient (axios + JWT)       │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTPS / JSON
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ASP.NET Core 8 Web API                        │
│                                                                  │
│   Middleware:  CORS → RateLimit → Exception → Auth → Routing     │
│                                                                  │
│   Controllers (thin)  ─►  Services (logic)  ─►  Repositories    │
│         │                       │                     │          │
│         └── DTOs ◄── Mapping ───┘                     ▼          │
│                                                  MongoDBContext  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                       ┌──────────────────┐
                       │  MongoDB Atlas   │
                       │  Users           │
                       │  JobApplications │
                       └──────────────────┘
```

The single most valuable refactor: **Controller → Service → Repository**. Controllers parse HTTP, services hold business rules, repositories own Mongo. This one pattern is what interviewers look for.

---

## 3. Backend folder structure (target)

```
Api/
├─ Controllers/           # HTTP only, no logic
├─ Services/              # Business logic, returns Result<T>
│   ├─ Interfaces/
│   ├─ AuthService.cs
│   └─ JobApplicationService.cs
├─ Repositories/          # Mongo access only
│   ├─ Interfaces/
│   ├─ UserRepository.cs
│   └─ JobApplicationRepository.cs
├─ Models/                # Domain entities (DateTime, not string)
├─ Dtos/
│   ├─ Auth/
│   └─ JobApplication/
├─ Mapping/               # Manual mappers or Mapster profiles
├─ Validation/            # FluentValidation validators
├─ Middleware/
│   ├─ ExceptionHandlingMiddleware.cs
│   └─ RequestLoggingMiddleware.cs
├─ Common/
│   ├─ Result.cs          # Result<T> pattern
│   ├─ ErrorCodes.cs
│   └─ ApiResponse.cs     # Envelope { data, error, traceId }
├─ Configuration/         # Strongly-typed options
│   ├─ JwtOptions.cs
│   └─ MongoOptions.cs
├─ Extensions/            # AddJwtAuth(), AddMongo(), etc.
└─ Program.cs             # Composition root, <50 lines
```

Move the existing controller bodies into services unchanged at first; refactor in place once green.

---

## 4. Data model fixes

Replace string dates with `DateTime`. MongoDB driver handles `DateTime` natively as BSON dates → enables `$gte`/`$lt` queries, sorting, and TTL indexes later.

```csharp
public class JobApplication {
    [BsonId, BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public required string UserId { get; set; }

    public required string CompanyName { get; set; }
    public required string Position { get; set; }
    public string? ApplicationLink { get; set; }
    public ApplicationStatus Status { get; set; }   // enum, not string
    public string? Description { get; set; }
    public DateTime AppliedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public enum ApplicationStatus { Applied, Interview, Offer, Rejected, Ghosted, Withdrawn }
```

**Indexes** (add once on startup):
- `Users`: unique on `Email`
- `JobApplications`: compound `{ UserId: 1, AppliedAt: -1 }` for list-by-user queries

---

## 5. API contract polish

Wrap every response in an envelope so the frontend has one parser:

```json
{ "data": { ... }, "error": null, "traceId": "0HMU..." }
{ "data": null, "error": { "code": "VALIDATION_FAILED", "message": "...", "fields": {...} }, "traceId": "..." }
```

Centralize via `ExceptionHandlingMiddleware` + `ProblemDetails`. Returns RFC 7807 by default in .NET 8, layer the envelope on top.

Endpoints to add for a complete v1:

- `GET /api/jobapplications?status=&search=&page=&size=` — filtering + pagination
- `GET /api/jobapplications/{id}` — single fetch
- `GET /api/jobapplications/stats` — counts per status (dashboard data)
- `POST /api/auth/refresh` — refresh token (later)
- `GET /api/health` — liveness probe

---

## 6. Frontend structure (target)

```
frontend/src/
├─ api/
│   ├─ client.js          # axios instance + interceptors (JWT, 401 → logout)
│   ├─ auth.api.js
│   └─ jobs.api.js
├─ hooks/
│   ├─ useAuth.js
│   ├─ useJobs.js         # useQuery wrappers
│   └─ useJobMutations.js
├─ context/
│   └─ AuthContext.jsx    # token in memory + refresh from localStorage on mount
├─ components/
│   ├─ ui/                # Button, Input, Select, Dialog (shadcn-style)
│   ├─ layout/
│   ├─ dashboard/
│   └─ modals/
├─ pages/
├─ constants/
├─ utils/
│   ├─ formatDate.js
│   └─ schemas.js         # zod schemas, shared with form validation
└─ routes.jsx             # extract routing from App.jsx
```

**Wiring priorities:**

1. axios instance with `Authorization: Bearer ${token}` interceptor.
2. 401 response → clear token → redirect `/login`.
3. TanStack Query keys: `['jobs', filters]`, `['jobs', id]`, `['stats']` — invalidate after mutations.
4. Forms: `react-hook-form` + `zod` (shared schema with API contract in your head).
5. Replace `mockData.js` with real API calls one page at a time.

---

## 7. Security checklist (do all of these — they're cheap)

- [ ] Secrets out of source control (user secrets / env vars)
- [ ] HTTPS redirect re-enabled in non-dev (currently commented out — uncomment for prod)
- [ ] `RequireHttpsMetadata = true` in prod for JWT bearer
- [ ] CORS origin from config, not hardcoded
- [ ] Password policy on register (min 8, FluentValidation)
- [ ] Rate limit `Auth` controller with stricter window (already done — keep it)
- [ ] Tighten JWT: shorter access token (15min) + refresh token in HttpOnly cookie *(post-v1)*
- [ ] Ownership checks on every job endpoint (already in place — keep them)
- [ ] Validate `ApplicationLink` is a URL; cap string lengths

---

## 8. Observability

Two adds that punch above their weight on a resume:

1. **Serilog** with console + file sinks, JSON output. Adds correlation IDs per request.
   ```csharp
   builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration));
   ```
2. **OpenTelemetry** traces exported to console (or Jaeger via Docker locally). One paragraph in the README about it = senior signal.

Skip Prometheus/Grafana for v1 — diminishing returns for a solo side project.

---

## 9. Testing strategy (minimum viable, max resume value)

| Layer | Tool | What to cover |
|---|---|---|
| Unit | xUnit + FluentAssertions + NSubstitute | Services (auth flow, ownership checks) |
| Integration | `WebApplicationFactory<Program>` + Testcontainers-Mongo | Each controller, happy + 401 + 404 |
| Frontend | Vitest + React Testing Library | One smoke test per page, one for the auth hook |
| E2E *(optional)* | Playwright | Login → create job → see in list |

Aim for ~30–50 tests total. Plenty for a side project and shows knowledge of the testing pyramid.

---

## 10. DevOps / deployment

**Local dev:** `docker-compose.yml` with three services — `api`, `mongo`, `frontend`. One command to spin everything.

**CI:** GitHub Actions, two jobs:

- `backend`: `dotnet restore → build → test`
- `frontend`: `npm ci → lint → build → test`

**Deployment options ranked by resume impact vs effort:**

| Option | Effort | Resume signal |
|---|---|---|
| Render / Railway (API + static frontend) | Low | Decent |
| Fly.io (Docker, free tier) | Medium | Good — shows containerization |
| Azure App Service + Static Web Apps | Medium | Strong — matches .NET ecosystem |
| AWS ECS Fargate + CloudFront | High | Strongest, overkill for side project |

**Recommendation: Fly.io for API + Vercel for frontend + MongoDB Atlas free tier.** Costs $0, deploys via `Dockerfile`, real domain.

---

## 11. Roadmap (8 weekends, solo-friendly)

### Phase 1 — Foundation (weekend 1)
- Rotate secrets, move to user secrets
- Add `Services/` and `Repositories/`, move logic out of controllers
- Convert dates to `DateTime`, add `ApplicationStatus` enum
- Add Mongo indexes on startup

### Phase 2 — Quality gates (weekend 2)
- FluentValidation on every DTO
- Global exception middleware + `ApiResponse<T>` envelope
- Serilog with request logging
- Health check endpoint

### Phase 3 — Frontend wiring (weekend 3)
- axios client + interceptors
- Replace `mockData.js` page by page with real `useQuery`/`useMutation` hooks
- Forms with `react-hook-form` + `zod`
- Toast notifications on mutation success/error

### Phase 4 — Features that demo well (weekends 4–5)
- Filtering, search, pagination
- Stats endpoint + dashboard charts (Recharts)
- Optimistic updates on status change
- Empty/loading/error states polished

### Phase 5 — Tests (weekend 6)
- xUnit integration tests with Testcontainers
- A handful of Vitest component tests
- One Playwright happy-path

### Phase 6 — Ship it (weekend 7)
- `Dockerfile` for API (multi-stage)
- `docker-compose.yml` for local
- GitHub Actions CI
- Deploy to Fly.io + Vercel

### Phase 7 — Polish for resume (weekend 8)
- Excellent README with architecture diagram, screenshots, and "what I learned"
- OpenAPI doc published
- Optional: refresh tokens, OAuth (Google sign-in), email confirmation

---

## 12. What to skip (because solo + side project)

- Microservices, message queues, Redis — no real need
- Kubernetes — Fly.io machines or App Service does the job
- Full DDD/CQRS/MediatR — the layered approach above is enough; CQRS shines past a complexity threshold this app won't hit
- Separate identity service — JWT in the API is fine
- Feature flags, A/B testing — no users
- Prometheus stack — Serilog + OTel console is plenty

---

## 13. Resume framing

When this is done, the bullet writes itself:

> Full-stack job application tracker. ASP.NET Core 8 Web API with layered architecture (controllers/services/repositories), JWT auth, FluentValidation, global error middleware, and Serilog structured logging. MongoDB Atlas with indexed queries. React + Vite + TanStack Query frontend with optimistic updates and zod-validated forms. CI via GitHub Actions, deployed on Fly.io behind a Dockerfile, with integration tests using Testcontainers.

That paragraph beats 95% of junior portfolios.
