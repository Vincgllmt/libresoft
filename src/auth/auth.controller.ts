import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { contributorCollection } from "./auth.collection";

export class AuthController {
    static loginForm(req : Request, res : Response) {
        res.render('auth/login')
    }
    static async login(req : Request, res : Response) {
        
        const user = await contributorCollection.findOne({name : req.body.name})
        if (!user) {
            throw new Error("Utilisateur inconnu")
        }

        if(!await bcrypt.compare(req.body.password,user.hashedPassword)) {
            throw new Error("Mauvais mot de passe")
        }
        
        req.session.regenerate(err => {
            if(!err) {
                console.log(user);
                req.session.user = user
            }
            res.redirect('/')
        })
    } 
    static async logout(req: Request, res: Response) {
        req.session.destroy(err => {
            res.redirect('/')
        })
    }
}