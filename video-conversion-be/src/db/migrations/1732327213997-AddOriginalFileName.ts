import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginalFileName1732327213997 implements MigrationInterface {
    name = 'AddOriginalFileName1732327213997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" ADD "originalName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" DROP COLUMN "originalName"`);
    }

}
