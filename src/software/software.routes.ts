import { Router } from "express";
import { SoftwareController } from "./software.controller";

const router = Router();

router.get('/', SoftwareController.list)

export default router;