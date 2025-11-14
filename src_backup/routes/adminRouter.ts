import { Router } from "express";
import { getAllUser } from "../controller/userController.ts";
import { getAllHr } from "../controller/hrController.ts";

const router = Router();

router.route('/getallUser').get(getAllUser);
router.route('/getallHr').get(getAllHr);

export default router;