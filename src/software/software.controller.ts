import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "./software.collection";
export class SoftwareController {
    static async list(req: Request, res: Response, next: NextFunction) {
        const softwares = await softwareCollection.aggregate([
            {
                $project:
                {
                    usersCount:
                    {
                        $size: "$users"
                    },
                    name: 1,
                    id: 1,
                    url: 1,
                    description: 1,
                    external_resources: 1

                }
            }
        ]).limit(20).toArray()
        console.log(softwares)
        res.render('software/software_list', { softwares })
    }
}
