using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddExtraRequiredEquipmentParams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "ExpectedAge",
                table: "UserEquipment",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "PurchaseDate",
                table: "UserEquipment",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "UsageHoursPerYear",
                table: "UserEquipment",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpectedAge",
                table: "UserEquipment");

            migrationBuilder.DropColumn(
                name: "PurchaseDate",
                table: "UserEquipment");

            migrationBuilder.DropColumn(
                name: "UsageHoursPerYear",
                table: "UserEquipment");
        }
    }
}
