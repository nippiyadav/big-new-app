import { connectToDatabase } from "@/lib/mongodb";
import { CommentModel, CommentsProps } from "@/model/comment_model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { log } from "node:console";

export async function POST(req:NextRequest){
    try {
        const {id} = await req.json();
        console.log("id of comment:- ",id);
        if (!id) {
            return NextResponse.json({message:"Comment id is not present"},{status:401})
            
        }
        const cookiesObject = req.cookies.get("userId");
        if (!cookiesObject?.value) {
            return NextResponse.json({message:"User is authorized"},{status:401})
        }

        await connectToDatabase()

        const commentExisting:CommentsProps|null = await CommentModel.findById(id);
        if (!commentExisting) {
            return NextResponse.json({message:"Comment not exist"},{status:201})
        }

        const userObjectId = new mongoose.Types.ObjectId(cookiesObject.value);
        console.log("userObjectId:- ",userObjectId);

        if (commentExisting.dislikes.some((data)=> data.equals(userObjectId))) {
            console.log("disliking already");
            
            const userIdAsObjectId = await CommentModel.findByIdAndUpdate(id,{
                $pull:{dislikes:cookiesObject.value}
            },{new:true});
            console.log("userIdAsObjecId:- ", userIdAsObjectId);
        }else{
            if (commentExisting.likes.some((data)=> data.equals(userObjectId))) {
                const userIdAsObjectId = await CommentModel.findByIdAndUpdate(id,{
                    $pull:{likes:cookiesObject.value},
                    $addToSet:{dislikes:cookiesObject.value}
                },{new:true})
                console.log("userIdAsObjecId:- ", userIdAsObjectId);
            }else{                
                const userIdAsObjectId = await CommentModel.findByIdAndUpdate(id,{
                    $addToSet:{dislikes:cookiesObject.value}
                },{new:true});
                console.log("userIdAsObjecId adding dislikes:- ", userIdAsObjectId);
            }
        }


        return NextResponse.json({message:"Successfully Done disliking"},{status:200})
    } catch (error) {
        console.log("Error in the dislikeApi Comment",error);
        return NextResponse.json({message:"Server Error"},{status:500})
    }
}