# OpenAPI and NSwag Type Verification

This document explains how TeamTalk uses OpenAPI and NSwag to ensure type consistency between the frontend (Next.js/TypeScript) and backend (ASP.NET Core).

## Overview

Type safety between frontend and backend is critical for preventing runtime errors and ensuring API contracts are honored. We use:

- **OpenAPI/Swagger**: Backend API documentation standard that generates a machine-readable specification
- **NSwag**: A .NET toolchain that generates TypeScript client code from OpenAPI specifications

## Prerequisites

Install NSwag as a .NET global tool:

```bash
dotnet tool install -g NSwag.ConsoleCore
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (.NET)                          │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────────┐  │
│  │   DTOs      │───▶│  Controllers │───▶│ Swagger/OpenAPI   │  │
│  │ (C# Types)  │    │  (Endpoints) │    │   (swagger.json)  │  │
│  └─────────────┘    └──────────────┘    └─────────┬─────────┘  │
└───────────────────────────────────────────────────┼─────────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NSwag Code Generation                      │
│                                                                 │
│   swagger.json  ──▶  nswag.json config  ──▶  TypeScript Types   │
└─────────────────────────────────────────────────────────────────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                         │
│  ┌───────────────────┐    ┌──────────────┐    ┌─────────────┐  │
│  │ Generated Types   │───▶│  API Client  │───▶│  Components │  │
│  │ (api.ts)          │    │  (axios)     │    │  (React)    │  │
│  └───────────────────┘    └──────────────┘    └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## How It Works

### 1. Backend OpenAPI Generation

The backend uses Swashbuckle.AspNetCore to automatically generate OpenAPI documentation from:

- **DTOs (Data Transfer Objects)**: C# classes that define request/response shapes
- **Controller Actions**: HTTP endpoints with their parameters and return types
- **Data Annotations**: Validation attributes like `[Required]`, `[MaxLength]`, etc.

**Configuration** ([Program.cs](../backend/TeamTalkApi/Program.cs)):

```csharp
// JSON serialization with string enums for proper TypeScript generation
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Swagger/OpenAPI configuration
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "TeamTalk API",
        Version = "v1",
        Description = "API for TeamTalk sports team communication platform"
    });
    // JWT security scheme configuration...
});
```

The OpenAPI specification is available at:
- **Development**: `http://localhost:5264/swagger/v1/swagger.json`
- **Swagger UI**: `http://localhost:5264/swagger`

### 2. NSwag Configuration

The NSwag configuration file ([nswag.json](../frontend/nswag.json)) tells NSwag how to generate TypeScript code:

**Key settings**:

| Setting | Value | Purpose |
|---------|-------|---------|
| `url` | `http://localhost:5264/swagger/v1/swagger.json` | Source OpenAPI spec |
| `template` | `Axios` | HTTP client library |
| `typeStyle` | `Interface` | Generate TypeScript interfaces |
| `enumStyle` | `Enum` | Generate TypeScript enums |
| `output` | `types/generated/api.ts` | Output file location |
| `generateClientClasses` | `true` | Generate API client classes |
| `generateDtoTypes` | `true` | Generate DTO interfaces |

### 3. Type Generation

Run the following command to generate TypeScript types:

```bash
cd frontend
npm run generate-api
```

This will:
1. Fetch the OpenAPI specification from the backend
2. Parse all DTOs, enums, and API endpoints
3. Generate TypeScript interfaces and API client classes
4. Output to `frontend/types/generated/api.ts`

## Generated Types

### Backend DTO (C#)

```csharp
public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}
```

### Generated TypeScript Interface

```typescript
export interface LoginRequestDto {
    email: string;
    password: string;
}
```

### Backend Enum (C#)

```csharp
public enum UserRole
{
    Admin = 0,
    Coach = 1,
    Player = 2,
    Captain = 3
}
```

### Generated TypeScript Enum

```typescript
export enum UserRole {
    Admin = "Admin",
    Coach = "Coach",
    Player = "Player",
    Captain = "Captain",
}
```

### Backend Response DTO (C#)

```csharp
public class AuthResponseDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public required Guid UserId { get; set; }
    public required string FirstName { get; set; }
    public required UserRole Role { get; set; }
    public string? ProfilePicture { get; set; }
}
```

### Generated TypeScript Interface

```typescript
export interface AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    userId: string;
    firstName: string;
    role: UserRole;
    profilePicture?: string | undefined;
}
```

## NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `generate-api` | `nswag run nswag.json` | Generate TypeScript types from OpenAPI |
| `generate-api:watch` | `nswag run nswag.json && echo 'Types generated successfully!'` | Generate with success message |
| `prebuild` | Runs `generate-api` before build | Ensures types are up-to-date before production build |

## Usage in Frontend

### Using Generated Types

```typescript
import { LoginRequestDto, AuthResponseDto, UserRole } from '@/types/generated/api';

// Type-safe request
const loginData: LoginRequestDto = {
    email: 'user@example.com',
    password: 'password123'
};

// Type-safe response handling
const handleResponse = (response: AuthResponseDto) => {
    console.log(response.firstName);
    if (response.role === UserRole.Admin) {
        // Admin-specific logic
    }
};
```

### Using Generated API Client

```typescript
import { ApiClient } from '@/types/generated/api';

const apiClient = new ApiClient('http://localhost:5264');

// Fully typed API call
const response = await apiClient.login({
    email: 'user@example.com',
    password: 'password123'
});
```

## Verification Workflow

### During Development

1. **Backend changes**: When you modify a DTO or controller in the backend, the OpenAPI spec automatically updates
2. **Regenerate types**: Run `npm run generate-api` in the frontend
3. **TypeScript validation**: If any frontend code uses types incorrectly, TypeScript will show compile errors

### CI/CD Pipeline

Add this step to your CI pipeline to catch type mismatches:

```yaml
- name: Install NSwag
  run: dotnet tool install -g NSwag.ConsoleCore

- name: Generate API Types
  run: |
    cd frontend
    npm run generate-api

- name: Check for uncommitted changes
  run: |
    git diff --exit-code frontend/types/generated/
```

This will fail if generated types differ from committed types, indicating a backend change wasn't properly synced.

## Best Practices

### 1. Always Use DTOs

```csharp
// Good: Use DTOs for API contracts
[HttpPost("login")]
public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)

// Avoid: Exposing entity models directly
[HttpPost("login")]
public async Task<ActionResult<User>> Login([FromBody] User user)
```

### 2. Document Response Types

```csharp
[HttpPost("login")]
[ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto request)
```

### 3. Use Meaningful Validation Attributes

```csharp
public class SignupRequestDto
{
    [Required]
    [MinLength(2, ErrorMessage = "First name must be at least 2 characters")]
    [MaxLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public required string FirstName { get; set; }
}
```

### 4. Use String Enums

The backend is configured with `JsonStringEnumConverter` to serialize enums as strings. This ensures:

- TypeScript enums have meaningful names (`UserRole.Admin` instead of `UserRole._0`)
- API responses are human-readable
- Frontend/backend enum values match exactly

### 5. Version Your API

For breaking changes, consider API versioning:

```csharp
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "TeamTalk API", Version = "v1" });
    options.SwaggerDoc("v2", new OpenApiInfo { Title = "TeamTalk API", Version = "v2" });
});
```

## Troubleshooting

### "Cannot connect to backend"

Ensure the backend is running:

```bash
cd backend/TeamTalkApi
dotnet run
```

### "Types are outdated"

Regenerate types:

```bash
cd frontend
npm run generate-api
```

### "NSwag not found"

Install NSwag as a .NET global tool:

```bash
dotnet tool install -g NSwag.ConsoleCore
```

### "Generated types have wrong format"

Check `nswag.json` configuration and ensure:
- `typeStyle` is set to `Interface`
- `enumStyle` is set to `Enum`
- `template` matches your HTTP client (Axios)

### "Enums show numeric values instead of names"

Ensure the backend has `JsonStringEnumConverter` configured:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
```

## File Structure

```
TeamTalk/
├── backend/TeamTalkApi/
│   ├── DTOs/                      # C# Data Transfer Objects
│   │   ├── AuthDto.cs
│   │   ├── UserDto.cs
│   │   ├── TeamDto.cs
│   │   └── ...
│   ├── TeamTalk.Core/Enums/       # C# Enums
│   │   ├── UserRole.cs
│   │   ├── AuthProvider.cs
│   │   └── ...
│   └── Program.cs                 # Swagger + JSON configuration
├── frontend/
│   ├── nswag.json                 # NSwag configuration
│   ├── types/
│   │   └── generated/
│   │       └── api.ts             # Generated TypeScript types
│   └── package.json               # npm scripts
└── docs/
    └── openapi-nswag-type-verification.md  # This document
```

## Related Documentation

- [Swagger/OpenAPI Documentation](https://swagger.io/specification/)
- [NSwag Documentation](https://github.com/RicoSuter/NSwag)
- [ASP.NET Core Web API with Swagger](https://docs.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger)
