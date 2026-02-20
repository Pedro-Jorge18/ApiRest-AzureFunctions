import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateExportControlTable1707500000000 implements MigrationInterface {
    name = 'CreateExportControlTable1707500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "export_control",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "export_type",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "last_export_at",
                        type: "timestamp",
                    },
                    {
                        name: "total_records_exported",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("export_control");
    }
}
