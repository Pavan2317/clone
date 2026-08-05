import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
{
    companyName: {
        type: String,
        required: true
    },

    location: {
        type: String
    },

    website: {
        type: String
    },

    description: {
        type: String
    },

    logo: {
        type: String
    }
},
{
    timestamps: true
}
);

const Company = mongoose.model("Company", companySchema);

export default Company;