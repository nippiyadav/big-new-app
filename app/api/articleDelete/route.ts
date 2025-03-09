import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "@/model/blog_model";
import { NextRequest,NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try {       
        const {searchParams} = req.nextUrl;        
        const deleteArticleId = searchParams.get("deleteId");
        console.log("deleteArticleId:- ",deleteArticleId);
        if (!deleteArticleId) {
            return NextResponse.json({message:"DeletedArticleId not provided"},{status:200})
        }
        
        const cookiesObject = req.cookies.get("userId");
        console.log("cookiesObjectL- ",cookiesObject);
        
        if (!cookiesObject?.value) {
            return NextResponse.json({message:"Your are not logged in"},{status:401})
        }

        await connectToDatabase();
        const articleExisting = await ArticleModel.findById(deleteArticleId);

        if (!articleExisting) {
            return NextResponse.json({message:"Article does not exist"},{status:200})
        }

        console.log("articleExisting:- ", articleExisting);

        const articleDeleted = await ArticleModel.deleteOne({_id:articleExisting});
        console.log("articleDeleted:- ",articleDeleted);
        
        return NextResponse.json({message:"Successfully Fetched"},{status:200})
        
    } catch (error) {
        console.log("Error in the articleDeleting");
        return NextResponse.json({message:"Server error"},{status:500})
    }
}