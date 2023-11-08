import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "./software.collection";
export class SoftwareController {
    static async list(req: Request, res: Response, next: NextFunction) {
        const softwares = await softwareCollection.find().limit(20).toArray()
        console.log(softwares)
        res.render('software/software_list', {softwares})
    }
}
        