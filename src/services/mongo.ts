import { MongoClient } from "mongodb";

const uri = `mongodb://${process.env.username}:${process.env.password}@localhost:27017`;
const client = new MongoClient(uri)
export const mongodb = client.db('mr514');