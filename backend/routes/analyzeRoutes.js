import { Router } from "express";
import { analyzeResume } from "../controller/analyzeController.js";
import { errorHandler } from "../middleware/errorHandler.js";
import { uploadResume } from "../middleware/upload.js";
import { asyncHandler } from "../utils.js";

const router = Router();
router.post("/analyze", uploadResume.single("resume"), asyncHandler(analyzeResume));
router.use(errorHandler);

export default router;
