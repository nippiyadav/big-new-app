import mongoose, { model, models, Schema } from "mongoose";

const CommentModels = new Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "ArticleModel", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "BlogUser", required: true },
    text: String
}, { timestamps: true });

export const comment = models.comment || model("comment", CommentModels)