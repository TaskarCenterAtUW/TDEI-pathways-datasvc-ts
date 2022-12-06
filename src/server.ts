import App from './app';
import dotenv from 'dotenv';
import "reflect-metadata";
import gtfsPathwaysController from './controller/gtfs-pathways-controller';
import { DataSource } from 'typeorm';
import { AppDataSource } from './database/data-source';
import healthController from './controller/health-controller';
import { environment } from './environment/environment';

//Load environment variables
dotenv.config()

const PORT: number = environment.appPort;

new App(
    [
        gtfsPathwaysController,
        healthController
    ],
    PORT,
).listen();

//Initialize the database
AppDataSource.initialize().then(async (dataSource: DataSource) => {
    console.log("Database initialized successfully !");
}).catch(error => console.log("Error setting up the database : ", error))


