import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { param } from "express-validator";
import { AvatarController } from "./avatar.controller";
import { isConnected } from "../auth/auth.middleware";

const router = Router()

router.get('/:id', param("id").isLength({ min: 1 }), expressAsyncHandler(AvatarController.avatar))
router.get('/', isConnected, expressAsyncHandler(AvatarController.avatarFormView))
router.post('/', isConnected, expressAsyncHandler(AvatarController.avatarForm))

export default router;