import { Router } from "express";
import { SoftwareController } from "./software.controller";
import expressAsyncHandler from 'express-async-handler'
import { query, param, body } from "express-validator";
import { isConnected } from "../auth/auth.middleware";
const router = Router();

router.get('/', query("page").default(1).isNumeric().isLength({ min: 1 }), query("search").isLength({ min: 3 }).optional(), expressAsyncHandler(SoftwareController.list))
router.get('/edit/:id', isConnected, expressAsyncHandler(SoftwareController.edit))
router.post('/edit/:id',
    isConnected,
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
        .optional({values: "falsy"})
        .isURL(),
    body("url_sill")
        .optional({values: "falsy"})
        .isURL(),
    body("url_framalibre")
        .optional({values: "falsy"})
        .isURL(),
    expressAsyncHandler(SoftwareController.editPost))

export default router;