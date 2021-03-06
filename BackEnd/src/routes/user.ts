import { UserController } from "./../controller/UserController";
import { Router } from "express";
import { checkJwt } from "../middleware/jwt";

const router = Router();


// Get all users
router.get('/', [checkJwt],UserController.getAll);

// Get one user
router.get('/:id', UserController.getById);

// Create a new user
router.post('/newUser', UserController.newUser);

// Edit user
router.patch('/:id', UserController.editUser);

// Delete
router.delete('/:id', UserController.deleteUser);

export default router;
