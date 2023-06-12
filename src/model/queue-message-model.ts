import { IsNotEmpty } from "class-validator";
import { AbstractDomainEntity, Prop } from "nodets-ms-core/lib/models";
import { environment } from "../environment/environment";
import { Core } from "nodets-ms-core";
import { PermissionRequest } from "nodets-ms-core/lib/core/auth/model/permission_request";

export class QueueMessageContent extends AbstractDomainEntity {
    @Prop()
    @IsNotEmpty()
    request!: any;
    @Prop("tdei_record_id")
    @IsNotEmpty()
    tdeiRecordId!: string;
    @Prop("user_id")
    @IsNotEmpty()
    userId!: string;
    @IsNotEmpty()
    @Prop("tdei_org_id")
    orgId!: string;
    @Prop()
    @IsNotEmpty()
    stage!: string;
    @Prop()
    @IsNotEmpty()
    response!: {
        success: boolean,
        message: string
    };
    @Prop()
    meta!: any;

    /**
     * To be called by Receiveing Micro-Service to validated the user roles
     * @param roles 
     * @returns 
     */
    async hasPermission(roles: tdeiRoles[]): Promise<boolean> {
        try {
            const permissionRequest = new PermissionRequest({
                userId: this.userId,
                orgId: this.orgId,
                permssions: roles,
                shouldSatisfyAll: false
            });
            // With hosted provider 
            const authProvider = Core.getAuthorizer({ provider: "Hosted", apiUrl: environment.authPermissionUrl });

            const response = await authProvider?.hasPermission(permissionRequest);
            return response ?? false;
        } catch (error) {
            console.error("Error validating the request authorization : ", error);
            return false;
        }
    }
}