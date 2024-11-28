import { MigrationInterface, QueryRunner } from "typeorm";

export class First1732326431384 implements MigrationInterface {
    name = 'First1732326431384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."video_details_status_enum" RENAME TO "video_details_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."video_details_status_enum" AS ENUM('Incomplete', 'Completed', 'Failed')`);
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "status" TYPE "public"."video_details_status_enum" USING "status"::"text"::"public"."video_details_status_enum"`);
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "status" SET DEFAULT 'Incomplete'`);
        await queryRunner.query(`DROP TYPE "public"."video_details_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."video_details_status_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "status" TYPE "public"."video_details_status_enum_old" USING "status"::"text"::"public"."video_details_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "video_details" ALTER COLUMN "status" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "public"."video_details_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."video_details_status_enum_old" RENAME TO "video_details_status_enum"`);
    }

}
