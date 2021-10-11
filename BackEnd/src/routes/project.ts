import { ProjectController } from "./../controller/ProjectController";
import { Router } from "express";
import { checkJwt } from "../middleware/jwt";
import { checkRole } from "../middleware/role";

const router = Router();

//YA JALA TODO

// MIS PROYECTOS
router.get('/misProyectos',[checkJwt] , ProjectController.getMisProyectos);

// Get one project
router.get('/',[checkJwt,checkRole(['ProductOwner','ScrumMaster','Developer'])], ProjectController.getByIdP);

// Create a new project
router.post('/new',[checkJwt] , ProjectController.newProject);

//GENERAR INIVITACIONES
router.post('/generarInv', [checkJwt,checkRole(['ProductOwner'])], ProjectController.invitar);
//[checkJwt,checkRole(['ProductOwner'])],

//DES
router.post('/des', [checkJwt], ProjectController.desencriptar);

// Edit project
router.patch('/editProject', [checkJwt, checkRole(['ProductOwner'])] ,ProjectController.editProject);

// Delete
router.delete('/deleteProject', [checkJwt, checkRole(['ProductOwner'])], ProjectController.deleteProject);

export default router;
