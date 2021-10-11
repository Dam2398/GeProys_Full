import {getRepository, IsNull} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Tarea} from "../entity/Tarea";
import { Urp } from "../entity/Urp";
import { validate } from 'class-validator';
import { Sprint } from "../entity/Sprint";


export class TareaController {

    //Todas las tareas con sprint
    static getAll = async (req: Request, res: Response) => {

        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;

        const tareaRepository = getRepository(Tarea);
        const sprintRepository = getRepository(Sprint);
        let tareas;
        let sprint;

        try {//Para ver si el sprint pertenece al proyecto
            sprint = await sprintRepository.createQueryBuilder("sprint").where("sprint.id = :sprintId",{sprintId:sprintId}).andWhere("sprint.projectId =:projectId",{projectId:projectId}).getOne();
            console.log(sprint.id);
        } catch (error) {
            res.status(500).json({msg:'hubo un error'});
        }

        try {//Si pertence trae las tareas
          tareas = await tareaRepository.createQueryBuilder("tarea").where("tarea.sprintId = :sprintId",{sprintId:sprintId}).orderBy("tarea.status", "DESC").getMany();
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
    
        //las retorna las tareas en orden de status
        if (tareas.length > 0) {
          res.json(tareas);
        } else {
          res.status(500).json({ message: 'Not result' });
        }
    };

    //MIS TAREAS
    static getMisTareas = async (req: Request, res: Response)=>{

        const userId:number =+req.query.userId;
        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;

        const urpRepository = getRepository(Urp);
        const tareaRepository = getRepository(Tarea);
        let urp;
        let urpId;
        try {//Obtener la id del usuario en un proyecto
            urp = await urpRepository.createQueryBuilder("urp").where("urp.userId = :userId",{userId:userId }).andWhere("urp.projectId = :projectId", {projectId:projectId}).getOne();
            urpId = urp.id;
        } catch (error) {
            res.status(501).json({msg:'hubo un error'});
        }

        let tareas;
        try {
            tareas = await tareaRepository.createQueryBuilder("tarea").where("tarea.urpId = :urpId",{urpId:urpId}).andWhere("tarea.sprintId = :sprintId",{sprintId:sprintId}).getMany();
        } catch (error) {
            res.status(500).json({msg:'Hubo un error'});
        }

        if (tareas.length > 0){
            res.json(tareas);//Envio de tareas
        }else{
            res.status(500).json({msg:'Not result'});
        }

    };

    //TAREAS NULAS
    static getTareasNulas = async (req: Request, res: Response)=>{
        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;

        const tareaRepository = getRepository(Tarea);
        const sprintRepository = getRepository(Sprint);
        let tareas;
        let sprint;

        try {//Para ver si el sprint pertenece al proyecto
            sprint = await sprintRepository.createQueryBuilder("sprint").where("sprint.id = :sprintId",{sprintId:sprintId}).andWhere("sprint.projectId =:projectId",{projectId:projectId}).getOne();
            console.log(sprint.id);
        } catch (error) {
            res.status(500).json({msg:'hubo un error'});
        }

        try {//Si pertence trae las tareas
          tareas = await tareaRepository.createQueryBuilder("tarea").where("tarea.sprintId = :sprintId",{sprintId:sprintId}).andWhere("tarea.urpId IS NULL").getMany();
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
    
        //las retorna las tareas en orden de status
        if (tareas.length > 0) {
          res.json(tareas);
        } else {
          res.status(500).json({ message: 'Not result' });
        }
    }; 


    static getAsignadas  = async(req: Request, res: Response)=>{
        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;

        const tareaRepository = getRepository(Tarea);
        const sprintRepository = getRepository(Sprint);
        let tareas;
        let sprint;

        try {//Para ver si el sprint pertenece al proyecto
            sprint = await sprintRepository.createQueryBuilder("sprint").where("sprint.id = :sprintId",{sprintId:sprintId}).andWhere("sprint.projectId =:projectId",{projectId:projectId}).getOne();
            console.log(sprint.id);
        } catch (error) {
            res.status(500).json({msg:'hubo un error'});
        }

        try {//Si pertence trae las tareas
          tareas = await tareaRepository.createQueryBuilder("tarea").where("tarea.sprintId = :sprintId",{sprintId:sprintId}).andWhere("tarea.urpId IS NOT NULL").getMany();
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        }
    
        //las retorna las tareas en orden de status
        if (tareas.length > 0) {
          res.json(tareas);
        } else {
          res.status(500).json({ message: 'Not result' });
        }
    
    }
    
    static getByIdT = async(req: Request, res: Response)=>{
        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;

        const { id } = req.params;//la ide viene en la url
        

        //Buscamos si el sprint pertenece al proyecto
        const sprintRepository = getRepository(Sprint);
        try {
            let sprint = await sprintRepository.createQueryBuilder("sprint").where("projectId = :idproject",{idproject:projectId}).andWhere("sprint.id = :id",{ id:sprintId}).getOne();
            if(!sprint){
                res.status(400).json( { msg: 'No existe el sprint'} )
            }
        } catch (error) {
            res.status(500).json({msg:'hubo un error'});
        }//Si existe el sprint en el proyeto

        const userRepository = getRepository(Tarea);
        try {
          let tarea = await userRepository.createQueryBuilder("tarea").where("tarea.id=:id",{id:id}).andWhere("tarea.sprintId=:sprintId",{sprintId:sprintId}).getOne();
          if(!tarea){
            res.status(400).json( { msg: 'No existe la tarea'} )
            }
          res.json(tarea);//Se manda la tarea
        } catch (error) {
            res.status(500).json({msg:'hubo un error'});
        }
        
    };

    //NUEVO TAREA
    static newTarea = async(req: Request, res: Response)=>{

        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;
        const userId :number =+req.query.userId;

        const { name, description, status, priority, urpId } = req.body;
        const tarea = new Tarea();

        tarea.name= name;
        tarea.description=description;
        tarea.status= status;
        tarea.priority= priority;
        tarea.urpId= urpId;//Puede estar o no vacio
        tarea.sprintId= sprintId;//De l aurl

        //Validate
       // const validationOpt = { validationError : { target: false, value: false }} };
        const errors = await validate(tarea);
        if (errors.length > 0) {
             res.status(400).json(errors);
        }

        //Verificar si el sprint esta asociado al proyecto
        const sprintRepository = getRepository(Sprint);
        let sprint;
        let prosp;

        try {
            sprint = await sprintRepository.findOneOrFail(sprintId);
            prosp = sprint.projectId;
        } catch (error) {
            res.status(421).json({mgs:"Sprint no encontrado para guardar"});
        }


        let tr;
        //Comparamos id del proyecto
        if(prosp == projectId){
            //ya puede ingresar la tarea
            const tareaRepository = getRepository(Tarea);
            try {
                tr =  await tareaRepository.save(tarea);
            } catch (error) {
                console.log(error);
                res.status(409).json({msg:"Tarea alredy exist"});
            }
        }else{
            res.status(409).json({msg:"Ojo con el sprint"});
        }
 
        /* {Asi se de debe de recibir los datos del front
    "name": "nuevaaaaaaaaaaa",
    "description": "Capacitar tareas señaladas por los Delegados",
    "status": "Done", 
    "priority":"Importante"
}*/
        //Guardamos
        res.json(   {msg:"OK",
                    tareaId:tr.id});

    };

    //EDITAR PROYECTO
    static editTarea = async (req: Request, res: Response) => {

        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;
        const userId :number =+req.query.userId;
        let tarea;
        const { id } = req.params;
        const { name, description, status, priority, urpId } = req.body;
        
        const userRepository = getRepository(Tarea);
        // Try get user
        try {
            tarea = await userRepository.findOneOrFail(id);
            
            tarea.name =name;
            tarea.description= description;
            tarea.status =status;
            tarea.priority =priority;
            tarea.urpId =urpId;
            tarea.sprintId =sprintId;
            
        } catch (error) {
            return res.status(404).json({ msg: 'Tarea not found' });
        }

        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(tarea,validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }


        //ver si esta asociado al proyecto
/*         const urpRepository = getRepository(Urp);
        let urp;
        try {//"urp.projectId=:projectId",{projectId:projectId} debe ir pegado los ":"
            urp =await urpRepository.createQueryBuilder("urp").where("urp.userId =:userId",{userId:userId}).andWhere("urp.projectId=:projectId",{projectId:projectId}).getOne();
            //prourp = urp.projectId;
        } catch (error) {
            console.log(error);
            res.status(421).json({mgs:"posiblemente no es tu proyecto"});
        }
 */
        //Verificar si el sprint esta asociado al proyecto
        const sprintRepository = getRepository(Sprint);
        let sprint;
        let prosp;

        try {
            sprint = await sprintRepository.findOneOrFail(sprintId);
            prosp = sprint.projectId;
        } catch (error) {
            res.status(421).json({mgs:"Sprint no encontrado para guardar"});
        }

        //Comparamos id del proyecto
        if(prosp == projectId){
            //ya puede ingresar la tarea
            const tareaRepository = getRepository(Tarea);
            try {
                await tareaRepository.save(tarea);
            } catch (error) {
                console.log(error);
                res.status(409).json({msg:'Tarea already in use'});
            }
        }else{
            res.status(409).json({msg:"Ojo con el sprint"});
        }

        res.status(201).json({ msg: 'Tarea update' });
    };

    static deleteTarea = async (req: Request, res: Response) => {

        const projectId:number =+req.query.projectId;
        const sprintId:number =+req.query.sprintId;
        const userId :number =+req.query.userId;

        const  idt  = req.params.idt;//la ide viene en la url
        console.log(idt)


        ////////////////////
        //ver si esta asociado al proyecto
        const urpRepository = getRepository(Urp);//BUSCAMOS MIEMBRO
        let urp;
        let urpID;
        try {//"urp.projectId=:projectId",{projectId:projectId} debe ir pegado los ":"
            urp =await urpRepository.createQueryBuilder("urp").where("urp.userId=:userId",{userId:userId}).andWhere("urp.projectId=:projectId",{projectId:projectId}).getOne();
            urpID = urp.id;
            console.log('hola, el proyecto es' +urp.projectId+','+urp.userId);
        } catch (error) {
            console.log(error);
            res.status(421).json({mgs:"posiblemente no es tu proyecto"});
        }

        //Verificar si el sprint esta asociado al proyecto
        const sprintRepository = getRepository(Sprint);//BUSCAMOS SPRINT
        let sprint;

        try {
            sprint = await sprintRepository.createQueryBuilder("sprint").where("sprint.id =:id",{id:sprintId}).andWhere("sprint.projectId=:Id",{Id:projectId}).getOne();
            console.log('El sprint es '+sprint.id);
        } catch (error) {
            res.status(421).json({mgs:"Tarea no esta en el sprint"});
        }

        let tareaRepository = getRepository(Tarea);
        let tar:any;
        //Comparamos id del proyecto
        
        //ya puede ingresar la tarea
        try{
            //await tareaRepository.createQueryBuilder().delete().from(Tarea).where("tarea.id =:tareaid",{tareaid:idt}).andWhere("tarea.sprintId =:sprintId",{sprintId:sprintId}).andWhere("tarea.urpId=:ID",{ID:urpID})
            tar = await tareaRepository.createQueryBuilder("tarea").where("tarea.id =:idt",{ idt: idt }).andWhere("tarea.sprintId =:sprintId",{ sprintId: sprintId }).getOne();
            //Aqui es donde hizo un DESMADRE por la estructura, checalo
            console.log(tar.id);
        }catch(error) {
            console.log(error);
            res.status(409).json({msg:'Tarea not found'});
        }
        
        
        try{
            tareaRepository.delete(tar.id);
            res.status(201).json({ msg: 'Tarea deleted' });
        }catch(error) {
            console.log(error);
            res.status(409).json({msg:'No sale'});
        }
        // Remove user
        //tareaRepository.delete(id);
        res.status(201).json({ msg: 'Tarea deleted' });
    };

}

