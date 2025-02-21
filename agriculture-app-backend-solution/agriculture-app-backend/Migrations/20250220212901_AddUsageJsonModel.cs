using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddUsageJsonModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpectedAge",
                table: "UserEquipment");

            migrationBuilder.DropColumn(
                name: "UsageHoursPerYear",
                table: "UserEquipment");

            migrationBuilder.AddColumn<string>(
                name: "Usage",
                table: "UserEquipment",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Usage",
                table: "UserEquipment");

            migrationBuilder.AddColumn<double>(
                name: "ExpectedAge",
                table: "UserEquipment",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "UsageHoursPerYear",
                table: "UserEquipment",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
