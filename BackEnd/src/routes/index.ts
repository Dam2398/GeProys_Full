import {Router} from 'express';

//import auth from './auth';
import user from './user';
import project from './project';
import tarea from "./tarea";
import sprint from './sprint';
import urp from './urp';
import auth from './auth';

const router = Router();

router.use('/auth', auth);
router.use('/users', user);
router.use('/projects', project);
router.use('/tareas',tarea);
router.use('/sprints',sprint);
router.use('/urp', urp);

export default router;
