import { IsNotEmpty, IsOptional } from 'class-validator';
import { Prop } from 'nodets-ms-core/lib/models';
import { QueryConfig } from 'pg';
import { BaseDto } from '../../model/base-dto';
import { Polygon, PolygonDto } from '../../model/polygon-model';
import { IsValidPolygon } from '../../validators/polygon-validator';

export class PathwayVersions extends BaseDto {
    //id!: number;
    @Prop()
    @IsNotEmpty()
    tdei_record_id: string = "";
    @Prop()
    @IsNotEmpty()
    confidence_level: number = 0;
    @Prop()
    @IsNotEmpty()
    tdei_org_id: string = "";
    @Prop()
    @IsNotEmpty()
    tdei_station_id: string = "";
    @Prop()
    @IsNotEmpty()
    file_upload_path: string = "";
    uploaded_by: string = "";
    @IsNotEmpty()
    @Prop()
    collected_by: string = "";
    @IsNotEmpty()
    @Prop()
    collection_date: Date = new Date();
    @IsNotEmpty()
    @Prop()
    collection_method: string = "";
    @IsNotEmpty()
    @Prop()
    valid_from: Date = new Date();
    @IsNotEmpty()
    @Prop()
    valid_to: Date = new Date();
    @IsNotEmpty()
    @Prop()
    data_source: string = "";
    @IsNotEmpty()
    @Prop()
    pathways_schema_version: string = "";
    @IsOptional()
    @IsValidPolygon()
    @Prop()
    polygon!: PolygonDto;

    constructor(init?: Partial<PathwayVersions>) {
        super();
        Object.assign(this, init);
    }

    /**
     * Builds the insert QueryConfig object
     * @returns QueryConfig object
     */
    getInsertQuery(): QueryConfig {
        let polygonExists = this.polygon ? true : false;
        const queryObject = {
            text: `INSERT INTO public.pathway_versions(tdei_record_id, 
                confidence_level, 
                tdei_org_id, 
                tdei_station_id, 
                file_upload_path, 
                uploaded_by,
                collected_by, 
                collection_date, 
                collection_method, valid_from, valid_to, data_source,
                pathways_schema_version ${polygonExists ? ', polygon ' : ''})
                VALUES ($1,0,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12 ${polygonExists ? ', ST_GeomFromGeoJSON($13) ' : ''})`.replace(/\n/g, ""),
            values: [this.tdei_record_id, this.tdei_org_id, this.tdei_station_id, this.file_upload_path, this.uploaded_by
                , this.collected_by, this.collection_date, this.collection_method, this.valid_from, this.valid_to, this.data_source, this.pathways_schema_version],
        }
        if (polygonExists) {
            queryObject.values.push(JSON.stringify(new Polygon({ coordinates: this.polygon.coordinates })));
        }
        return queryObject;
    }
}