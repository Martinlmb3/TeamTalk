using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TeamTalk.Core.DTOs.Auth;
using TeamTalk.Core.Interfaces;
using TeamTalk.Core.Entities;

namespace TeamTalkApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthUserService _authService;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(IAuthUserService authService, IJwtTokenService jwtTokenService)
    {
        _authService = authService;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.Login(request);
        if (result == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] SignupRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.Register(request);
        if (result == null)
        {
            return BadRequest(new { message = "User with this email already exists" });
        }

        return CreatedAtAction(nameof(Login), result);
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userEmail = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
        if (string.IsNullOrEmpty(userEmail))
        {
            return Unauthorized();
        }

        var user = await _authService.GetUserByEmail(userEmail);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Role,
            user.ProfilePicture,
            user.CreatedAt
        });
    }

    [HttpGet("google")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback))
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme);

        if (!authenticateResult.Succeeded)
        {
            return BadRequest(new { message = "Google authentication failed" });
        }

        var claims = authenticateResult.Principal?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var firstName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value;
        var lastName = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return BadRequest(new { message = "Email not provided by Google" });
        }

        // Check if user exists, if not create a new user
        var user = await _authService.GetUserByEmail(email);
        if (user == null)
        {
            var signupRequest = new SignupRequestDto
            {
                Email = email,
                FirstName = firstName ?? "",
                LastName = lastName ?? "",
                Password = Guid.NewGuid().ToString(), // Random password for OAuth users
                Role = "player"
            };

            var result = await _authService.Register(signupRequest);
            if (result == null)
            {
                return BadRequest(new { message = "Failed to create user" });
            }

            // Redirect to frontend with token
            return Redirect($"{Request.Scheme}://{Request.Host}/auth/callback?token={result.AccessToken}&refreshToken={result.RefreshToken}");
        }

        // Generate JWT token for existing user
        var token = _jwtTokenService.GenerateAccessToken(user);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        return Redirect($"{Request.Scheme}://{Request.Host}/auth/callback?token={token}&refreshToken={refreshToken}");
    }

    [HttpGet("facebook")]
    public IActionResult FacebookLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(FacebookCallback))
        };
        return Challenge(properties, FacebookDefaults.AuthenticationScheme);
    }

    [HttpGet("facebook/callback")]
    public async Task<IActionResult> FacebookCallback()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme);

        if (!authenticateResult.Succeeded)
        {
            return BadRequest(new { message = "Facebook authentication failed" });
        }

        var claims = authenticateResult.Principal?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return BadRequest(new { message = "Email not provided by Facebook" });
        }

        // Split name into first and last name
        var nameParts = name?.Split(' ', 2);
        var firstName = nameParts?.ElementAtOrDefault(0) ?? "";
        var lastName = nameParts?.ElementAtOrDefault(1) ?? "";

        // Check if user exists, if not create a new user
        var user = await _authService.GetUserByEmail(email);
        if (user == null)
        {
            var signupRequest = new SignupRequestDto
            {
                Email = email,
                FirstName = firstName,
                LastName = lastName,
                Password = Guid.NewGuid().ToString(), // Random password for OAuth users
                Role = "player"
            };

            var result = await _authService.Register(signupRequest);
            if (result == null)
            {
                return BadRequest(new { message = "Failed to create user" });
            }

            // Redirect to frontend with token
            return Redirect($"{Request.Scheme}://{Request.Host}/auth/callback?token={result.AccessToken}&refreshToken={result.RefreshToken}");
        }

        // Generate JWT token for existing user
        var token = _jwtTokenService.GenerateAccessToken(user);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        return Redirect($"{Request.Scheme}://{Request.Host}/auth/callback?token={token}&refreshToken={refreshToken}");
    }
}