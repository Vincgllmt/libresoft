import 'dotenv/config'
import express, { Request, Response, NextFunction} from "express";
import session from 'express-session'

import softwareRouter from './software/software.routes'
import usersRouter from './users/users.routes'
import authRouter from './auth/auth.route';
import { sessionUser } from './auth/auth.middleware';

const app = express()
const port = process.env.PORT ?? 8000;

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.session_secret ?? "Pourquoi feldup alors que feldown", // ajoutez la variable d'environnement correspondante au fichier .env
    saveUninitialized: false,
    resave: false
}));

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionUser);

app.use('/', softwareRouter)
app.use('/', authRouter)
app.use('/users', usersRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("ERREUR :", err);
    res.render('error', { err });
});

app.listen(port, ()=> {
    console.log(`Serveur local démarré : http://localhost:${port}`);
})