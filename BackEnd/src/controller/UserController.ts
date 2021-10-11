import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from 'class-validator';


export class UserController {

    //GETALL
    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users;
    
        try {
          users = await userRepository.find();
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
    
        if (users.length > 0) {
          res.json(users);
        } else {
          res.status(500).json({ message: 'Not result' });
        }
      };

      //SOLO UN USUARIO
      static getById = async (req: Request, res: Response) => {
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(User);
        try {
          let user = await userRepository.findOneOrFail(id);
          if(!user){
            res.status(400).json( { msg: 'No existe el usuario'} )
          }
          res.status(200).json(user);
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
      };
    
      //NUEVOUSUARIO
      static newUser = async (req: Request, res: Response) => {
        const { firstName, lastName, email, password } = req.body;
        const user = new User();
    
        user.firstName =firstName;//Los nombres igualitos
        user.lastName =lastName;
        user.email =email;
        user.password =password;
        
        // Validate
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOpt);
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
    
        // TODO: HASH PASSWORD
        const userRepository = getRepository(User);
        try {
            user.hashPassword();//Encriptar la contarsena
            await userRepository.save(user);//Guardar usuario
        } catch (error) {
            console.log(error);
            return res.status(409).json({msg:"Username alredy exist"});
        }
        // All ok
        res.status(201).json({msg:"User created"});
      };
    
      //EDTAR USUARIO
      static editUser = async (req: Request, res: Response) => {
        let user;
        const { id } = req.params;
        const { firstName, lastName, email } = req.body;
    
        const userRepository = getRepository(User);
        // Try get user
        try {
          user = await userRepository.findOneOrFail(id);//se obtiene al user

          user.firstName =firstName;//Se modifican los valores
          user.lastName =lastName;
          user.email =email;
         // user.password =password;
        } catch (error) {
          return res.status(404).json({ msg: 'User not found' });
        }
        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(user, validationOpt);
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
    
        // Try to save user
        try {
          await userRepository.save(user);
        } catch (error) {
          return res.status(409).json({ msg: 'Username already in use' });
        }
    
        res.status(201).json({ msg: 'User update' });
      };
    
      static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(User);
        let user: User;
    
        try {
          user = await userRepository.findOneOrFail(id);
        } catch (error) {
          return res.status(404).json({ msg: 'User not found' });
        }
    
        // Remove user
        userRepository.delete(id);
        res.status(201).json({ msg: ' User deleted' });
      };
}