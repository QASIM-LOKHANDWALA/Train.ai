import express from "express";
import { identifier } from "../middlewares/identification.js";
import {
    profile,
    setPremium,
    updateLikedModel,
} from "../controllers/userContoller.js";

const router = express.Router();

router.get("/profile", identifier, profile);
router.get("/set-premium", identifier, setPremium);
router.get("/update-liked-model/:modelId", identifier, updateLikedModel);

export default router;
