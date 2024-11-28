import { Inject, Injectable } from "@nestjs/common/decorators";
import { ConfigType } from "@nestjs/config";
import appConfig from "src/app.config";


@Injectable()
export class AppConfigService {
    constructor(@Inject(appConfig.KEY) private appConfiguration: ConfigType<typeof appConfig>){}
    
    get databasePort() {
        return this.appConfiguration.database.port
    }
    
    get databaseName(){
        return this.appConfiguration.database.name
    }
    
    get databaseHost(){
        return this.appConfiguration.database.host
    }
    
    get databaseUserName(){
        return this.appConfiguration.database.user
    }
    
    get databasePassword(){
        return this.appConfiguration.database.password
    }
    
    get videoStorageBucket(): string {
        return this.appConfiguration.s3.bucket
    }

    get videoOutputBucket(): string {
        return this.appConfiguration.s3.output
    }
    
    get awsRegion(): string {
        return this.appConfiguration.aws.region
    }
    
    get awsProfile(): string {
        return this.appConfiguration.aws.profile
    }
    
    get getSqsUrl(): string {
        return this.appConfiguration.aws.sqsUrl
    }

    get getSqsName(): string {
        return this.appConfiguration.aws.sqsName
    }
}