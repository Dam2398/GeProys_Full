import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Sprint} from "../entity/Sprint";
import { validate } from 'class-validator';
import { Urp } from "../entity/Urp";


export class SprintController {

    //GETALL
    static getAllS = async (req: Request, res: Response)=>{

        const projectId :number =+req.query.projectId;

        const projectRepository = getRepository(Sprint);
        let sprints;
        try {
            sprints = await projectRepository.createQueryBuilder("sprint").where("projectId = :id",{id:projectId}).orderBy("sprint.fechaInicio", "ASC").getMany();
        } catch (error) {
            res.status(500).json({msg:'Hubo un error'});
        }

        if (sprints.length > 0){
            res.json(sprints);
        }else{
            res.status(500).json({msg:'Not result'});
        }

    };

    //aun falta
    static getByIdS = async(req: Request, res: Response)=>{
        const { id } = req.params;//la ide viene en la url
        const projectId:number =+req.query.projectId;

        const userRepository = getRepository(Sprint);

        try {
          let sprint = await userRepository.createQueryBuilder("sprint").where("projectId = :idproject",{idproject:projectId}).andWhere("sprint.id = :id",{ id:id}).getOne();
          if(!sprint){
            res.status(400).json( { msg: 'No existe el sprint'} )
            }
          res.json(sprint);
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
    };

    //NUEVO PROYECTO
    static newSprint = async(req: Request, res: Response)=>{//nuevo sprint chido

        const projectId :number =+req.query.projectId;
        const userId :number =+req.query.userId;

        const { name, daily, fechaInicio, fechaFin} = req.body;
        const sprint = new Sprint();

        sprint.name= name;
        sprint.daily= daily;
        sprint.fechaInicio= fechaInicio;
        sprint.fechaFin= fechaFin;
        sprint.projectId = projectId;

        //Validate
       // const validationOpt = { validationError : { target: false, value: false }} };
        const errors = await validate(sprint);
        if (errors.length > 0) {
             res.status(400).json(errors);
        }


        //Si esta asociado en el proyecto se guarda el sprint
        const projectRepository = getRepository(Sprint);
        let sp;
        try {
            sp = await projectRepository.save(sprint);
        } catch (error) {
            res.status(409).json({msg:"Sprint alredy exist"});
        }

        res.json(   {msg:"OK",
                    sprintId:sp.id});
    };

    //EDITAR PROYECTO
    static editSprint = async (req: Request, res: Response) => {
        let sprint;
        const projectId:number =+req.query.projectId;
        const { id } = req.params;
        const { name, daily, fechaInicio, fechaFin} = req.body;
        
        const userRepository = getRepository(Sprint);
        // Try get user
        try {
            sprint = await userRepository.findOneOrFail(id);//se obtiene al user
            
            sprint.name =name;
            sprint.daily =daily;
            sprint.fechaInicio =fechaInicio;
            sprint.fechaFin =fechaFin;
            sprint.projectId =projectId;
        } catch (error) {
            return res.status(404).json({ msg: 'Sprint not found' });
        }
        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(sprint,validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }
        
        if(sprint.projectId == projectId){
        // Try to save user
            try {
                await userRepository.save(sprint);
            } catch (error) {
                return res.status(409).json({ msg: 'Sprint already in use' });
            }
        }else{
            res.status(404).json({ msg: 'No sprint de tu proyecto' });
        }
        res.status(201).json({ msg: 'Sprint update' });
    };

    static deleteSprint = async (req: Request, res: Response) => {

        const projectId:number =+req.query.projectId;
        const { id } = req.params;//la ide viene en la url
        const userRepository = getRepository(Sprint);
        let sprint: Sprint;
    
        try {
            sprint = await userRepository.createQueryBuilder("sprint").where("projectId = :idproject",{idproject:projectId}).andWhere("sprint.id = :id",{ id:id}).getOne();
        } catch (error) {
            return res.status(404).json({ msg: 'Sprint not found' });
        }
    
        // Remove user
        userRepository.delete(sprint.id);
        res.status(201).json({ msg: 'Sprint deleted' });
    };

    static MostrarSprintActual = async(req: Request, res: Response)=>{
        const projectId =+req.query.projectId;
        //http://localhost:3000/sprints/SprintActual/?projectId=1

        const fecha = new Date().toISOString().split('T')[0];
        //DA UN DIA DE MAS
        console.log(fecha);
        

        const sprintRepository = getRepository(Sprint);
        let sprint;
        try {
            //let sprint = await userRepository.findOneOrFail(id);
            sprint = await sprintRepository.createQueryBuilder("sprint").where("sprint.projectId = :id",{id:projectId}).andWhere("sprint.fechaInicio <= :hoy",{hoy:fecha }).andWhere("sprint.fechaFin >= :hoy",{hoy:fecha }).getOne();
            if(!sprint){
                res.status(400).json( { msg: 'No existe el sprint'} )
            }
            //console.log('Numero del proyecto es:'+projectId),
            res.json(sprint);//se envia toda la info
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:'hubo un error'});
        }

    };

}

