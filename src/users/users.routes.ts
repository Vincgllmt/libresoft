import { Router } from "express";
import { UsersController } from "./users.controller";
import expressAsyncHandler from 'express-async-handler'
import { param } from "express-validator";
const router = Router();

router.get('/:id?', param("id").isNumeric().optional(), expressAsyncHandler(UsersController.list))

export default router;