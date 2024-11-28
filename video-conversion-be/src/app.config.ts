import { registerAs } from "@nestjs/config";

export default registerAs('appConfig', () => ({
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USER_NAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME
    },
    s3: {
        bucket: process.env.S3_BUCKET,
        output: process.env.OUTPUT_BUCKET
    },
    aws: {
        region: process.env.AWS_REGION,
        profile: process.env.AWS_PROFILE,
        sqsUrl: process.env.AWS_SQS_URL,
        sqsName: process.env.AWS_SQS_NAME
    }
}))