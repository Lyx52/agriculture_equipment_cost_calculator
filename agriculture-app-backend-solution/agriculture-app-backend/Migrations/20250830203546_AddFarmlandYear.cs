using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddFarmlandYear : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "UserFarmlands",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Year",
                table: "UserFarmlands");
        }
    }
}
