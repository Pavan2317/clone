import Company from "../models/Company.js";

// Get all companies
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        res.json(companies);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.json(company);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Add company
export const addCompany = async (req, res) => {
    try {

        const company = await Company.create(req.body);

        res.status(201).json(company);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update company
export const updateCompany = async (req, res) => {
    try {

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(company);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Delete company
export const deleteCompany = async (req, res) => {
    try {

        await Company.findByIdAndDelete(req.params.id);

        res.json({
            message: "Company deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
