import { AbstractDomainEntity, Prop } from "nodets-ms-core/lib/models";
import { FeatureCollection } from 'geojson';

export class GtfsPathwaysDTO extends AbstractDomainEntity {
    @Prop()
    tdei_record_id!: string;
    @Prop()
    tdei_org_id!: string;
    @Prop()
    tdei_station_id!: string;
    @Prop()
    collected_by!: string;
    @Prop()
    collection_date!: Date;
    @Prop()
    collection_method!: string;
    @Prop()
    valid_from!: Date;
    @Prop()
    valid_to!: Date;
    @Prop()
    data_source!: string;
    @Prop()
    pathways_schema_version!: string;
    @Prop()
    polygon!: FeatureCollection;
}