using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserResources : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Codifiers_Codifiers_ParentCode",
                table: "Codifiers");

            migrationBuilder.CreateTable(
                name: "UserFarmlands",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Area = table.Column<double>(type: "double precision", nullable: false),
                    ProductCode = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFarmlands", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserFarmlands_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFarmlands_Codifiers_ProductCode",
                        column: x => x.ProductCode,
                        principalTable: "Codifiers",
                        principalColumn: "Code");
                });

            migrationBuilder.CreateTable(
                name: "FarmlandOperations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    TractorOrCombineId = table.Column<string>(type: "text", nullable: true),
                    MachineId = table.Column<string>(type: "text", nullable: true),
                    OperationCode = table.Column<string>(type: "text", nullable: true),
                    UserFarmFieldId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FarmlandOperations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FarmlandOperations_Codifiers_OperationCode",
                        column: x => x.OperationCode,
                        principalTable: "Codifiers",
                        principalColumn: "Code");
                    table.ForeignKey(
                        name: "FK_FarmlandOperations_UserEquipment_MachineId",
                        column: x => x.MachineId,
                        principalTable: "UserEquipment",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FarmlandOperations_UserEquipment_TractorOrCombineId",
                        column: x => x.TractorOrCombineId,
                        principalTable: "UserEquipment",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FarmlandOperations_UserFarmlands_UserFarmFieldId",
                        column: x => x.UserFarmFieldId,
                        principalTable: "UserFarmlands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FarmlandOperations_MachineId",
                table: "FarmlandOperations",
                column: "MachineId");

            migrationBuilder.CreateIndex(
                name: "IX_FarmlandOperations_OperationCode",
                table: "FarmlandOperations",
                column: "OperationCode");

            migrationBuilder.CreateIndex(
                name: "IX_FarmlandOperations_TractorOrCombineId",
                table: "FarmlandOperations",
                column: "TractorOrCombineId");

            migrationBuilder.CreateIndex(
                name: "IX_FarmlandOperations_UserFarmFieldId",
                table: "FarmlandOperations",
                column: "UserFarmFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFarmlands_ProductCode",
                table: "UserFarmlands",
                column: "ProductCode");

            migrationBuilder.CreateIndex(
                name: "IX_UserFarmlands_UserId",
                table: "UserFarmlands",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Codifiers_Codifiers_ParentCode",
                table: "Codifiers",
                column: "ParentCode",
                principalTable: "Codifiers",
                principalColumn: "Code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Codifiers_Codifiers_ParentCode",
                table: "Codifiers");

            migrationBuilder.DropTable(
                name: "FarmlandOperations");

            migrationBuilder.DropTable(
                name: "UserFarmlands");

            migrationBuilder.AddForeignKey(
                name: "FK_Codifiers_Codifiers_ParentCode",
                table: "Codifiers",
                column: "ParentCode",
                principalTable: "Codifiers",
                principalColumn: "Code",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
