using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskFlow.EntityFrameworkCore.Migrations
{
    /// <inheritdoc />
    public partial class Create_Todo_Item_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    ColorHex = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppCategories_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppTodoItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false),
                    DueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsArchived = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    ArchivedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTodoItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTodoItems_AppCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "AppCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppTodoItems_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppActivityLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ActionKey = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    OldValue = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    NewValue = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TodoItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppActivityLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppActivityLogs_AppTodoItems_TodoItemId",
                        column: x => x.TodoItemId,
                        principalTable: "AppTodoItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppActivityLogs_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppTodoComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: false),
                    TodoItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterId = table.Column<Guid>(type: "uuid", maxLength: 256, nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTodoComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTodoComments_AppTodoItems_TodoItemId",
                        column: x => x.TodoItemId,
                        principalTable: "AppTodoItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppTodoComments_AppUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AppUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_CreationTime",
                table: "AppActivityLogs",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_CreatorId",
                table: "AppActivityLogs",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_DeleterId",
                table: "AppActivityLogs",
                column: "DeleterId");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_DeletionTime",
                table: "AppActivityLogs",
                column: "DeletionTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_IsDeleted",
                table: "AppActivityLogs",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_LastModificationTime",
                table: "AppActivityLogs",
                column: "LastModificationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_LastModifierId",
                table: "AppActivityLogs",
                column: "LastModifierId");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_TodoItemId",
                table: "AppActivityLogs",
                column: "TodoItemId");

            migrationBuilder.CreateIndex(
                name: "IX_AppActivityLogs_UserId",
                table: "AppActivityLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_CreationTime",
                table: "AppCategories",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_CreatorId",
                table: "AppCategories",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_DeleterId",
                table: "AppCategories",
                column: "DeleterId");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_DeletionTime",
                table: "AppCategories",
                column: "DeletionTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_IsDeleted",
                table: "AppCategories",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_LastModificationTime",
                table: "AppCategories",
                column: "LastModificationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_LastModifierId",
                table: "AppCategories",
                column: "LastModifierId");

            migrationBuilder.CreateIndex(
                name: "IX_AppCategories_UserId",
                table: "AppCategories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_CreationTime",
                table: "AppTodoComments",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_CreatorId",
                table: "AppTodoComments",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_DeleterId",
                table: "AppTodoComments",
                column: "DeleterId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_DeletionTime",
                table: "AppTodoComments",
                column: "DeletionTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_IsDeleted",
                table: "AppTodoComments",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_LastModificationTime",
                table: "AppTodoComments",
                column: "LastModificationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_LastModifierId",
                table: "AppTodoComments",
                column: "LastModifierId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_TodoItemId",
                table: "AppTodoComments",
                column: "TodoItemId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoComments_UserId",
                table: "AppTodoComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_CategoryId",
                table: "AppTodoItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_CreationTime",
                table: "AppTodoItems",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_CreatorId",
                table: "AppTodoItems",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_DeleterId",
                table: "AppTodoItems",
                column: "DeleterId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_DeletionTime",
                table: "AppTodoItems",
                column: "DeletionTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_IsDeleted",
                table: "AppTodoItems",
                column: "IsDeleted");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_LastModificationTime",
                table: "AppTodoItems",
                column: "LastModificationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_LastModifierId",
                table: "AppTodoItems",
                column: "LastModifierId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTodoItems_UserId",
                table: "AppTodoItems",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppActivityLogs");

            migrationBuilder.DropTable(
                name: "AppTodoComments");

            migrationBuilder.DropTable(
                name: "AppTodoItems");

            migrationBuilder.DropTable(
                name: "AppCategories");
        }
    }
}
