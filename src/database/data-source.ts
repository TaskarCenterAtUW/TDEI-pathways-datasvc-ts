import "reflect-metadata";
import { DataSource } from "typeorm";
import { FlexVersions } from "./entity/flex-version-entity";
import dotenv from 'dotenv';
import { environment } from "../environment/environment";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: environment.database.port,
    username: environment.database.username,
    password: environment.database.password,
    database: environment.database.database,
    synchronize: true,
    logging: true,
    entities: [FlexVersions],
    migrations: [],
    subscribers: [],
})
