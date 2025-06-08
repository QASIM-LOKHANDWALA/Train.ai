import express from "express";
import { trainModel } from "../controllers/modelController.js";
import { identifier } from "../middlewares/identification.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/train", identifier, upload.single("csv_file"), trainModel);

export default router;
