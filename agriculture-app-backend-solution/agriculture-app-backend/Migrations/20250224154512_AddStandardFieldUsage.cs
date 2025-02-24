using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddStandardFieldUsage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "StandardFieldUsage",
                table: "UserCropTypes",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StandardFieldUsage",
                table: "UserCropTypes");
        }
    }
}
