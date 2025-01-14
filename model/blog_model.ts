import mongoose, { models } from "mongoose";

const BlogModel = new mongoose.Schema({
    title: { type: String, required:true },
    description: { type: String, required:true },
    createdBy: { type: String, required:true },
    blogImageUrl: { type: String, required: true },
    featuredImagealt: { type: String, required: true },
    category: { type: String, required: true },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }],
    public: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }
}, { timestamps: true })

export const ArticleModel = models.ArticleModel || mongoose.model("ArticleModel", BlogModel)



// createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" },