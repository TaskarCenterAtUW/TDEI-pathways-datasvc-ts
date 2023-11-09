import { PathwayVersions } from "../database/entity/pathways-version-entity";
import gtfsPathwaysService from "./gtfs-pathways-service";
import { IEventBusServiceInterface } from "./interface/event-bus-service-interface";
import { validate, ValidationError } from 'class-validator';
import { AzureQueueConfig } from "nodets-ms-core/lib/core/queue/providers/azure-queue-config";
import { environment } from "../environment/environment";
import { Core } from "nodets-ms-core";
import { QueueMessageContent } from "../model/queue-message-model";
import { Topic } from "nodets-ms-core/lib/core/queue/topic";
import { QueueMessage } from "nodets-ms-core/lib/core/queue";
import { randomUUID } from "crypto";
import { GtfsPathwaysUploadMeta } from "../model/gtfs-pathways-upload-meta";

/**
 * Event Service Bus Class
 */
export class EventBusService implements IEventBusServiceInterface {
    private queueConfig: AzureQueueConfig;
    publishingTopic: Topic;
    public uploadTopic: Topic;

    /**
     * Event bus constructor
     * @param queueConnection  Queue connection string
     * @param publishingTopicName Publishing topic name
     */
    constructor(queueConnection: string = environment.eventBus.connectionString as string,
        publishingTopicName: string = environment.eventBus.dataServiceTopic as string) {
        Core.initialize();
        this.queueConfig = new AzureQueueConfig();
        this.queueConfig.connectionString = queueConnection;
        this.publishingTopic = Core.getTopic(publishingTopicName);
        this.uploadTopic = Core.getTopic(environment.eventBus.uploadTopic as string);
    }

    // function to handle messages
    private processUpload = async (messageReceived: any) => {
        let tdeiRecordId = "";
        try {
            const queueMessage = QueueMessageContent.from(messageReceived.data);
            if (queueMessage.tdeiRecordId !== null && queueMessage.tdeiRecordId !== undefined) {
                tdeiRecordId = queueMessage.tdeiRecordId;
            }

            console.log("Received message for : ", queueMessage.tdeiRecordId, "Message received for gtfs pathways processing !");

            if (!queueMessage.response.success) {
                const errorMessage = "Received failed workflow request";
                console.error(queueMessage.tdeiRecordId, errorMessage, messageReceived);
                return Promise.resolve();
            }

            if (!await queueMessage.hasPermission(["tdei-admin", "poc", "pathways_data_generator"])) {
                const errorMessage = "Unauthorized request !";
                console.error(queueMessage.tdeiRecordId, errorMessage);
                throw Error(errorMessage);
            }

            const pathwayVersions: PathwayVersions = PathwayVersions.from(queueMessage.request);
            pathwayVersions.tdei_record_id = queueMessage.tdeiRecordId;
            pathwayVersions.uploaded_by = queueMessage.userId;
            pathwayVersions.file_upload_path = queueMessage.meta.file_upload_path;
            console.info(`Received message: ${messageReceived.data}`);

            validate(pathwayVersions).then(errors => {
                // errors is an array of validation errors
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => Object.values(<any>error.constraints)).join(', ');
                    console.error('Upload pathways file metadata information failed validation. errors: ', errors);
                    this.publish(messageReceived,
                        {
                            success: false,
                            message: 'Upload pathways file metadata information failed validation. errors: ' + message
                        });
                    return Promise.resolve();
                } else {
                    // New format does not have to store the information. Just publish the message.
                    this.publish(messageReceived,
                        {
                            success: true,
                            message: 'GTFS Pathways request processed successfully !'
                        });
                    return Promise.resolve();
                }
            });
        } catch (error) {
            console.error(tdeiRecordId, 'Error occured while processing gtfs pathways request', error);
            await this.publish(messageReceived,
                {
                    success: false,
                    message: 'Error occured while processing gtfs pathways request' + error
                });
            return Promise.resolve();
        }
    };

    private async publish(queueMessage: QueueMessage, response: {
        success: boolean,
        message: string
    }) {
        const queueMessageContent: QueueMessageContent = QueueMessageContent.from(queueMessage.data);
        //Set validation stage
        queueMessageContent.stage = 'gtfs-pathways-data-service';
        //Set response
        queueMessageContent.response.success = response.success;
        queueMessageContent.response.message = response.message;
        await this.publishingTopic.publish(QueueMessage.from(
            {
                messageType: 'gtfs-pathways-data-service',
                data: queueMessageContent,
                publishedDate: new Date(),
                message: "GTFS Pathways data service output",
                messageId: randomUUID().toString()
            }
        ));
        console.log("Publishing message for : ", queueMessageContent.tdeiRecordId);
    }

    // function to handle any errors
    private processUploadError = async (error: any) => {
        console.error(error);
    };

    subscribeUpload(validationTopic: string = environment.eventBus.validationTopic as string,
        validationSubscription: string = environment.eventBus.validationSubscription as string): void {
        Core.getTopic(validationTopic,
            this.queueConfig)
            .subscribe(validationSubscription, {
                onReceive: this.processUpload,
                onError: this.processUploadError
            });
    }

     /**
     * Publishes the upload of a gtfs-pathways file
     */
     public publishUpload(request:GtfsPathwaysUploadMeta, recordId:string,file_upload_path:string, userId:string, meta_file_path:string){
        const messageContent =  QueueMessageContent.from({
             stage:'pathways-upload',
             request:request,
             userId:userId,
             orgId:request.tdei_project_group_id,
             tdeiRecordId:recordId,
             meta:{
                 'file_upload_path':file_upload_path,
                 'meta_file_path':meta_file_path
             },
             response:{
                 success:true,
                 message:'File uploaded for the organization: '+request.tdei_project_group_id+' with record id'+recordId
             }
         });
         const message = QueueMessage.from(
             {
                 messageType:'gtfs-pathways-upload',
                 data:messageContent,
 
             }
         )
         this.uploadTopic.publish(message);
     }


}

// const eventBusService = new EventBusService();
/**
 * event service bus instance
 */
// export default eventBusService;