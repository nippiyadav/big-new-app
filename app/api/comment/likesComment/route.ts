import { CommentModel, CommentsProps } from "@/model/comment_model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { log } from "node:console";

export async function POST(req: NextRequest) {
    try {
        const { id } = await req.json();
        const cookiesObject = req.cookies.get("userId");

        if (!cookiesObject?.value) {
            return NextResponse.json({ message: "User not Authorized" }, { status: 401 })
        };

        console.log("commentId:- ", id);
        const commentFinding: CommentsProps | null = await CommentModel.findById(id);
        if (!commentFinding) {
            return NextResponse.json({ message: "Comment not found!" }, { status: 200 })
        }
        const userIdAsObjectId = new mongoose.Types.ObjectId(cookiesObject.value);

        console.log((userIdAsObjectId));



        if (commentFinding.likes.includes(userIdAsObjectId)) {
            const commentExisting = await CommentModel.findByIdAndUpdate(id, { $pull: { likes: cookiesObject.value } }, { new: true });
            console.log("commentExisting removing:- ", commentExisting);
        } else {
            console.log("dilike present:- ",commentFinding.dislikes.some((data) => data.equals(userIdAsObjectId)));

            if (commentFinding.dislikes.some((data) => data.equals(userIdAsObjectId))) {
                const commentingExisting = await CommentModel.findByIdAndUpdate(id, {
                    $pull: { dislikes: cookiesObject.value },
                    $addToSet: { likes: cookiesObject.value }
                });
                console.log("commentExisting removing from dislikes adding likes:- ", commentingExisting);
            } else {
                const commentingExisting = await CommentModel.findByIdAndUpdate(id, { $addToSet: { likes: cookiesObject.value } }, { new: true });
                console.log("commentExisting adding likes:- ", commentingExisting);
            }
        }


        return NextResponse.json({ message: "Successfully Liked Comment" }, { status: 200 })
    } catch (error) {
        console.log("Error in the Likes-Comments:- ", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}