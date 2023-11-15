import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "../software/software.collection";
export class UsersController{
    static async list(req: Request, res: Response, next: NextFunction){
        const software = await softwareCollection.find({id: +req.params.id}).toArray()
        res.render('users/users_list', {
            software: software[0],
        })
    }
}