import { NextFunction, Request, Response } from "express";
import { contributorCollection } from "../auth/auth.collection";
import { Contributor } from "../auth/auth";
import { ObjectId } from "mongodb";

export class AvatarController {
    static async avatar(req: Request, res: Response, next: NextFunction) {
        let user: Contributor | null = null;

        try {
            user = await contributorCollection.findOne<Contributor>({ _id: new ObjectId(req.params.id) });
        } catch (error) {
            res.status(404).json({ message: "Invalid user id" });
            return;
        }

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }else{
            res.sendFile(user.avatar ?? "default_avatar.png", { root: "restricted/avatars" });
        }
    }
}