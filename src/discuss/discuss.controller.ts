import { NextFunction, Request, Response } from "express";

export class DiscussController {
    static async chat(req: Request, res: Response, next: NextFunction) {
        res.render('discuss/discuss');
    }
}
