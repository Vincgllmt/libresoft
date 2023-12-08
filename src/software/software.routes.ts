import { Router } from "express";
import { SoftwareController } from "./software.controller";
import expressAsyncHandler from 'express-async-handler'
import { query, param, body } from "express-validator";
const router = Router();

router.get('/', query("page").default(1).isNumeric().isLength({ min: 1 }), query("search").isLength({ min: 3 }).optional(), expressAsyncHandler(SoftwareController.list))
router.get('/edit/:id', expressAsyncHandler(SoftwareController.edit))
router.post('/edit/:id',
    param("id")
        .isNumeric()
        .isLength({ min: 1 }),
    body("name")
        .isString(),
    body("url")
        .isURL(),
    body("description")
        .isString(),
    body("url_wikipedia")
    .isURL()
    .optional(),
    body("url_sill")
        .isURL()
        .optional(),
    body("url_framalibre")
        .isURL()
        .optional(),
    expressAsyncHandler(SoftwareController.editPost))

export default router;