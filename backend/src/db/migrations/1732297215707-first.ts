import { MigrationInterface, QueryRunner } from "typeorm";

export class First1732297215707 implements MigrationInterface {
    name = 'First1732297215707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."video_details_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "video_details" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "url" character varying, "status" "public"."video_details_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_fe36d173468e23c23a7d23cb48f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "video_details"`);
        await queryRunner.query(`DROP TYPE "public"."video_details_status_enum"`);
    }

}
