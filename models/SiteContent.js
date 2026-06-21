import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Ehtisham Ali" },
    role: { type: String, default: "MERN Stack Developer" },
    heroHeadline: { type: String, default: "Building full-stack products with MERN." },
    heroSubtext: {
      type: String,
      default:
        "I design and ship web applications end-to-end — from MongoDB schemas to pixel-perfect React interfaces.",
    },
    photoUrl: { type: String, default: "" },
    cvUrl: { type: String, default: "" },
    email: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    availableForWork: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);
