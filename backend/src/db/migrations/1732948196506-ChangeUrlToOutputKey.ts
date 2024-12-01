import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUrlToOutputKey1732948196506 implements MigrationInterface {
    name = 'ChangeUrlToOutputKey1732948196506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" RENAME COLUMN "url" TO "key"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" RENAME COLUMN "key" TO "url"`);
    }

}
