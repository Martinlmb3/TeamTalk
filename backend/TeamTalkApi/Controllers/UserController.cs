using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TeamTalkApi.DTOs;
using TeamTalkApi.Infrastructure.Data;

namespace TeamTalkApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly TeamTalkDbContext _context;
        private readonly ILogger<UserController> _logger;

        public UserController(TeamTalkDbContext context, ILogger<UserController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Update user profile (partial update - only updates provided fields)
        /// </summary>
        /// <param name="patchProfileDto">Profile fields to update (all optional)</param>
        /// <returns>Updated user profile</returns>
        [HttpPatch("profile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProfile([FromBody] PatchProfileDto patchProfileDto)
        {
            try
            {
                // Get user ID from JWT token (Sub claim contains the user's GUID)
                var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (patchProfileDto.FirstName != null)
                    user.FirstName = patchProfileDto.FirstName;

                if (patchProfileDto.LastName != null)
                    user.LastName = patchProfileDto.LastName;

                if (patchProfileDto.Email != null)
                    user.Email = patchProfileDto.Email;

                if (patchProfileDto.City != null)
                    user.City = patchProfileDto.City;

                if (patchProfileDto.Country != null)
                    user.Country = patchProfileDto.Country;

                if (patchProfileDto.ProfilePicture != null)
                    user.ProfilePicture = patchProfileDto.ProfilePicture;

                if (patchProfileDto.Provider.HasValue)
                    user.AuthProvider = patchProfileDto.Provider.Value;

                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} updated their profile", userId);

                var response = new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    city = user.City,
                    country = user.Country,
                    profilePicture = user.ProfilePicture,
                    provider = user.AuthProvider.ToString(),
                    role = user.Role.ToString(),
                    createdAt = user.CreatedAt
                };

                return Ok(new { message = "Profile updated successfully", user = response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile for user");
                return StatusCode(500, new { message = "An error occurred while updating the profile" });
            }
        }

        /// <summary>
        /// Get current user profile
        /// </summary>
        /// <returns>User profile data</returns>
        [HttpGet("profile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                // Get user ID from JWT token (Sub claim contains the user's GUID)
                var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var response = new
                {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    city = user.City,
                    country = user.Country,
                    profilePicture = user.ProfilePicture,
                    provider = user.AuthProvider.ToString(),
                    role = user.Role.ToString(),
                    createdAt = user.CreatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile for user");
                return StatusCode(500, new { message = "An error occurred while retrieving the profile" });
            }
        }

        /// <summary>
        /// Update user role (for users who registered without selecting a role)
        /// </summary>
        [HttpPatch("role")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleDto updateRoleDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                user.Role = updateRoleDto.Role;
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} updated their role to {Role}", userId, user.Role);

                return Ok(new { message = "Role updated successfully", role = user.Role.ToString() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating role for user");
                return StatusCode(500, new { message = "An error occurred while updating the role" });
            }
        }
    }
}
