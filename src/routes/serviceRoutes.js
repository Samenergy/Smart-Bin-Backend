import express from "express";
import {
  getServiceProfile,
  updateServiceProfile,
  getServiceAreas,
  getCollectionSchedules,
  getPerformanceLogs,
  addPerformanceLog,
  updatePerformanceLog,
  deletePerformanceLog,
} from "../controllers/serviceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getServiceProfile);
router.put("/profile", authMiddleware, updateServiceProfile);
router.get("/areas", authMiddleware, getServiceAreas);

router.get("/schedules", authMiddleware, getCollectionSchedules);
router.get("/:_id/performance-logs",authMiddleware, getPerformanceLogs);

router.post("/:_id/performance-logs",authMiddleware, addPerformanceLog);

router.put("/:_id/performance-logs/:logId",authMiddleware, updatePerformanceLog);

router.delete("/:_id/performance-logs/:logId",authMiddleware, deletePerformanceLog);
export default router;
