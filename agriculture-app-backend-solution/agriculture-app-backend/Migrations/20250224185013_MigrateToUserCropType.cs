using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class MigrateToUserCropType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFarmlands_Codifiers_ProductCode",
                table: "UserFarmlands");

            migrationBuilder.RenameColumn(
                name: "ProductCode",
                table: "UserFarmlands",
                newName: "ProductCropTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_UserFarmlands_ProductCode",
                table: "UserFarmlands",
                newName: "IX_UserFarmlands_ProductCropTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFarmlands_UserCropTypes_ProductCropTypeId",
                table: "UserFarmlands",
                column: "ProductCropTypeId",
                principalTable: "UserCropTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFarmlands_UserCropTypes_ProductCropTypeId",
                table: "UserFarmlands");

            migrationBuilder.RenameColumn(
                name: "ProductCropTypeId",
                table: "UserFarmlands",
                newName: "ProductCode");

            migrationBuilder.RenameIndex(
                name: "IX_UserFarmlands_ProductCropTypeId",
                table: "UserFarmlands",
                newName: "IX_UserFarmlands_ProductCode");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFarmlands_Codifiers_ProductCode",
                table: "UserFarmlands",
                column: "ProductCode",
                principalTable: "Codifiers",
                principalColumn: "Code");
        }
    }
}
