import express from "express";

import {
  getApplications,
  createApplication,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationsByCandidateId,
  getApplicationsByCompanyId,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

// Optional: Import your auth middleware if available
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all applications
router.get("/", getApplications);

// Create application
router.post("/", createApplication);

// Get applications by candidate
router.get("/candidate/:candidateId", getApplicationsByCandidateId);

// Get applications by company
router.get("/company/:companyId", getApplicationsByCompanyId);

// Get single application
router.get("/:id", getApplicationById);

// Update application status
router.put("/:id/status", updateApplicationStatus);

// Update application
router.put("/:id", updateApplication);

// Delete application
router.delete("/:id", deleteApplication);

export default router;
