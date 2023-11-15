import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "./software.collection";
import { validationResult } from "express-validator";
export class SoftwareController {
    static async list(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (result.isEmpty() && req.query.page) {
            const softwares = await softwareCollection.aggregate([
                {
                    $project: {
                        usersCount:
                        {
                            $size: "$users"
                        },
                        name: 1,
                        id: 1,
                        url: 1,
                        description: 1,
                        external_resources: 1,
                    },
                },
                {
                    $facet: {
                        total: [{ $count: "total_softwares" }],
                        softwares: [
                            { $skip: ((+req.query.page - 1) * 20) },
                            { $limit: 20 }
                        ]
                    }
                }
            ]).toArray()
            console.dir(softwares, { depth: null })
            res.render('software/software_list', { 
                softwares: softwares[0].softwares, 
                total: Math.ceil(softwares[0].total[0].total_softwares / 20), 
                current_page: req.query.page 
            })
        }else{
            throw new Error("Invalid query")
        }
    }
}
