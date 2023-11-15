import { Router } from "express";
import { UsersController } from "./users.controller";
import expressAsyncHandler from 'express-async-handler'
import { query } from "express-validator";
const router = Router();

router.get('/:id', expressAsyncHandler(UsersController.list))

export default router;