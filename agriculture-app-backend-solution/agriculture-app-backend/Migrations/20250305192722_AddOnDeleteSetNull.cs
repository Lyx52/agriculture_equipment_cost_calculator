using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgricultureAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddOnDeleteSetNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_MachineId",
                table: "FarmlandOperations");

            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_TractorOrCombineId",
                table: "FarmlandOperations");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_MachineId",
                table: "FarmlandOperations",
                column: "MachineId",
                principalTable: "UserEquipment",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_TractorOrCombineId",
                table: "FarmlandOperations",
                column: "TractorOrCombineId",
                principalTable: "UserEquipment",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_MachineId",
                table: "FarmlandOperations");

            migrationBuilder.DropForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_TractorOrCombineId",
                table: "FarmlandOperations");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_MachineId",
                table: "FarmlandOperations",
                column: "MachineId",
                principalTable: "UserEquipment",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FarmlandOperations_UserEquipment_TractorOrCombineId",
                table: "FarmlandOperations",
                column: "TractorOrCombineId",
                principalTable: "UserEquipment",
                principalColumn: "Id");
        }
    }
}
