import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Urp} from "../entity/Urp";
import { validate } from 'class-validator';
import { User } from "../entity/User";


export class UrpController {

    //GETALL
    static GetEquipoScrum = async (req: Request, res: Response)=>{

        const projectId :number =+req.query.projectId;
        // http://localhost:3000/urp?projectId=1
        
        const projectRepository = getRepository(Urp);
        let urps;
        try {
            urps = await projectRepository.createQueryBuilder("urp").where("projectId = :id",{id:projectId}).andWhere("urp.rol != :ProductOwner",{ ProductOwner:'ProductOwner'}).getMany();
        } catch (error) {
            res.status(500).json({msg:'Hubo un error'});
        }

        if (urps.length > 0){
            res.json(urps);
        }else{
            res.status(500).json({msg:'Not result'});
        }

    };

    //SOLO UN PROYECTO
    static GetMiembroEquipo = async(req: Request, res: Response)=>{
        //http://localhost:3000/urp/rol/?projectId=2&userId=2
        const { id } = req.params;//LA DEL MIEMBRO A BUSCAR
        //const userId:number =+req.query.userId;
        const projectId:number =+req.query.projectId;

        //console.log(userId, projectId)
        const userRepository = getRepository(Urp);
        let urp;

        try {
            urp = await userRepository.createQueryBuilder("urp").where("urp.id = :id",{id:id }).andWhere("urp.projectId = :projectId", {projectId:projectId}).getOne();
            if(!urp){
                res.status(400).json( { msg: 'No existe'} )
            }
            //res.json(urp.rol);//EK ROLE
            res.json(urp);
        }catch (error) {
            console.log(error)
            res.status(500).json({msg:'No trabaja en el equipo'});
        }
        
    };

    //NUEVO miembro del equipo
    static newUrp = async(req: Request, res: Response)=>{
        //htttp://localhost:3000/newUrp/?projectId=1&rol=ScrumMaster&mail=blablablabla
        //const {userId} = req.body;//AQUI
        const projectId :number =+req.query.projectId;//LA ID DEL PROYECTO
        let rol:any;
        rol=req.query.rol;//ROL ASIGNADO
        const email:any = req.query.email;//EMAIL DEL TRABAJOR

        const userRepository = getRepository(User);//getRepository es de tyoeorm
        let user: User;

        try {//OBTENEMOS LA ID DEL TRABAJADOR PARA VALIDARLO
            user = await userRepository.findOneOrFail({ where: { email } });//busca por el email y se guarda en user
        } catch (error) {
            console.log(error);
            res.status(400).json({ msg: 'email incorrect!!'}); 
        }

        




        //SI TODO VA BIEN AISGNAMOS LOS VALORES
        const urp = new Urp();
        urp.rol = rol;
        urp.userId = user.id;
        urp.projectId = projectId;

        //Validamos
        const errors = await validate(urp, { validationError : { target: false, value: false }});
        if (errors.length > 0) {
            res.status(400).json(errors);
        }
        

        //SI TODO VA BIEN GUARDAMOS AL TRABAJADOR
        const urpRepository = getRepository(Urp);
        

        try {
            await urpRepository.save(urp);
        } catch (error) {
            console.log(error);
            res.status(409).json({msg:"Urp alredy exist"});
        }
        res.status(250).json({msg:"Aceptado"})
    };

    static deleteUrp = async (req: Request, res: Response) => {
        const { id } = req.params;// ID DEL QUE SE VA A ELIMINAR
        const userId:number =+req.query.userId;//ID DEL PO |PERO NO SE USA
        const projectId:number =+req.query.projectId;//ID DEL PROYECTO 

        
        const userRepository = getRepository(Urp);
        let miembro: Urp;
    
        try {
            miembro = await userRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({ msg: 'Urp not found' });
        }

        if(miembro.projectId == projectId ){
            // Remove user
            userRepository.delete(id);
            res.status(201).json({ msg: 'Urp deleted' });
        }else{
            res.status(404).json({ msg: 'No es miembro de tu equipo' });
        }

    };
   
    static editUrp = async (req: Request, res: Response) => {
        let miembro;
        const projectId:number =+req.query.projectId;//ID DEL PROYECTO 
        const { id } = req.params;
        const { rol } = req.body;
    
        const userRepository = getRepository(Urp);


        // Try get user
        try {
            miembro = await userRepository.findOneOrFail(id);//se obtiene al user
            miembro.rol = rol;//lo guardo
        } catch (error) {
          return res.status(404).json({ msg: 'User not found' });
        }
        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(miembro, validationOpt);
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
    
        // Try to save user
        if(miembro.projectId == projectId ){
            try {
                await userRepository.save(miembro);
            } catch (error) {
                return res.status(409).json({ msg: 'Urp already in use' });
            }
        }else {
            res.status(404).json({ msg: 'No es miembro de tu equipo' });
        }

        res.status(201).json({ msg: 'Urp update' });
      };
}

