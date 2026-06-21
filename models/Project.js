import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" }, 
    tags: { type: [String], default: [] }, 
    liveUrl: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    order: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
