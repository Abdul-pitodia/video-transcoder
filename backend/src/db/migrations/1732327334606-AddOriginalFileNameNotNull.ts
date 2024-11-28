import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginalFileNameNotNull1732327334606 implements MigrationInterface {
    name = 'AddOriginalFileNameNotNull1732327334606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "originalName" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "originalName" DROP NOT NULL`);
    }

}
