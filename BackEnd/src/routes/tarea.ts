import { TareaController } from "./../controller/TareaCrontoller";
import { Router } from "express";
import { checkJwt } from "../middleware/jwt";
import { checkRole } from "../middleware/role";

const router = Router();


//Todas mis tareas
router.get('/misTareas',[checkJwt, checkRole(['ScrumMaster','Developer','ProductOwner'])], TareaController.getMisTareas);

//Tareas sin asignar
router.get('/tareasNoAsignadas',[checkJwt, checkRole(['ScrumMaster','Developer','ProductOwner'])],TareaController.getTareasNulas);

//Get All
router.get('/',[checkJwt, checkRole(['ProductOwner', 'Developer', 'ScrumMaster'])] ,TareaController.getAll);

//Tareas asignadas
router.get('/tareasAsignadas',[checkJwt, checkRole(['ScrumMaster','Developer','ProductOwner'])], TareaController.getAsignadas)

// Get one project
router.get('/:id',[checkJwt, checkRole(['ScrumMaster','ProductOwner','Developer'])], TareaController.getByIdT);

// Create a new project
//router.post('/', TareaController.newTarea);

// Edit project
router.patch('/edit/:id',[checkJwt, checkRole(['ScrumMaster','ProductOwner','Developer'])], TareaController.editTarea);

// Delete
router.delete('/delete/:idt',[checkJwt, checkRole(['ScrumMaster','ProductOwner'])], TareaController.deleteTarea);


//NUEVA TAREA
router.post('/nuevaTarea',[checkJwt, checkRole(['ScrumMaster','ProductOwner'])], TareaController.newTarea);

export default router;
