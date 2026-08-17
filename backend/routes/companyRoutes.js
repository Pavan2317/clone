import express from "express";
import {
    getCompanies,
    getCompanyById,
    addCompany,
    updateCompany,
    deleteCompany
} from "../controllers/companyController.js";

const router = express.Router();

// Get all companies
router.get("/", getCompanies);

// Get company by ID
router.get("/:id", getCompanyById);

// Add company
router.post("/", addCompany);

// Update company
router.put("/:id", updateCompany);

// Delete company
router.delete("/:id", deleteCompany);

export default router;
