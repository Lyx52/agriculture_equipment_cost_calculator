using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddOperationEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmployeeId",
                table: "FarmlandOperations",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FarmlandOperations_EmployeeId",
                table: "FarmlandOperations",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_EmployeeId",
                table: "FarmlandOperations",
                column: "EmployeeId",
                principalTable: "UserAdjustments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_EmployeeId",
                table: "FarmlandOperations");

            migrationBuilder.DropIndex(
                name: "IX_FarmlandOperations_EmployeeId",
                table: "FarmlandOperations");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "FarmlandOperations");
        }
    }
}
