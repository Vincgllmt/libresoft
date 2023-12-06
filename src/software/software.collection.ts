import { MongoServerError } from "mongodb";
import { mongodb } from "../services/mongo";

export const softwareCollection = mongodb.collection('software');

export class SoftwareSchema {
    private static schema = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name'],
            properties: {
                _id: {},
                name: {
                    bsonType: 'string',
                    description: "'name' is required and is a string",
                },
                url: {
                    bsonType: 'string',
                    description: "'url' is required and is a string",
                    pattern: '^https?://'
                },
                id: {
                    bsonType: 'int',
                    description: "'id' is required and is an integer",
                    minimum: 1,
                },
                description: {
                    bsonType: 'string',
                    description: "'description' is required and is a string"
                },
                external_ressources: {
                    bsonType: 'array',
                    description: "'external_ressources' is required and is an array",
                    items: {
                        bsonType: 'object',
                        required: ['url'],
                        properties: {

                            url: {
                                bsonType: 'string',
                                description: "'url' is required and is a string",
                                pattern: '^https?://'
                            }
                        }
                    }
                },
                users: {
                    bsonType: 'array',
                    description: "'users' is required and is an array",
                    items: {
                        bsonType: 'object',
                        required: ['name', 'id', 'url', 'type'],
                        properties: {
                            name: {
                                bsonType: 'string',
                                description: "'name' is required and is a string",
                            },
                            id: {
                                bsonType: 'int',
                                description: "'id' is required and is an integer",
                                minimum: 1,
                            },
                            url: {
                                bsonType: 'string',
                                description: "'url' is required and is a string",
                                pattern: '^https?://'
                            },
                            type: {
                                bsonType: 'string',
                                description: "'type' is required and is a string",
                                enum: ['Administration', 'Association', 'Company', 'Person']
                            }
                        }
                    }
                
                }
            }
        }
    };

    static async showInvalidDocuments(): Promise<void> {
        console.log((await softwareCollection.find({$nor : [ SoftwareSchema.schema ]}).toArray()).map((s) => [s.name, s.id]));
    }

    static async applyToCollection() {
        await mongodb.command({
            collMod: 'software',
            validator: SoftwareSchema.schema
        }); 
    }

    static async dumpFromCollection() {
        const options = await softwareCollection.options();
        console.log('softwareSchema :');
        console.dir(options.validator, { depth: null });
    }

    static async insertTestDocument(software: Software) {
        try {
            await softwareCollection.insertOne(software);
        }
        catch(err) {
            const error = err as MongoServerError;
            console.log(error.message);
            console.dir(error.errInfo?.details, {depth: null});
        }
    }
}