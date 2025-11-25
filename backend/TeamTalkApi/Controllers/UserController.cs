using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        /// Update user profile (partial update)
        /// </summary>
        /// <param name="updateProfileDto">Profile data to update</param>
        /// <returns>Updated user profile</returns>
        [HttpPatch("profile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            try
            {
                // Get user ID from JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                // Find user in database
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Check if email is being changed and if it's already taken
                if (user.Email != updateProfileDto.Email)
                {
                    var emailExists = await _context.Users
                        .AnyAsync(u => u.Email == updateProfileDto.Email && u.Id != userId);

                    if (emailExists)
                    {
                        return BadRequest(new { message = "Email is already in use" });
                    }
                }

                // Update user properties
                user.FirstName = updateProfileDto.FirstName;
                user.LastName = updateProfileDto.LastName;
                user.Email = updateProfileDto.Email;
                user.City = updateProfileDto.City;
                user.Country = updateProfileDto.Country;
                user.ProfilePicture = updateProfileDto.ProfilePicture;
                user.AuthProvider = updateProfileDto.Provider;

                // Save changes
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} updated their profile", userId);

                // Return updated profile
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
        /// Replace user profile (complete update)
        /// </summary>
        /// <param name="updateProfileDto">Complete profile data</param>
        /// <returns>Updated user profile</returns>
        [HttpPut("profile")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ReplaceProfile([FromBody] UpdateProfileDto updateProfileDto)
        {
            try
            {
                // Get user ID from JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                // Find user in database
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Check if email is being changed and if it's already taken
                if (user.Email != updateProfileDto.Email)
                {
                    var emailExists = await _context.Users
                        .AnyAsync(u => u.Email == updateProfileDto.Email && u.Id != userId);

                    if (emailExists)
                    {
                        return BadRequest(new { message = "Email is already in use" });
                    }
                }

                // Replace all user properties (complete update)
                user.FirstName = updateProfileDto.FirstName;
                user.LastName = updateProfileDto.LastName;
                user.Email = updateProfileDto.Email;
                user.City = updateProfileDto.City;
                user.Country = updateProfileDto.Country;
                user.ProfilePicture = updateProfileDto.ProfilePicture;
                user.AuthProvider = updateProfileDto.Provider;

                // Save changes
                await _context.SaveChangesAsync();

                _logger.LogInformation("User {UserId} replaced their profile", userId);

                // Return updated profile
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

                return Ok(new { message = "Profile replaced successfully", user = response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error replacing profile for user");
                return StatusCode(500, new { message = "An error occurred while replacing the profile" });
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
                // Get user ID from JWT token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                // Find user in database
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Return profile
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
    }
}
