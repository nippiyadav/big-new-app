import { ArticleModel } from "@/model/blog_model";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("contentId");
  const content = searchParams.get("content");

  console.log("article edit id:- ", articleId);
  console.log("article edit id:- ", content);

  if (articleId && content === "Get") {
    try {
      const response = await ArticleModel.find({ _id: articleId }).lean();

      return NextResponse.json({
        status: 200,
        message: "Data Got",
        data: response,
      });
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: "Something Went Wrong",
        error:error
      });
    }
  }

  return NextResponse.json({
    status: 500,
    message: "Something Went Wrong",
  });
}

export async function POST(req: NextRequest) {
  const {
    id,
    blogImageUrl,
    category,
    content,
    featuredImagealt,
    slug,
    title,
    description,
    visibility,
  } = await req.json();

  try {

    // Construct the update object dynamically
    const updateFields: Record<string, unknown> = {};

    if (blogImageUrl) updateFields.blogImageUrl = blogImageUrl;
    if (category) updateFields.category = category;
    if (content) updateFields.content = content;
    if (featuredImagealt) updateFields.featuredImagealt = featuredImagealt;
    if (slug) updateFields.slug = slug;
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (visibility !== undefined) updateFields.visibility = visibility;

    // Update the document using $set to modify only specified fields
    const responseFind = await ArticleModel.findOne({_id:id});
    console.log("Article Found! ",responseFind);
    

    const response = await ArticleModel.updateOne(
      { _id: id }, // Filter by id
      { $set: updateFields }, // Update only the fields in updateFields
    );

    // Check if the update was successful
    if (response.modifiedCount === 0) {
      return NextResponse.json({ status: 404, message: "No document found to update" });
    }

    const responseUpdate = await ArticleModel.findOne({_id:id});
    console.log("Article Found! after update ",responseUpdate);

    return NextResponse.json({ status: 200, message: "Submit Successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, message: "Something went wrong" });
  }
}

