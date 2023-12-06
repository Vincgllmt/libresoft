import { Router } from "express";
import { SoftwareController } from "./software.controller";
import expressAsyncHandler from 'express-async-handler'
import { query } from "express-validator";
const router = Router();

router.get('/', query("page").default(1).isNumeric().isLength({min: 1}), query("search").isLength({min: 3}).optional(), expressAsyncHandler(SoftwareController.list))
router.get('/edit/:id', expressAsyncHandler(SoftwareController.edit))
router.post('/edit/:id', expressAsyncHandler(SoftwareController.editPost))

export default router;