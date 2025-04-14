using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddFarmInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "DefaultWage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "FarmName",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "FuelCostPerLiter",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LubricationCostsPercentage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "OtherExpensesPercentage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultWage",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FarmName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FuelCostPerLiter",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LubricationCostsPercentage",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "OtherExpensesPercentage",
                table: "AspNetUsers");
        }
    }
}
