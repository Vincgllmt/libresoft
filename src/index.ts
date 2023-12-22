import 'dotenv/config'
import express, { Request, Response, NextFunction} from "express";
import session from 'express-session'

import softwareRouter from './software/software.routes'
import usersRouter from './users/users.routes'
import authRouter from './auth/auth.route';
import discussRouter from './discuss/discuss.routes';
import avatarRouter from './avatar/avatar.routes';
import { sessionUser } from './auth/auth.middleware';
import RedisStore from 'connect-redis';
import { redis } from './services/redis';
import { createServer } from 'http';
import { DiscussServer } from './discuss/discuss.server';
import fileUpload from 'express-fileupload';
const app = express()
const httpServer = createServer(app);

const port = process.argv[2] ?? process.env.PORT ?? 8000;
app.set('view engine', 'ejs');
const redisStore = new RedisStore({client: redis, prefix: 'session:'})
const sessionMiddleware = session({
    secret: process.env.session_secret ?? "Pourquoi feldup alors que feldown | keyboard cat", // ajoutez la variable d'environnement correspondante au fichier .env
    saveUninitialized: false,
    resave: false,
    store: redisStore,
})
app.use(sessionMiddleware);
DiscussServer.create(httpServer, sessionMiddleware);

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(sessionUser);

app.use('/', softwareRouter)
app.use('/', authRouter)
app.use('/users', usersRouter)
app.use('/chat', discussRouter)
app.use('/avatar', avatarRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("ERREUR :", err);
    res.render('error', { err });
});

httpServer.listen(port, ()=> {
    console.log(`Serveur local démarré : http://localhost:${port}`);
})