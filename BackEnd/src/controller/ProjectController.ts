import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Project} from "../entity/Project";
import { validate } from 'class-validator';
import { Urp } from "../entity/Urp";
import * as bcrypt from 'bcryptjs';
import * as nodemailer from "nodemailer";
import { google } from "googleapis";
import { User } from "../entity/User";
var atob = require('atob');
var btoa = require('btoa');


export class ProjectController {

    //GETALL
    static getMisProyectos = async (req: Request, res: Response)=>{

      const userId:number =+req.query.userId;
      //http://localhost:3000/projects/?userId=3

      const projectRepository = getRepository(Project);
      let proyectos;
      try {
        proyectos = await projectRepository.createQueryBuilder("project").innerJoin("project.urpp", "urp").where("urp.userId = :id",{id:userId }).getMany();
        //proyectos = await projectRepository.find();
      } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'});
      }

      if (proyectos.length > 0){
        res.json(proyectos);//Manda todos los proyectos
      }else{
        res.status(500).json({msg:'Not result'});
      }
    };

    //SOLO UN PROYECTO
    static getByIdP = async(req: Request, res: Response)=>{

      const projectId:number =+req.query.projectId;
        //const { id } = req.params;//la ide viene en la url
      const userRepository = getRepository(Project);

      try {
        let proyecto = await userRepository.findOneOrFail(projectId);
        if(!proyecto){
          res.status(400).json( { msg: 'No existe el proyecto'} )
      }
        res.json(proyecto);
      } catch (error) {
        res.status(500).json({msg:'hubo un error'});
      } 
    };

    //NUEVO PROYECTO
    static newProject = async(req: Request, res: Response)=>{

        const { name, description } = req.body;
        const proyecto = new Project();

        proyecto.name= name;
        proyecto.description=description;

        //Validate
       // const validationOpt = { validationError : { target: false, value: false }} };
        const errors = await validate(proyecto);
        if (errors.length > 0) {
             res.status(400).json(errors);
        }

        const projectRepository = getRepository(Project);
        let pro;
        try {//Guardar pryecto creado
            pro = await projectRepository.save(proyecto);
        } catch (error) {
            res.status(409).json({msg:"Project alredy exist"});
        }

        const urpRepository = getRepository(Urp);
        const owner = new Urp();
        const userId =+req.query.userId;

        owner.userId = userId;
        owner.projectId =pro.id;
        owner.rol = "ProductOwner";
        try {//Gurdar al ProductOwner
          await urpRepository.save(owner);
        } catch (error) {
          res.status(410).json({msg:"ProductOwner alredy exist"});
        }
        //MANDAMOS LA ID DEL PROYECTO CREADO
        res.json( {msg:"OK",
                  projectId:pro.id});
    };

    //DES
    static desencriptar =async(req: Request, res: Response)=>{

      const { projectId, rol, email } = req.body;

      const userRepository = getRepository(Project);
      let proyecto

      try {
        let proDes:any =atob(projectId);
        let rolDes:any= atob(rol);
        let emailDes:any = atob(email);
        try {
          proyecto = await userRepository.findOneOrFail(proDes);
          if(!proyecto){
            res.status(400).json( { msg: 'No existe el proyecto'} )
          }
        } catch (error) {
          res.status(500).json({msg:'hubo un error'});
        } 
        let nombre = proyecto['name'];
        //console.log(proyecto['name'])
        res.status(210).json({proDes,rolDes,emailDes,nombre});

      } catch (error) {
        console.log(error);
        res.status(503).json({msg:'Datos vacios'});
      }

    }

    //INVITACIONES
    static invitar = async(req: Request, res: Response)=>{
      const userId =+req.query.userId;//          --->Para obetner el nombre del PO
      const projectId =+req.query.projectId;
      let equipo:[];//RECIBIR VARIOS DICCIONARIOS
      let url:any[]=['url'];
      let conf:string[];
      equipo=req.body;//equipo
      
      //aqui saca el nombre del PO
      const userRepository = getRepository(User);
      let PO;
      let nombre;
      try {
        PO = await userRepository.findOneOrFail(userId)
        nombre = PO.firstName;
      } catch (error) {
        res.status(500).json({msg:'hubo un error'});
      }


      //////////////////////////////////////////////////////////////
      const CLIENT_ID = '304122663052-74ktc04obvdpepe9bj6av56sm2ut86nc.apps.googleusercontent.com';
      const CLIENT_SECRET = 'jmhTZZxeYeZrOgR1tpmP5jzY';
      const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
      const REFRESH_TOKEN = '1//0427g5CecTNTvCgYIARAAGAQSNwF-L9IrgSRO_IDjo9XcvXZEy1_hfcCaKYgyyX5TrWniz7GMA0Yp7EvrkRqaau5YW2BvckgjHmc';
      
      const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,REDIRECT_URI);
      oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
      
      try {
        //const accesToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          port: 465,
          secure: true,
          ignoreTLS: true,
          auth: {
            //type: 'OAuth2',
            user: 'geproys@geproys.epizy.com',
            pass: 'edudamdan'
            //clientId: CLIENT_ID,
            //clientSecret: CLIENT_SECRET,
            //refreshToken: REFRESH_TOKEN,
            //accesToken: accesToken
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        transport.verify((e: any, success: any)=>{
          if (e) console.error(e);
          console.log('Your config is correct');
        })

        for (let index = 0; index < equipo.length; index++) {

          const correo = equipo[index]['email'];
          const rol = equipo[index]['rol'];
          ///Encriptar
          let proEnc: any = btoa(projectId);
          let rolEnc: any= btoa(rol);
          let emailEnc: any= btoa(correo);



          //url[index] = {'url' :'http://localhost:3000/urp/newUrp/?projectId='+proEnc+'&rol='+rolEnc+'&email='+emailEnc};
          url[index] = {'url' :'http://localhost:4200/Invitacion?projectId='+proEnc+'&rol='+rolEnc+'&email='+emailEnc};
          //
          const mailOptions = {
            from: 'GePROYS 🔥🥵😈 <geproys@geproys.epizy.com>',
            to: correo,
            subject: 'Invitacion ',
            text: 'Hello from gmail using API',
            html: `
            <div style=" margin: 0 auto; width: 80%; ">
              <div>
                <h2>${nombre} te ha invitado a participar en un proyecto en GeProys 😄</h2>
              </div>
              <div>
                <p>GeProys es una herramienta para que los equipos de trabajo que desarrollan proyectos, administren las distintas tareas que puedan llegar a tener los integrantes del mismo, todo esto bajo conceptos e ideas de la metodología SCRUM</p>
                <p><b>Una herramienta tan capaz y tan apta como para que tenga usos profesionales</b>, tan fácil e intuitiva de usar para tener usos escolares</p>
              </div>
              <div>
                <p>Ingresa al siguiente link: http://localhost:4200/Invitacion?projectId=${proEnc}&rol=${rolEnc}&email=${emailEnc}</p>
              </div>
            </div>`,
          };
          const result = await transport.sendMail(mailOptions);
          console.log('Email sent...', result);//PARA MOSTRAR LAS PROMESAS DEBES LLAMAR A LA FUNCION Y USAR THEN 
          //conf[index] = correo;
          
        }

       res.status(250).json({msg:`Se enviaron todos los correos`});
      } catch (error) {
        console.log(error);
        res.status(550).json({msg:'Hubo un error email'});
      }
      ////////////////////////////////////////////////////////////////

      //res.json(url)//se mandan las invitaciones
    };

    //EDITAR PROYECTO
    static editProject = async (req: Request, res: Response) => {
        let proyecto;
        const projectId:number =+req.query.projectId;
        //const { id } = req.params;
        const { name, description } = req.body;
    
        const userRepository = getRepository(Project);
        // Try get user
        try {
            proyecto = await userRepository.findOneOrFail(projectId);
            
            proyecto.name =name;
            proyecto.description= description;
            
        } catch (error) {
          return res.status(404).json({ msg: 'Project not found' });
        }
        const validationOpt = { validationError: { target: false, value: false } };//para no mostrar en back la info||1:49:56
        const errors = await validate(proyecto,validationOpt);
        if (errors.length > 0) {
          return res.status(400).json(errors);
        }
    
        // Try to save user
        try {
          await userRepository.save(proyecto);
        } catch (error) {
          return res.status(409).json({ msg: 'Project already in use' });
        }
    
        res.status(201).json({ msg: 'Project update' });
    };

    static deleteProject = async (req: Request, res: Response) => {
      const projectId:number =+req.query.projectId;
      const userRepository = getRepository(Project);
      let proyecto: Project;
    
      try {
        proyecto = await userRepository.findOneOrFail(projectId);
      } catch (error) {
          return res.status(404).json({ msg: 'Project not found' });
      }
    
        // Remove user
        userRepository.delete(projectId);
        res.status(201).json({ msg: ' Project deleted' });
    };

}