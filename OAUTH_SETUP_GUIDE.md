# OAuth Authentication Setup Guide

## Google and Facebook Login/Signup Integration

This guide explains how to implement Google and Facebook authentication for your TeamTalk application using .NET backend and Next.js frontend.

---

## Table of Contents
1. [Backend Setup (.NET)](#backend-setup-net)
2. [Frontend Setup (Next.js)](#frontend-setup-nextjs)
3. [OAuth Provider Configuration](#oauth-provider-configuration)

---

## Backend Setup (.NET)

### 1. Install Required NuGet Packages

```bash
dotnet add package Microsoft.AspNetCore.Authentication.Google
dotnet add package Microsoft.AspNetCore.Authentication.Facebook
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```

### 2. Configure Authentication in `Program.cs`

```csharp
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;

var builder = WebApplication.CreateBuilder(args);

// Add Authentication Services
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    googleOptions.CallbackPath = "/api/auth/google/callback";
})
.AddFacebook(facebookOptions =>
{
    facebookOptions.AppId = builder.Configuration["Authentication:Facebook:AppId"];
    facebookOptions.AppSecret = builder.Configuration["Authentication:Facebook:AppSecret"];
    facebookOptions.CallbackPath = "/api/auth/facebook/callback";
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
```

### 3. Add Configuration to `appsettings.json`

```json
{
  "Authentication": {
    "Google": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID",
      "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
    },
    "Facebook": {
      "AppId": "YOUR_FACEBOOK_APP_ID",
      "AppSecret": "YOUR_FACEBOOK_APP_SECRET"
    }
  }
}
```

### 4. Create Authentication Controller

```csharp
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    // Google Login
    [HttpGet("google/login")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = "/api/auth/google/callback"
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var result = await HttpContext.AuthenticateAsync();

        if (!result.Succeeded)
            return BadRequest("Google authentication failed");

        var claims = result.Principal.Claims;
        var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        // Create or update user in your database
        var user = await CreateOrUpdateUser(email, name, "Google");

        // Generate JWT token
        var token = GenerateJwtToken(user);

        // Redirect to frontend with token
        return Redirect($"http://localhost:3000/auth/callback?token={token}");
    }

    // Facebook Login
    [HttpGet("facebook/login")]
    public IActionResult FacebookLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = "/api/auth/facebook/callback"
        };
        return Challenge(properties, FacebookDefaults.AuthenticationScheme);
    }

    [HttpGet("facebook/callback")]
    public async Task<IActionResult> FacebookCallback()
    {
        var result = await HttpContext.AuthenticateAsync();

        if (!result.Succeeded)
            return BadRequest("Facebook authentication failed");

        var claims = result.Principal.Claims;
        var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        // Create or update user in your database
        var user = await CreateOrUpdateUser(email, name, "Facebook");

        // Generate JWT token
        var token = GenerateJwtToken(user);

        // Redirect to frontend with token
        return Redirect($"http://localhost:3000/auth/callback?token={token}");
    }

    private async Task<User> CreateOrUpdateUser(string email, string name, string provider)
    {
        // Implementation: Check if user exists, create if not
        // Update last login timestamp
        // Return user object
    }

    private string GenerateJwtToken(User user)
    {
        // Implementation: Generate JWT token
        // Include user claims (id, email, roles, etc.)
    }
}
```

---

## Frontend Setup (Next.js)

### 1. Install Required Packages

```bash
npm install next-auth
# or
yarn add next-auth
```

### 2. Alternative Approach: Direct OAuth Integration

If not using NextAuth, you can use direct API calls:

#### Create OAuth Button Component

```tsx
// components/OAuthButtons.tsx
'use client';

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google/login';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        {/* Google icon SVG */}
      </svg>
      Sign in with Google
    </button>
  );
}

export function FacebookLoginButton() {
  const handleFacebookLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/facebook/login';
  };

  return (
    <button
      onClick={handleFacebookLogin}
      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        {/* Facebook icon SVG */}
      </svg>
      Sign in with Facebook
    </button>
  );
}
```

#### Create OAuth Callback Page

```tsx
// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store token in localStorage or cookies
      localStorage.setItem('authToken', token);

      // Redirect to dashboard or home
      router.push('/dashboard');
    } else {
      // Handle error
      router.push('/login?error=auth_failed');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Authenticating...</p>
    </div>
  );
}
```

#### Use in Login Page

```tsx
// app/login/page.tsx
import { GoogleLoginButton, FacebookLoginButton } from '@/components/OAuthButtons';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Sign In</h1>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <GoogleLoginButton />
        <FacebookLoginButton />
      </div>
    </div>
  );
}
```

---

## OAuth Provider Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Configure OAuth consent screen if needed
6. Choose **Web application** as application type
7. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
8. Copy **Client ID** and **Client Secret**

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add **Facebook Login** product
4. Navigate to **Settings > Basic**
5. Copy **App ID** and **App Secret**
6. Navigate to **Facebook Login > Settings**
7. Add Valid OAuth Redirect URIs:
   - `http://localhost:5000/api/auth/facebook/callback` (development)
   - `https://yourdomain.com/api/auth/facebook/callback` (production)
8. Make app live in **App Mode** settings

---

## Security Best Practices

1. **Environment Variables**: Store all secrets in environment variables, never commit them
2. **HTTPS**: Use HTTPS in production
3. **CORS**: Configure proper CORS settings in backend
4. **Token Validation**: Always validate JWT tokens on protected routes
5. **Token Expiration**: Set appropriate token expiration times
6. **Refresh Tokens**: Implement refresh token mechanism for long-lived sessions

---

## CORS Configuration for .NET

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://yourdomain.com")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

---

## Testing the Integration

1. Start your .NET backend: `dotnet run`
2. Start your Next.js frontend: `npm run dev`
3. Navigate to login page
4. Click Google/Facebook login button
5. Complete OAuth flow
6. Verify token is stored and user is redirected

---

## Troubleshooting

- **Redirect URI Mismatch**: Ensure callback URLs match exactly in provider settings
- **CORS Errors**: Check CORS configuration in backend
- **Token Not Received**: Verify backend is generating and returning token correctly
- **Provider Configuration**: Double-check Client IDs and Secrets are correct
