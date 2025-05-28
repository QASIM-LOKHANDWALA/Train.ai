import express from "express";
import { signup, signin, signout } from "../controllers/authController.js";
import { identifier } from "../middlewares/identification.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", identifier, signout);

export default router;
