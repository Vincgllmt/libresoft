import { ObjectId } from "mongodb";
interface Contributor {
    _id?: ObjectId;
    name: string;
    hashedPassword: string;
    avatar?: string;
}