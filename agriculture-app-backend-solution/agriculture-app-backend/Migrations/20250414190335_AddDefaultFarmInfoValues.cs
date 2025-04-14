using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultFarmInfoValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "OtherExpensesPercentage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 1.0,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<double>(
                name: "LubricationCostsPercentage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 15.0,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<double>(
                name: "FuelCostPerLiter",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 0.80000001192092896,
                oldClrType: typeof(double),
                oldType: "double precision");

            migrationBuilder.AlterColumn<double>(
                name: "DefaultWage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                defaultValue: 15.0,
                oldClrType: typeof(double),
                oldType: "double precision");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "OtherExpensesPercentage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldDefaultValue: 1.0);

            migrationBuilder.AlterColumn<double>(
                name: "LubricationCostsPercentage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldDefaultValue: 15.0);

            migrationBuilder.AlterColumn<double>(
                name: "FuelCostPerLiter",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldDefaultValue: 0.80000001192092896);

            migrationBuilder.AlterColumn<double>(
                name: "DefaultWage",
                table: "AspNetUsers",
                type: "double precision",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "double precision",
                oldDefaultValue: 15.0);
        }
    }
}
