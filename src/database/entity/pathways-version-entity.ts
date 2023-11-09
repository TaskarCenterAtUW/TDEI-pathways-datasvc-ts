import { IsNotEmpty, IsOptional } from 'class-validator';
import { Prop } from 'nodets-ms-core/lib/models';
import { QueryConfig } from 'pg';
import { BaseDto } from '../../model/base-dto';
import { IsValidPolygon } from '../../validators/polygon-validator';
import { FeatureCollection } from 'geojson';

export class PathwayVersions extends BaseDto {
    //id!: number;
    @Prop()
    @IsNotEmpty()
    tdei_record_id!: string;
    @Prop()
    @IsNotEmpty()
    confidence_level = 0;
    @Prop()
    @IsNotEmpty()
    tdei_project_group_id!: string;
    @Prop()
    @IsNotEmpty()
    tdei_station_id!: string;
    @Prop()
    @IsNotEmpty()
    file_upload_path!: string;
    uploaded_by!: string;
    @IsNotEmpty()
    @Prop()
    collected_by!: string;
    @IsNotEmpty()
    @Prop()
    collection_date!: Date;
    @IsNotEmpty()
    @Prop()
    collection_method!: string;
    @IsNotEmpty()
    @Prop()
    valid_from!: Date;
    @IsNotEmpty()
    @Prop()
    valid_to!: Date;
    @IsNotEmpty()
    @Prop()
    data_source!: string;
    @IsNotEmpty()
    @Prop()
    pathways_schema_version!: string;
    @IsOptional()
    @IsValidPolygon()
    @Prop()
    polygon!: FeatureCollection;

    constructor(init?: Partial<PathwayVersions>) {
        super();
        Object.assign(this, init);
    }

    /**
     * Builds the insert QueryConfig object
     * @returns QueryConfig object
     */
    getInsertQuery(): QueryConfig {
        const polygonExists = this.polygon ? true : false;
        const queryObject = {
            text: `INSERT INTO public.pathway_versions(tdei_record_id, 
                confidence_level, 
                tdei_project_group_id, 
                tdei_station_id, 
                file_upload_path, 
                uploaded_by,
                collected_by, 
                collection_date, 
                collection_method, valid_from, valid_to, data_source,
                pathways_schema_version ${polygonExists ? ', polygon ' : ''})
                VALUES ($1,0,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12 ${polygonExists ? ', ST_GeomFromGeoJSON($13) ' : ''})`.replace(/\n/g, ""),
            values: [this.tdei_record_id, this.tdei_project_group_id, this.tdei_station_id, this.file_upload_path, this.uploaded_by
                , this.collected_by, this.collection_date, this.collection_method, this.valid_from, this.valid_to, this.data_source, this.pathways_schema_version],
        }
        if (polygonExists) {
            queryObject.values.push(JSON.stringify(this.polygon.features[0].geometry));
        }
        return queryObject;
    }

    getOverlapQuery(): QueryConfig {
        const fromDate = new Date(this.valid_from);
        const toDate = new Date(this.valid_to);
        const queryObject = {
            text:`SELECT tdei_record_id from public.pathway_versions where
            tdei_project_group_id = $1
            AND tdei_station_id = $2 
            AND (valid_from, valid_to) OVERLAPS ($3, $4)`,
            values:[this.tdei_project_group_id, this.tdei_station_id, fromDate,toDate]
        };
        return queryObject;
    }
}