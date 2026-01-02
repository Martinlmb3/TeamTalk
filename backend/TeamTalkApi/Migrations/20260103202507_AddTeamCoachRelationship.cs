using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeamTalkApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamCoachRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CoachId",
                table: "Teams",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Teams",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_CoachId",
                table: "Teams",
                column: "CoachId");

            migrationBuilder.AddForeignKey(
                name: "FK_Teams_Users_CoachId",
                table: "Teams",
                column: "CoachId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Teams_Users_CoachId",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_Teams_CoachId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "CoachId",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Teams");
        }
    }
}
