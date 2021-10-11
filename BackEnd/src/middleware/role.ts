import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { Urp } from "../entity/Urp";


export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        
        const { userId }= res.locals.jwtPayload;
        console.log(userId);
        const projectId:number =+req.query.projectId;

        const urpRepository = getRepository(Urp);
        let urp: Urp;
        let rol;

        try {
            urp = await urpRepository.createQueryBuilder("urp").where("urp.userId = :userId",{userId:userId }).andWhere("urp.projectId = :projectId", {projectId:projectId}).getOne();
            rol = urp.rol;//Obtenemos el rol del usuario
        } catch (error) {
            console.log(error);
            res.status(502).json({msg:'Not Authorized Posiblemente no trabajas en este proyecto'});
        }

        if (roles.includes(rol)) {
            //res.json(rol);
            //console.log(roles,'hola')
            //console.log(rol)
            next();
        } else {
            res.status(401).json({ message: 'Not Authorized, por tu rol' });
        }
    }

}
