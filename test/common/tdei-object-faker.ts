import { FeatureCollection } from "geojson";
import gtfsPathwaysValidationSuccessMessage from "../test-data/pathways-validation-success.message.json";
import { PathwayVersions } from "../../src/database/entity/pathways-version-entity";
import { th } from "date-fns/locale";
import { Readable } from "stream";

export class TdeiObjectFaker {
    static getGtfsPathwaysVersion() {
        return {
            polygon: this.getPolygon(),
            tdei_record_id: "test_record_id",
            confidence_level: 0,
            tdei_project_group_id: "test_user",
            file_upload_path: "test_path",
            uploaded_by: "test",
            collected_by: "test",
            collection_date: new Date(),
            valid_from: new Date(),
            valid_to: new Date(),
            collection_method: "manual",
            data_source: "InHouse",
            pathways_schema_version: "v1.0",
            tdei_station_id: "test_station_id"
        } as PathwayVersions;
    }

    static getGtfsPathwaysPayload(){
        return {
            polygon: this.getPolygon(),
            tdei_project_group_id: 'tdei-org-id',
            tdei_station_id:'tdei-station-id',
            collected_by:'collectedby',
            collection_method:'manual',
            data_source:'InHouse',
            pathways_schema_version:'v2.0',
            valid_from: new Date(),
            valid_to : new Date()
        }
    }

    static getGtfsPathwaysVersionFromDB() {
        return {
            //DB polygon is stored as binary obj
            polygon: {},
            //Select query converts the binary polygon to json using spatial query
            polygon2: JSON.stringify(this.getPolygonGeometry()),
            tdei_record_id: "test_record_id",
            confidence_level: 0,
            tdei_project_group_id: "test_user",
            file_upload_path: "test_path",
            uploaded_by: "test",
            collected_by: "test",
            collection_date: new Date(),
            collection_method: "manual",
            valid_from: new Date(),
            valid_to: new Date(),
            data_source: "InHouse",
            pathways_schema_version: "v1.0",
            tdei_station_id: "test_station_id"
        };
    }

    static getInvalidPolygon(): FeatureCollection {
        const randomCoordinates: number[][] = [];
        const firstRandom = [
            this.getRandomNumber(70, 79),
            this.getRandomNumber(12, 15)
        ];
        randomCoordinates.push(firstRandom);

        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: [randomCoordinates]
                    }
                }
            ]
        };
    }

    static getPolygon(): FeatureCollection {
        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: this.getPolygonGeometry()
                }
            ]
        };
    }

    static getPolygonGeometry(): any {
        return {
            type: "Polygon",
            coordinates: [this.getCoordinates()]
        };
    }

    private static getCoordinates(): number[][] {
        const randomCoordinates: number[][] = [];
        const firstRandom = [
            this.getRandomNumber(70, 79),
            this.getRandomNumber(12, 15)
        ];
        randomCoordinates.push(firstRandom);
        for (let i = 3; i--;) {
            randomCoordinates.push([
                this.getRandomNumber(70, 79),
                this.getRandomNumber(12, 15)
            ]);
        }
        randomCoordinates.push(firstRandom);

        return randomCoordinates;
    }

    private static getRandomNumber(min: number, max: number): number {
        const diff = max - min;
        return parseFloat((min + Math.random() * diff).toFixed(6));
    }

    static getGtfsPathwaysQueueMessageSuccess() {
        return gtfsPathwaysValidationSuccessMessage;
    }

    static getGtfsPathwaysPayload2(){
        return {
            "tdei_project_group_id": "e1956869-02d9-4e14-8391-6024406ced41",
            "tdei_station_id": "a73d0a95-f9e2-4067-b4c9-a1f82419e82e",
            "collected_by": "testuser",
            "collection_date": "2023-03-02T04:22:42.493Z",
            "collection_method": "manual",
            "valid_from": "2023-03-02T04:22:42.493Z",
            "valid_to": "2023-03-02T04:22:42.493Z",
            "data_source": "TDEITools",
            "polygon": {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "coordinates": [
                  [
                    [
                      -122.32615394375401,
                      47.61267259760652
                    ],
                    [
                      -122.32615394375401,
                      47.60504395643625
                    ],
                    [
                      -122.3155850364906,
                      47.60504395643625
                    ],
                    [
                      -122.3155850364906,
                      47.61267259760652
                    ],
                    [
                      -122.32615394375401,
                      47.61267259760652
                    ]
                  ]
                ],
                "type": "Polygon"
              }
            }
          ]
        },
            "pathways_schema_version": "v2.0"
          }
    }

    static getMockUploadFile() {
        return {
            originalname:'sample.zip',
            mimetype:'application/zip',
            path:'sample/path/to.zip',
            buffer:Buffer.from('sample-buffer'),
            fieldname:'file',
            filename:'sample.zip',
            size:100,
            stream:Readable.from(''),
            encoding:'',
            destination:''
        };
    }
}
