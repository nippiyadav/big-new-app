import { connectToDatabase } from "@/lib/mongodb";
import { CommentModel } from "@/model/comment_model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {
        await connectToDatabase();
        const {searchParams} = req.nextUrl;
        const blogId = searchParams.get("blogId");
        const fetchedComment = searchParams.get("fetchedComment");
        console.log("blogId:- ", blogId,"\n", "fetchedComment:- ", fetchedComment);
        
        const intialComment = await CommentModel.findOne({blog:blogId}).populate("user","username fullname _id").sort({createdAt:-1}).exec();
        console.log("intialComment:- ",intialComment);
        
        return NextResponse.json({message:"Comment Fetched correctly",comment:intialComment},{status:200});
    } catch (error) {
        console.log("Error in the Fetching Comment:- ", error);
        return NextResponse.json({message:"Server Error"},{status:500})
    }
}