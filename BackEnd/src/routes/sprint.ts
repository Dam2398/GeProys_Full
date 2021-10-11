import { SprintController } from "./../controller/SprintController";
import { Router } from "express";
import { checkRole } from "../middleware/role";
import { checkJwt } from "../middleware/jwt";

const router = Router();

// Solo un sprint
router.get('/byid/:id',[checkJwt, checkRole(['ScrumMaster','ProductOwner','Developer'])], SprintController.getByIdS);

// Get all project sprints|chi
router.get('/sprintsProject/',[checkJwt, checkRole(['ProductOwner','ScrumMaster','Developer'])], SprintController.getAllS);

// Get one project
//router.get('/:id', SprintController.getByIdS);

//SPRINT QUE SE MUESTRA DESPUES DE SELECCIONAR EL PROYECTO|chi
router.get('/SprintActual/',[checkJwt, checkRole(['ScrumMaster','Developer','ProductOwner'])], SprintController.MostrarSprintActual);

// Create a new project
router.post('/newSprint',[checkJwt, checkRole(['ScrumMaster','ProductOwner'])], SprintController.newSprint);

// Edit project
router.patch('/edit/:id',[checkJwt, checkRole(['ScrumMaster','ProductOwner'])], SprintController.editSprint);

// Delete
router.delete('/delete/:id',[checkJwt, checkRole(['ScrumMaster','ProductOwner'])], SprintController.deleteSprint);

export default router;
