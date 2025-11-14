import { Router } from "express";
import { getAllUser } from "../controller/userController.js";
import { getAllHr } from "../controller/hrController.js";

const router = Router();

router.route('/getallUser').get(getAllUser);
router.route('/getallHr').get(getAllHr);

export default router;

