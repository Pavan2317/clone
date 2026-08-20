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

// Create application (WITH DUPLICATE CHECK)
export const createApplication = async (req, res) => {
  try {
    const { jobId, candidateId, companyId, company, jobTitle, candidateName, status } = req.body;

    // Check if the candidate has already applied for this job
    const existingApplication = await Application.findOne({
      jobId: jobId,
      $or: [
        { candidateId: candidateId },
        { "candidateId._id": candidateId }
      ]
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job."
      });
    }

    const application = new Application({
      jobId,
      candidateId,
      companyId: companyId || company || "N/A",
      jobTitle,
      company,
      candidateName,
      status: status || "pending",
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

// Get applications by candidate ID (FIXED FILTER QUERY)
export const getApplicationsByCandidateId = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;

    const applications = await Application.find({
      $or: [
        { candidateId: candidateId },
        { "candidateId._id": candidateId },
        { candidateId: String(candidateId) }
      ]
    })
      .populate("jobId")
      .populate("companyId");

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get applications by company ID
export const getApplicationsByCompanyId = async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const applications = await Application.find({
      $or: [{ companyId: companyId }, { company: companyId }],
    })
      .populate("jobId")
      .populate("candidateId", "name email");

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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