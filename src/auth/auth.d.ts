import { ObjectId } from "mongodb";
interface Contributor {
    id?: ObjectId;
    name: string;
    hashedPassword: string;
}