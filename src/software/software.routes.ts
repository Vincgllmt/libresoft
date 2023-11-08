import { Router } from "express";
import { SoftwareController } from "./software.controller";
import expressAsyncHandler from 'express-async-handler'
const router = Router();

router.get('/', expressAsyncHandler(SoftwareController.list))

export default router;