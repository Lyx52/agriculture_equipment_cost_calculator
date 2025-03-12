using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddExternalService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExternalServiceId",
                table: "FarmlandOperations",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FarmlandOperations_ExternalServiceId",
                table: "FarmlandOperations",
                column: "ExternalServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_ExternalServiceId",
                table: "FarmlandOperations",
                column: "ExternalServiceId",
                principalTable: "UserAdjustments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_ExternalServiceId",
                table: "FarmlandOperations");

            migrationBuilder.DropIndex(
                name: "IX_FarmlandOperations_ExternalServiceId",
                table: "FarmlandOperations");

            migrationBuilder.DropColumn(
                name: "ExternalServiceId",
                table: "FarmlandOperations");
        }
    }
}
