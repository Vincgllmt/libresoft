import { NextFunction, Request, Response } from "express";
import { softwareCollection } from "./software.collection";
import { validationResult } from "express-validator";
export class SoftwareController {
    static async list(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (result.isEmpty() && req.query.page) {
            const softwares = await softwareCollection.aggregate([
                {
                    $match: req.query.search ? {
                        $or: [
                            { name: { $regex: req.query.search, $options: 'i' } }, 
                            { description: { $regex: req.query.search, $options: 'i' } }
                        ]
                    } : {}
                },
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
            res.render('software/software_list', {
                softwares: softwares[0].softwares,
                total: Math.ceil(!softwares[0].total ? softwares[0].total[0].total_softwares / 20 : 0),
                current_page: req.query.page,
                search: req.query.search
            })
        } else {
            throw new Error("Invalid query")
        }
    }

    static async edit(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (result.isEmpty() && req.params.id) {
            const software = await softwareCollection.findOne({ id: +req.params.id })
            if (software) {
                res.render('software/software_edit', {
                    software: software
                })
            } else {
                throw new Error("Software not found")
            }
        } else {
            throw new Error("Invalid query")
        }
    }

    static async editPost(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);

        console.log(result)
        if (result && result.isEmpty() && req.params.id) {
            
            const software = await softwareCollection.findOne({ id: +req.params.id })
            console.log(req.body)

            if (software && req.session.user) {
                await softwareCollection.updateOne({ id: +req.params.id }, {
                    $set: {
                        name: req.body.name,
                        url: req.body.url,
                        description: req.body.description,
                        lastContributorId: req.session.user._id,
                        lastModified: new Date(),
                        external_resources: {
                            wikipedia: req.body.url_wikipedia ? {
                                url: req.body.url_wikipedia
                            } : undefined,
                            framalibre: req.body.url_framalibre ? {
                                url: req.body.url_framalibre
                            } : undefined,
                            sill: req.body.url_sill ? {
                                url: req.body.url_sill
                            } : undefined,
                        }
                    }
                })
                res.redirect('/')
            } else {
                throw new Error("Software not found")
            }
        }
    }
}
