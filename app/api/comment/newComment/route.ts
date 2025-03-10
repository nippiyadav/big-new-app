import { connectToDatabase } from "@/lib/mongodb";
import { CommentModel, CommentsProps } from "@/model/comment_model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { articleId, text } = await req.json();
        console.log("Body Data:- ", articleId, text);
        if (!articleId || !text) {
            return NextResponse.json({ message: "Please Provide all parameters" }, { status: 400 })
        }
        // below methods is used for the getting logged-in userId
        const cookiesObjectUserId = req.cookies.get("userId");
        console.log("cookiesObjectUserId:- ", cookiesObjectUserId);
        if (!cookiesObjectUserId?.value) {
            return NextResponse.json({ message: "You are not authorizedb" }, { status: 401 })
        }

        await connectToDatabase()
        const commentSaved = await CommentModel.create({
            blog: articleId,
            user: cookiesObjectUserId.value,
            text: text
        });

        console.log("commentSaved:- ", commentSaved);

        return NextResponse.json({ message: "Successfully Done" }, { status: 200 });

    } catch (error) {
        console.log("Error in the Commenting Api");
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}