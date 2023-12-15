import { Router } from "express";
import { DiscussController } from "./discuss.controller";
import expressAsyncHandler from "express-async-handler";
import { isConnected } from "../auth/auth.middleware";

const router = Router()

router.get('/', 
    isConnected,
    expressAsyncHandler(DiscussController.chat))

export default router;