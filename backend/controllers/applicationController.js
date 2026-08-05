import Application from "../models/Application.js";

// Get all applications (Populated)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId")
      .populate("candidateId", "name email")
      .populate("companyId");

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Create application
export const createApplication = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const application = new Application({
      jobId: req.body.jobId,
      candidateId: req.body.candidateId,
      companyId: req.body.companyId || req.body.company || "",
      jobTitle: req.body.jobTitle,
      company: req.body.company,
      candidateName: req.body.candidateName,
      status: "pending",
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    console.error("CREATE APPLICATION ERROR:", error);
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId")
      .populate("candidateId", "name email")
      .populate("companyId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get applications by candidate ID
export const getApplicationsByCandidateId = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    const applications = await Application.find({
      $or: [{ candidateId: candidateId }, { "candidateId._id": candidateId }],
    })
      .populate("jobId")
      .populate("companyId");

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get applications by company ID (FIXED FIELD QUERY)
export const getApplicationsByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    // Checks companyId as well as company string for maximum compatibility
    const applications = await Application.find({
      $or: [
        { companyId: companyId },
        { company: companyId }
      ],
    })
      .populate("jobId")
      .populate("candidateId", "name email");

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update application
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};