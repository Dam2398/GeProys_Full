import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as helmet from 'helmet';
import cors = require("cors");//WACHA
import routes from './routes/index';

 

const PORT = process.env.PORT ||3000;

createConnection().then(async () => {//PROMESA

    // create express app
    const app = express();
    //Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(helmet());

    // Routes
    app.use('/', routes);

    // start express server
    app.listen(PORT, ()=>
        console.log(`Server running on port ${PORT}`));




}).catch(error => console.log(error));
