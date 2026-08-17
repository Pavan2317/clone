import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

// Get all jobs
router.get("/", getJobs);

// Get one job
router.get("/:id", getJobById);

// Create job
router.post("/", createJob);

// Update job
router.put("/:id", updateJob);

// Delete job
router.delete("/:id", deleteJob);

export default router;
