using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserFarmlandToAdjustment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserFarmlandId",
                table: "UserAdjustments",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserAdjustments_UserFarmlandId",
                table: "UserAdjustments",
                column: "UserFarmlandId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserAdjustments_UserFarmlands_UserFarmlandId",
                table: "UserAdjustments",
                column: "UserFarmlandId",
                principalTable: "UserFarmlands",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserAdjustments_UserFarmlands_UserFarmlandId",
                table: "UserAdjustments");

            migrationBuilder.DropIndex(
                name: "IX_UserAdjustments_UserFarmlandId",
                table: "UserAdjustments");

            migrationBuilder.DropColumn(
                name: "UserFarmlandId",
                table: "UserAdjustments");
        }
    }
}
