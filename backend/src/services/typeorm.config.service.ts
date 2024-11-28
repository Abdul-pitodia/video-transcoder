import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { AppConfigService } from "./app.config.service";
import { Injectable } from "@nestjs/common";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { VideoDetails } from "src/models/video.entity";


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    private postgresOpts: PostgresConnectionOptions = {
        type: 'postgres',
        host: this.appConfigService.databaseHost,
        username: this.appConfigService.databaseUserName,
        port: +this.appConfigService.databasePort,
        database: this.appConfigService.databaseName,
        password: this.appConfigService.databasePassword,
        entities: [VideoDetails],
    }

    constructor(private appConfigService: AppConfigService){}

    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        return this.postgresOpts
    }

}