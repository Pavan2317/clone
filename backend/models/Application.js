import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },

    candidateId: {
      type: String,
      required: true,
    },

    companyId: {
      type: String,
      required: true,
    },

    jobTitle: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    candidateName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Application", applicationSchema);
