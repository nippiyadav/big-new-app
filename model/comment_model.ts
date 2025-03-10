import mongoose, { model, models, Schema } from "mongoose";

export interface CommentsProps {
    blog: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    likes: mongoose.Schema.Types.ObjectId;
    dislikes: mongoose.Schema.Types.ObjectId;
}

const CommentModels = new Schema<CommentsProps>({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "ArticleModel", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "BlogUser", required: true },
    text: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogUser" }]
}, { timestamps: true });

export const CommentModel = models.CommentModel || model("CommentModel", CommentModels)