import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFormats1732433437850 implements MigrationInterface {
    name = 'AddFormats1732433437850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" ADD "conversionFormat" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "video_details" ADD "conversionResolution" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_details" DROP COLUMN "conversionResolution"`);
        await queryRunner.query(`ALTER TABLE "video_details" DROP COLUMN "conversionFormat"`);
    }

}
