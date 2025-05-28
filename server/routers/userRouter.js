import express from "express";
import { identifier } from "../middlewares/identification.js";
import { profile, setPremium } from "../controllers/userContoller.js";

const router = express.Router();

router.get("/profile", identifier, profile);
router.get("/set-premium", identifier, setPremium);

export default router;
