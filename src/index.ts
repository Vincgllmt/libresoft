import express, { Request, Response, NextFunction} from "express";

import softwareRouter from './software/software.routes'

import 'dotenv/config'
const app = express()
const port = process.env.PORT ?? 8000;



app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', softwareRouter)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(`ERREUR : ${err.message}`);
    res.render('error', { err });
});

app.listen(port, ()=> {
    console.log(`Serveur local démarré : http://localhost:${port}`);
})