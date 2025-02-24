using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAdjustments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserAdjustments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<double>(type: "double precision", nullable: false),
                    AdjustmentTypeCode = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAdjustments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAdjustments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAdjustments_Codifiers_AdjustmentTypeCode",
                        column: x => x.AdjustmentTypeCode,
                        principalTable: "Codifiers",
                        principalColumn: "Code");
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserAdjustments_AdjustmentTypeCode",
                table: "UserAdjustments",
                column: "AdjustmentTypeCode");

            migrationBuilder.CreateIndex(
                name: "IX_UserAdjustments_UserId",
                table: "UserAdjustments",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserAdjustments");
        }
    }
}
