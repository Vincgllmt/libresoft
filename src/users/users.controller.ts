import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "../software/software.collection";
import { UserDataAccess } from "./users.data.access";
export class UsersController {
    static async list(req: Request, res: Response, next: NextFunction) {
        let software: Software | { users: SoftwareUsers[] } | null = null

        if (req.params.id !== undefined) {
            software = await UserDataAccess.getSoftwareUsers(+req.params.id)

        } else {
            software = {
                users: await UserDataAccess.getAllSoftwareUsers()
            }
        }
        res.render('users/users_list', {
            software,
        })
    }
}