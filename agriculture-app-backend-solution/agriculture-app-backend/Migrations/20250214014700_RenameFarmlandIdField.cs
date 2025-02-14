using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class RenameFarmlandIdField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserFarmlands_UserFarmFieldId",
                table: "FarmlandOperations");

            migrationBuilder.RenameColumn(
                name: "UserFarmFieldId",
                table: "FarmlandOperations",
                newName: "UserFarmlandId");

            migrationBuilder.RenameIndex(
                name: "IX_FarmlandOperations_UserFarmFieldId",
                table: "FarmlandOperations",
                newName: "IX_FarmlandOperations_UserFarmlandId");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserFarmlands_UserFarmlandId",
                table: "FarmlandOperations",
                column: "UserFarmlandId",
                principalTable: "UserFarmlands",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserFarmlands_UserFarmlandId",
                table: "FarmlandOperations");

            migrationBuilder.RenameColumn(
                name: "UserFarmlandId",
                table: "FarmlandOperations",
                newName: "UserFarmFieldId");

            migrationBuilder.RenameIndex(
                name: "IX_FarmlandOperations_UserFarmlandId",
                table: "FarmlandOperations",
                newName: "IX_FarmlandOperations_UserFarmFieldId");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserFarmlands_UserFarmFieldId",
                table: "FarmlandOperations",
                column: "UserFarmFieldId",
                principalTable: "UserFarmlands",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
