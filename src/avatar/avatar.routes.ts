import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { param } from "express-validator";
import { AvatarController } from "./avatar.controller";

const router = Router()

router.get('/:id', param("id").isLength({ min: 1 }), expressAsyncHandler(AvatarController.avatar))

export default router;