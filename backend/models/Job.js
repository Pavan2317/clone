import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    companyId: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Full Time",
    },

    experience: {
      type: String,
      default: "",
    },

    requirements: {
      type: String,
      default: "",
    },

    benefits: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);
