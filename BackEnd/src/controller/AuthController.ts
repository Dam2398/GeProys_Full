import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export class AuthController {

    static login = async (req: Request, res: Response) => {
    
        const { email , password} = req.body;
    
        if(!(email && password)){//que vengan los datos
            res.status(400).json({ msg: 'Username or password required!!'});
        }

        const userRepository = getRepository(User);//getRepository es de tyoeorm
        let user: User;//de tipo usuario
    
        try {
            user = await userRepository.findOneOrFail({ where: { email } });//busca por el email y se guarda en user
        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: 'email or password incorrect!!'}); 
        }
        //Check password
        if(!user.checkPassword(password)){
            res.status(401).json({msg:"Email or password are incorrect!"});//cunado responder el backend se acaba la funcion
        }

        const token =jwt.sign({userId:user.id, email: user.email}, config.jwtSecret,{expiresIn : '3600s'});
        //SE LE ENVIA EL FRONT
        res.json(  {msg:"OK", 
                    token,
                    userId:user.id,
                    username:user.firstName});
    }
   
}
