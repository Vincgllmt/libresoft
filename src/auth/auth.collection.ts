import { mongodb } from "../services/mongo";
import { Contributor } from "./auth";
import bcrypt from 'bcrypt';
import { saltRounds } from "./auth.bcrypt";
import { MongoServerError } from "mongodb";

export const contributorCollection = mongodb.collection<Contributor>("contributors");

export async function seedContributors() {
    await contributorCollection.deleteMany({});

    const salt = bcrypt.genSaltSync(saltRounds);

    await contributorCollection.insertMany([
        {
            name: "udyc0001",
            hashedPassword: bcrypt.hashSync("azerty", salt),
        },
        {
            name: 'guil0221',
            hashedPassword: bcrypt.hashSync("qsdfgh", salt),
        }
    ]);
}

export class ContributorSchema {
    private static schema = {
        $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'hashedPassword'],
            properties: {
                _id: {
                    bsonType: 'objectId',
                    description: 'must be an objectid and is required'
                },
                name: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
                hashedPassword: {
                    bsonType: 'string',
                    description: 'must be a string and is required'
                },
            }
        }
    };

    static async showInvalidDocuments(): Promise<void> {
        console.log((await contributorCollection.find({$nor : [ ContributorSchema.schema ]}).toArray()).map((s) => [s.name, s._id]));
    }

    static async applyToCollection() {
        await mongodb.command({
            collMod: 'contributors',
            validator: ContributorSchema.schema
        }); 
    }

    static async dumpFromCollection() {
        const options = await contributorCollection.options();
        console.log('validator:');
        console.dir(options.validator, { depth: null });
    }

    static async insertTestDocument(contributor: Contributor) {
        try {
            await contributorCollection.insertOne(contributor);
        }
        catch(err) {
            const error = err as MongoServerError;
            console.log(error.message);
            console.dir(error.errInfo?.details, {depth: null});
        }
    }
}