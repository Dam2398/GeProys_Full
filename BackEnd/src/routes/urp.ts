import { UrpController } from "./../controller/UrpController";
import { Router } from "express";
import { checkJwt } from "../middleware/jwt";
import { checkRole } from "../middleware/role";

const router = Router();
//YA JALA TOFO AQUI

// Get Equipo Scrum
router.get('/equipo',[checkJwt,checkRole(['ProductOwner','ScrumMaster','Developer'])], UrpController.GetEquipoScrum);//Todos pueden ver al equipo

// Get one user
router.get('/equipo/miembro/:id',[checkJwt,checkRole(['ProductOwner','ScrumMaster','Developer'])], UrpController.GetMiembroEquipo);//Ya jala

// Create a new miembro
router.post('/newUrp',[checkJwt], UrpController.newUrp);

//Delete
router.delete('/:id',[checkJwt,checkRole(['ProductOwner'])],UrpController.deleteUrp);

// Edit project
router.patch('/:id',[checkJwt,checkRole(['ProductOwner'])], UrpController.editUrp);

export default router;
