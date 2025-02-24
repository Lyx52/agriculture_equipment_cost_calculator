using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddIsCustomCropType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCustom",
                table: "UserCropTypes",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCustom",
                table: "UserCropTypes");
        }
    }
}
