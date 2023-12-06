import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "../software/software.collection";
export class UsersController {
    static async list(req: Request, res: Response, next: NextFunction) {
        let software: Software | { users: SoftwareUsers[] } | null = null

        if (req.params.id !== undefined) {
            const softwaresResult = await softwareCollection.find<Software>({ id: +req.params.id }).toArray()
            if (softwaresResult.length > 0) {
                software = softwaresResult[0]
            }

        } else {
            software = {
                users: (await softwareCollection.distinct('users') as SoftwareUsers[]).sort((a, b) => a.name.localeCompare(b.name))
            }
            console.dir(software, { depth: null });
            //console.log(uniqueUser)
            // software = await softwareCollection.find<Software>({users: {id: {$in: uniqueUser}}}).toArray()
            //software = await softwareCollection.aggregate<Software>([{
            //    $match: { users: {$in: ['$users.id', uniqueUser]}}
            //}]).toArray()
        }
        res.render('users/users_list', {
            software,
        })
    }
}