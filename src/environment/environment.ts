import dotenv from 'dotenv';
dotenv.config();
/**
 * Contains all the configurations required for setting up the core project
 * While most of the parameters are optional, appInsights connection is 
 * a required parameter since it is auto imported in the `tdei_logger.ts`
 */
export const environment = {
    appName: process.env.npm_package_name,
    eventBus: {
        connectionString: process.env.EVENTBUSCONNECTION,
        uploadTopic: process.env.UPLOADTOPIC,
        uploadSubscription: process.env.UPLOADSUBSCRIPTION
    },
    database: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
    },
    appPort: parseInt(process.env.APPLICATION_PORT ?? "8080")
}