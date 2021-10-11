import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

import config from '../config/config';

export const checkJwt = (req:Request, res: Response, next: NextFunction)=>{
    //console.log('REQ->',req.headers);
    const token= <string> req.headers['auth'];//token sera de tipo string|| Se solicita del header el token
   //token que viene en el header desde el backend
    let jwtPayload;
    const userIdurl:number =+req.query.userId; 
    let emailurl:any =req.query.email;

    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);//el segundo parametro es la key
        res.locals.jwtPayload = jwtPayload;
        //console.log(jwtPayload);

    } catch (error) {
        res.status(401).json({msg:"Not Authorized, LOGIN"});
    }

    const {userId, email} = jwtPayload;
    const newToken = jwt.sign({userId, email}, config.jwtSecret, {expiresIn: '3600s'});//TIEMPO||Se genera el token
    res.setHeader('token',newToken);//Creo que aqui

    //Call next
    if(userId==userIdurl || email == emailurl){
        next();
    }else{
        res.json({msg:"Error"});
    }
}