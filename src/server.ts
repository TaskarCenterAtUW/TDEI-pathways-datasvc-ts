import App from './app';
import dotenv from 'dotenv';
import "reflect-metadata";
import GtfsPathwaysController from './controller/gtfs-pathways-controller';
import { DataSource } from 'typeorm';
import { AppDataSource } from './database/data-source';
import HealthController from './controller/health-controller';
import { environment } from './environment/environment';

//Load environment variables
dotenv.config()

const PORT: number = environment.appPort;

new App(
    [
        new GtfsPathwaysController(),
        new HealthController()
    ],
    PORT,
).listen();

//Initialize the database
AppDataSource.initialize().then(async (dataSource: DataSource) => {
    console.log("Database initialized successfully !");
}).catch(error => console.log("Error setting up the database : ", error))


