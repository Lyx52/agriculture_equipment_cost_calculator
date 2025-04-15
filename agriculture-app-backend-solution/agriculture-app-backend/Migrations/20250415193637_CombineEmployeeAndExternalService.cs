using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class CombineEmployeeAndExternalService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_EmployeeId",
                table: "FarmlandOperations");

            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_ExternalServiceId",
                table: "FarmlandOperations");

            migrationBuilder.RenameColumn(
                name: "ExternalServiceId",
                table: "FarmlandOperations",
                newName: "UserAdjustmentId");

            migrationBuilder.RenameColumn(
                name: "EmployeeId",
                table: "FarmlandOperations",
                newName: "EmployeeOrExternalServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_FarmlandOperations_ExternalServiceId",
                table: "FarmlandOperations",
                newName: "IX_FarmlandOperations_UserAdjustmentId");

            migrationBuilder.RenameIndex(
                name: "IX_FarmlandOperations_EmployeeId",
                table: "FarmlandOperations",
                newName: "IX_FarmlandOperations_EmployeeOrExternalServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_EmployeeOrExternalServic~",
                table: "FarmlandOperations",
                column: "EmployeeOrExternalServiceId",
                principalTable: "UserAdjustments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_UserAdjustmentId",
                table: "FarmlandOperations",
                column: "UserAdjustmentId",
                principalTable: "UserAdjustments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_EmployeeOrExternalServic~",
                table: "FarmlandOperations");

            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_UserAdjustmentId",
                table: "FarmlandOperations");

            migrationBuilder.RenameColumn(
                name: "UserAdjustmentId",
                table: "FarmlandOperations",
                newName: "ExternalServiceId");

            migrationBuilder.RenameColumn(
                name: "EmployeeOrExternalServiceId",
                table: "FarmlandOperations",
                newName: "EmployeeId");

            migrationBuilder.RenameIndex(
                name: "IX_FarmlandOperations_UserAdjustmentId",
                table: "FarmlandOperations",
                newName: "IX_FarmlandOperations_ExternalServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_FarmlandOperations_EmployeeOrExternalServiceId",
                table: "FarmlandOperations",
                newName: "IX_FarmlandOperations_EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_EmployeeId",
                table: "FarmlandOperations",
                column: "EmployeeId",
                principalTable: "UserAdjustments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserAdjustments_ExternalServiceId",
                table: "FarmlandOperations",
                column: "ExternalServiceId",
                principalTable: "UserAdjustments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
