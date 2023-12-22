import { NextFunction, Request, Response } from "express";
import { contributorCollection } from "../auth/auth.collection";
import { Contributor } from "../auth/auth";
import { ObjectId } from "mongodb";
import { DiscussServer } from "../discuss/discuss.server";

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
            try{
                res.sendFile(user.avatar ?? "default_avatar.png", { root: "restricted/avatars" });
            }catch(error){
                res.sendFile("default_avatar.png", { root: "restricted/avatars" });
            }
        }
    }

    static async avatarFormView(req: Request, res: Response, next: NextFunction) {
        res.render('avatar/avatar');
    }

    static async avatarForm(req: Request, res: Response, next: NextFunction) {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            return;
        }

        const avatar = req.files.avatar as any;

        if (!avatar.mimetype.startsWith("image")) {
            res.status(400).send('File is not an image.');
            return;
        }

        const user = req.session.user as Contributor;

        avatar.mv(`restricted/avatars/${user._id}.png`, async (err: any) => {
            if (err) {
                res.status(500).send(err);
            } else {
                await contributorCollection.updateOne({ _id: new ObjectId(user._id) }, { $set: { avatar: `${user._id}.png` } });

                await DiscussServer.sendAvatarUpdate(String(user._id));

                res.redirect("/avatar");
            }
        });
    }
}