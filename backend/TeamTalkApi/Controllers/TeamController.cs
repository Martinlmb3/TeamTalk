using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TeamTalk.Core.Entities;
using TeamTalkApi.Infrastructure.Data;
using TeamTalkApi.TeamTalk.Core.Enums;

namespace TeamTalkApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TeamController : ControllerBase
    {
        private readonly TeamTalkDbContext _context;
        private readonly ILogger<TeamController> _logger;

        public TeamController(TeamTalkDbContext context, ILogger<TeamController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all teams (accessible to all authenticated users)
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAllTeams()
        {
            try
            {
                var teams = await _context.Teams
                    .Include(t => t.Coach)
                    .Select(t => new
                    {
                        t.Id,
                        t.Name,
                        t.Description,
                        Coach = new
                        {
                            t.Coach.Id,
                            t.Coach.FirstName,
                            t.Coach.LastName
                        },
                        t.CreatedAt
                    })
                    .ToListAsync();

                return Ok(teams);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving teams");
                return StatusCode(500, new { message = "An error occurred while retrieving teams" });
            }
        }

        /// <summary>
        /// Create a new team (Admin and Coach only)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "CoachOrAdmin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateTeam([FromBody] CreateTeamDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

                if (!Guid.TryParse(userIdClaim, out var userId) ||
                    !Enum.TryParse<UserRole>(userRoleClaim, out var userRole))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                // If user is Coach, they must be the coach of the team
                var coachId = userRole == UserRole.Coach ? userId : dto.CoachId;

                // Validate coach exists
                var coach = await _context.Users.FindAsync(coachId);
                if (coach == null || coach.Role != UserRole.Coach)
                {
                    return BadRequest(new { message = "Invalid coach specified" });
                }

                var team = new Team
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name,
                    Description = dto.Description,
                    CoachId = coachId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Teams.Add(team);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Team {TeamId} created by user {UserId}", team.Id, userId);

                return CreatedAtAction(nameof(GetTeamById), new { id = team.Id }, new
                {
                    team.Id,
                    team.Name,
                    team.Description,
                    team.CoachId,
                    team.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating team");
                return StatusCode(500, new { message = "An error occurred while creating the team" });
            }
        }

        /// <summary>
        /// Get team by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetTeamById(Guid id)
        {
            try
            {
                var team = await _context.Teams
                    .Include(t => t.Coach)
                    .Include(t => t.UserTeams)
                        .ThenInclude(ut => ut.User)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (team == null)
                {
                    return NotFound(new { message = "Team not found" });
                }

                var response = new
                {
                    team.Id,
                    team.Name,
                    team.Description,
                    Coach = new
                    {
                        team.Coach.Id,
                        team.Coach.FirstName,
                        team.Coach.LastName,
                        team.Coach.Email
                    },
                    Members = team.UserTeams.Select(ut => new
                    {
                        ut.User.Id,
                        ut.User.FirstName,
                        ut.User.LastName,
                        ut.User.Email,
                        ut.User.Role,
                        ut.JoinedAt
                    }),
                    team.CreatedAt,
                    team.UpdatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving team {TeamId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the team" });
            }
        }

        /// <summary>
        /// Update team (Admin, Coach who owns the team, or Captain)
        /// </summary>
        [HttpPatch("{id}")]
        [Authorize(Policy = "TeamManagement")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTeam(Guid id, [FromBody] UpdateTeamDto dto)
        {
            try
            {
                var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

                if (!Guid.TryParse(userIdClaim, out var userId) ||
                    !Enum.TryParse<UserRole>(userRoleClaim, out var userRole))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var team = await _context.Teams.FindAsync(id);
                if (team == null)
                {
                    return NotFound(new { message = "Team not found" });
                }

                // Check permissions: Admin can edit any team, Coach can edit their own team
                if (userRole != UserRole.Admin && team.CoachId != userId)
                {
                    // Check if user is a Captain of this team
                    var isCaptain = await _context.UserTeams
                        .AnyAsync(ut => ut.TeamId == id && ut.UserId == userId &&
                                       ut.User.Role == UserRole.Captain);

                    if (!isCaptain)
                    {
                        return Forbid();
                    }
                }

                // Update fields
                if (!string.IsNullOrEmpty(dto.Name))
                    team.Name = dto.Name;

                if (dto.Description != null)
                    team.Description = dto.Description;

                team.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Team {TeamId} updated by user {UserId}", id, userId);

                return Ok(new { message = "Team updated successfully", team });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating team {TeamId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the team" });
            }
        }

        /// <summary>
        /// Delete team (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTeam(Guid id)
        {
            try
            {
                var team = await _context.Teams.FindAsync(id);
                if (team == null)
                {
                    return NotFound(new { message = "Team not found" });
                }

                _context.Teams.Remove(team);
                await _context.SaveChangesAsync();

                var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
                _logger.LogInformation("Team {TeamId} deleted by admin {UserId}", id, userId);

                return Ok(new { message = "Team deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting team {TeamId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the team" });
            }
        }
    }

    // DTOs
    public record CreateTeamDto(string Name, string Description, Guid CoachId);
    public record UpdateTeamDto(string? Name, string? Description);
}
