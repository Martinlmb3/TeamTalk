using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TeamTalk.Core.Entities;
using TeamTalk.Core.Interfaces;
using TeamTalk.Core.Services;
using TeamTalkApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using DotNetEnv;
using TeamTalkApi.Hubs;

// Load environment variables from .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
// Add Entity Framework
builder.Services.AddDbContext<TeamTalkDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity services for password hashing
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// Add custom services
builder.Services.AddScoped<IAuthUserService, AuthService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// Clear default claim mappings
Microsoft.IdentityModel.JsonWebTokens.JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();

// Configure Authentication with JWT Bearer and OAuth providers
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]!)),
        ClockSkew = TimeSpan.Zero,
        NameClaimType = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email
    };

    // Configure JWT for SignalR (WebSocket connections)
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            // Check if the request is for SignalR
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
.AddGoogle(GoogleDefaults.AuthenticationScheme, googleOptions =>
{
    // Read from environment variables first, fallback to configuration
    googleOptions.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
        ?? builder.Configuration["Authentication:Google:ClientId"]
        ?? throw new InvalidOperationException("Google Client ID is not configured");
    googleOptions.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")
        ?? builder.Configuration["Authentication:Google:ClientSecret"]
        ?? throw new InvalidOperationException("Google Client Secret is not configured");
    googleOptions.CallbackPath = "/api/auth/google/callback";
    googleOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddFacebook(FacebookDefaults.AuthenticationScheme, facebookOptions =>
{
    // Read from environment variables first, fallback to configuration
    facebookOptions.AppId = Environment.GetEnvironmentVariable("FACEBOOK_APP_ID")
        ?? builder.Configuration["Authentication:Facebook:AppId"]
        ?? throw new InvalidOperationException("Facebook App ID is not configured");
    facebookOptions.AppSecret = Environment.GetEnvironmentVariable("FACEBOOK_APP_SECRET")
        ?? builder.Configuration["Authentication:Facebook:AppSecret"]
        ?? throw new InvalidOperationException("Facebook App Secret is not configured");
    facebookOptions.CallbackPath = "/api/auth/facebook/callback";
    facebookOptions.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
});

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add controllers
builder.Services.AddControllers();

// Add OpenAPI/Swagger
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TeamTalk API v1");
        options.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

// Disable HTTPS redirect in development for HTTP testing
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chathub");

app.Run();
