import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "@/model/blog_model";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { BlogUser } from "@/model/user_model";

interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

// GET Method
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const single = searchParams.get("single");
  console.log("hey this is ", id);
  await connectToDatabase();

  //  const fetched =  await ArticleModel.({category:"wwe"}).sort({createdAt: -1}).limit(5).lean();
  //  console.log(fetched);
  //   return NextResponse.json(fetched, { status: 200 });

  if (id === "auth") {
    try {
      const cookiesObject = await cookies();
      const value = cookiesObject.get("accessToken")?.value;
      console.log("Cookies:-", value);
      if (!value) {
        return NextResponse.json({
          status: 404,
          message: "Please Logged in first",
        });
      }
      const { id } = jwt.verify(
        value as string,
        process.env.NEXT_PUBLIC_JWT_SECRET!
      ) as JWTPayload;

      console.log(id);
      const userExistance = await BlogUser.findById({ _id: id })
        .select("-password -refreshToken")
        .lean();
      console.log(userExistance);

      if (!userExistance) {
        return NextResponse.json({
          status: 400,
          message: "You did not Logged In",
        });
      }

      return NextResponse.json({
        status: 200,
        message: "got user data",
        data: userExistance,
      });
    } catch (error) {
      console.log("Error in Header Cookies", error);
      return NextResponse.json({
        status: 400,
        message: "Something Went Wrong",
      });
    }
  } else if (id && single === "yes") {
    const cookiesObject = await cookies();
    let value = undefined;

    if (cookiesObject.get("userId")?.value) {
      value = new mongoose.Types.ObjectId(cookiesObject.get("userId")?.value);

      console.log("currentUser UserId:- ", value);
    }

    let currentUser = undefined;
    if (value) {
      console.log("Got Your bro");
      console.log("currentUser UserId:- ", value);
      currentUser = value;
    }

    console.log("CurrentUser Blog:- ", currentUser);
    
    try {
      const singArticle = await ArticleModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $addFields: {
            likes: { $size: "$likes" },
            dislikes: { $size: "$dislikes" },
            isLiked: {
              $cond: {
                if: { $eq: [currentUser, undefined] },
                then: false,
                else: { $in: [currentUser, "$likes"] },
              },
            },
            isDisLiked: {
              $cond: {
                if: { $eq: [currentUser, undefined] },
                then: false,
                else: { $in: [currentUser, "$dislikes"] },
              },
            },
          },
        },
        {
          $lookup: {
            from: "blogusers",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [
              {
                $addFields:{
                  isFollowed:{
                    $cond:{
                      if:{$eq:[currentUser,undefined]},
                      then:false,
                      else:{$in:[currentUser,"$followers"]}
                    }
                  }
                }
              },
              {
                $project: {
                  password: 0,
                },
              },
            ],
          },
        },
        {
          $unwind: "$createdBy",
        },
      ]);
      // console.log("Single article:- ",singArticle);
      return NextResponse.json(singArticle, { status: 200 });
    } catch (error) {
      console.error("Error fetching articles:", error);
      return NextResponse.json(
        { error: "Failed to fetch articles" },
        { status: 500 }
      );
    }
  } else if (id === "logout") {
    try {
      console.log("Yes Logging Out");
// this is for the accessToken logged out
      const cookiesObject = await cookies();
      cookiesObject.set("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

// this is for the userId logged out
      cookiesObject.set("userId", "", { // Clear the userId cookie
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });

      return NextResponse.json({ status: 200, message: "Logout Successfully" });
    } catch (error) {
      console.log("Error",error)
      return NextResponse.json({
        status: 500,
        message: "Something Went Wrong in Logout Proccessing",
      });
    }
  } else if (id === "homePage") {
    // for getting value of all data
    console.log("Got Your bro");

    try {
      const articles = await ArticleModel.aggregate([
        {
          $facet: {
            trending: [
              {
                $sort: {
                  createdAt: -1,
                },
              },
              {
                $limit: 5,
              },
              {
                $addFields: {
                  likes: { $size: "$likes" },
                  dislikes: { $size: "$dislikes" },
                },
              },
              {
                $lookup: {
                  from: "blogusers",
                  localField: "createdBy",
                  foreignField: "_id",
                  as: "createdBy",
                  pipeline: [
                    {
                      $project: {
                        password: 0,
                        createdAt: 0,
                        updatedAt: 0,
                      },
                    },
                  ],
                },
              },
              {
                $unwind: "$createdBy",
              },
            ],
            articles: [
              {
                $sort: {
                  createdBy: -1,
                },
              },
              {
                $group: {
                  _id: "$category",
                  articles: {
                    $push: "$$ROOT",
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  articles: { $slice: ["$articles", 5] },
                },
              },
              {
                $unwind: "$articles",
              },
              {
                $replaceRoot: {
                  newRoot: "$articles",
                },
              },
              {
                $addFields: {
                  likes: { $size: "$likes" },
                  dislikes: { $size: "$dislikes" },
                },
              },
              {
                $lookup: {
                  from: "blogusers",
                  localField: "createdBy",
                  foreignField: "_id",
                  as: "createdBy",
                  pipeline: [
                    {
                      $project: {
                        password: 0,
                        createdBY: 0,
                      },
                    },
                  ],
                },
              },
              {
                $unwind: "$createdBy",
              },
            ],
          },
        },
      ]);

      // console.log("Fetched Articles:", articles);
      return NextResponse.json(articles, { status: 200 });
    } catch (error) {
      console.error("Error fetching articles:", error);
      return NextResponse.json(
        { error: "Failed to fetch articles" },
        { status: 500 }
      );
    }
  } else if (id === "likes") {
    try {
      const cookiesObject = await cookies();
      // const userId =  cookiesObject.get("userId")?.value
      const userId = new mongoose.Types.ObjectId(
        cookiesObject.get("userId")?.value
      );

      console.log("Likes currentUser", userId);

      const { searchParams } = new URL(req.url);
      const articleId = searchParams.get("articleId");
      const articleFinded = await ArticleModel.findOne({ _id: articleId });

      if (articleFinded) {
        if (articleFinded.likes.includes(userId)) {
          const Likesremoved = await ArticleModel.updateOne(
            { _id: articleId },
            { $pull: { likes: userId } },
            { new: true }
          );

          console.log("Likes Removed", Likesremoved);
          // Fetch the document again to confirm the changes
          const articleFindedi = await ArticleModel.findOne({ _id: articleId });
          console.log("Updated Article:", articleFindedi.likes);
          
        } else {
          await ArticleModel.updateOne(
            { _id: articleId },
            { $push: { likes: userId } },
            { new: true }
          );

          const articleFindedA = await ArticleModel.findOne({ _id: articleId });

          console.log("Likes added", articleFindedA.likes);
        }
      }
      console.log("Article Found", articleFinded.likes);

      return NextResponse.json({
        status: 200,
        message: "Successfully Done Likes",
      });
    } catch (error) {
      console.log("Error",error);
      
      return NextResponse.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  } else if (id === "dislikes") {
    try {
      const cookiesObject = await cookies();
      // const userId =  cookiesObject.get("userId")?.value
      const userId = new mongoose.Types.ObjectId(
        cookiesObject.get("userId")?.value
      );

      console.log("DisLikes currentUser", userId);

      const { searchParams } = new URL(req.url);
      const articleId = searchParams.get("articleId");
      const articleFinded = await ArticleModel.findOne({ _id: articleId });

      if (articleFinded) {
        if (articleFinded.dislikes.includes(userId)) {
          const Likesremoved = await ArticleModel.updateOne(
            { _id: articleId },
            { $pull: { dislikes: userId } },
            { new: true }
          );

          console.log("DisLikes Removed", Likesremoved);
          // Fetch the document again to confirm the changes
          const articleFindedi = await ArticleModel.findOne({ _id: articleId });
          console.log("Updated Article:", articleFindedi.dislikes);
          
        } else {
           await ArticleModel.updateOne(
            { _id: articleId },
            { $push: { dislikes: userId } },
            { new: true }
          );

          const articleFindedA = await ArticleModel.findOne({ _id: articleId });

          console.log("DisLikes added", articleFindedA.dislikes);
        }
      }
      console.log("Article Found", articleFinded.dislikes);

      return NextResponse.json({
        status: 200,
        message: "Successfully Done DisLikes",
      });
    } catch (error) {
      console.log("Error ", error);
      
      return NextResponse.json({
        status: 500,
        message: "Something Went Wrong",
      });
    }
  } else if(id === "follow"){
    try {
      const cookiesObject = await cookies();
      const userId = new mongoose.Types.ObjectId(
        cookiesObject.get("userId")?.value
      );
      const { searchParams } = new URL(req.url);
      const creatorId = searchParams.get("creatorId");
      const creatorFinded = await BlogUser.findOne({ _id: creatorId }).select("-password -refreshToken");

      console.log("Follow currentUser:- ", creatorFinded.followers,"userId:- ",userId);
      

      if (creatorFinded) {
        if (creatorFinded.followers.includes(userId)) {
          const Likesremoved = await BlogUser.updateOne(
            { _id: creatorId },
            { $pull: { followers: userId } },
            { new: true }
          );

          console.log("Follow Removed", Likesremoved);
          // Fetch the document again to confirm the changes
          const creatorFindedi = await BlogUser.findOne({ _id: creatorId });
          console.log("Updated Article:", creatorFindedi.followers);
          
        } else {
          await BlogUser.updateOne(
            { _id: creatorId },
            { $push: { followers: userId } },
            { new: true }
          );

          const creatorFindedA = await BlogUser.findOne({ _id: creatorId });

          console.log("Follow added", creatorFindedA.followers);
        }
      }
      console.log("Creator Found", creatorFinded.followers);

      return NextResponse.json({
        status: 200,
        message: "Successfully Done Follow",
      });
    } catch (error) {
      console.log("Error",error);
  
      return NextResponse.json({
        status: 500,
        message: "Something Went Wrong",
        error:error
      });
    }
  }
}









































// this is the code for getting the 5 most recent data from the database
// [
//   {
//     $match: {
//       category: { $in: ["wwe", "cricket"] },
//     },
//   },
//   {
//     $sort: {
//       createdAt: 1
//     }
//   },
//   {
//     $group: {
//       _id: "$category",
//       articles: {
//         $push: "$$ROOT",
//       },
//     },
//   },
//   {
//     $project: {
//       _id: 0,
//       articles: { $slice: ["$articles", 5] },
//     },
//   },
//   {
//     $unwind: "$articles",
//   },
//   {
//     $replaceRoot: {
//       newRoot: "$articles",
//     },
//   },
//   {
//     $sort: {
//       createdAt: -1,
//     },
//   },
//   {
//     $addFields: {
//       dislikes: { $size: "$dislikes" },
//       likes: { $size: "$likes" },
//     },
//   },
//   {
//     $lookup: {
//       from: "blogusers",
//       localField: "createdBy",
//       foreignField: "_id",
//       as: "createdBy",
//       pipeline: [
//         {
//           $project: {
//             _id: 0,
//             password: 0,
//             createdAt: 0,
//             updatedAt: 0,
//           },
//         },
//       ],
//     },
//   },
//   {
//     $unwind: "$createdBy",
//   },
// ]

// [
//   {
//     $facet: {
//       trending: [
//         {
//           $sort:{
//             "updatedAt": -1
//           }
//         },
//         {
//           $limit:5
//         },
//         {
//           $addFields: {
//             likes: { $size: "$likes" },
//             dislikes: { $size: "$dislikes" }
//           }
//         },
//         {
//           $lookup: {
//             from: "blogusers",
//             localField: "createdBy",
//             foreignField: "_id",
//             as: "createdBy",
//             pipeline: [
//               {
//                 $project: {
//                   "password": 0,
//                   "createdAt": 0,
//                   "updatedAt": 0
//                 }
//               }
//             ]
//           }
//         },
//         {
//           $unwind: "$createdBy"
//         },
//       ],
//       articles:[
//         {
//           $sort: {
//             updatedAt: -1
//           }
//         },
//         {
//           $group: {
//             _id: "$category",
//             articles: {
//               $push: "$$ROOT"
//             }
//           }
//         },
//         {
//           $project: {
//             _id: 0,
//             articles: { $slice: ["$articles", 5] }
//           }
//         },
//         {
//           $unwind: "$articles"
//         },
//         {
//           $replaceRoot: {
//             newRoot: "$articles"
//           }
//         },
//         {
//           $addFields:{
// 						likes: { $size: "$likes" },
//             dislikes: { $size: "$dislikes" }
//           }
//         },
//         {
//           $lookup: {
//             from: "blogusers",
//             localField: "createdBy",
//             foreignField: "_id",
//             as: "createdBy",
//             pipeline: [
//               {
//                 $project: {
//                   "password": 0,
//                   "createdBY": 0
//                 }
//               }
//             ]
//           }
//         },
//         {
//           $unwind: "$createdBy"
//         }
//       ]
//     }
//   }
// ]

// getting 5 most recent data from database
// [
//   {
//     $sort: {
//       "updatedAt": -1
//     }
//   },
//   {
//     $limit: 5
//   },
//   {
//     $addFields: {
//       likes: {$size:"$likes"},
//       dislikes:{$size:"$dislikes"}
//     }
//   },
//   {
//     $lookup: {
//       from: "blogusers",
//       localField: "createdBy",
//       foreignField: "_id",
//       as: "createdBy",
//       pipeline:[
//         {
//           $project:{
//             password:0,
//             createdAt:0,
//             updatedAt:0
//           }
//         }
//       ]
//     }
//   },
//   {
//     $unwind: "$createdBy"
//   },
//   {
//     $group: {
//       _id: "trending",
//       trending: {
//         $push: "$$ROOT"
//       }
//     }
//   }
// ]

// export async function GET(req: NextRequest) {
//   const {searchParams} = new URL(req.url);
//   const id = searchParams.get("id")
//   console.log("hey this is ",id);

//   if (id) {
//     console.log("Got Your bro");

//   }

//     try {
//         await connectToDatabase();
//         const articles = await ArticleModel.aggregate([
//           {
//             $match: {
//               category:{$in:["wwe","cricket"]}
//             }
//           },
//           {
//             $group: {
//               _id: "$category",
//               articles: {
//                 $push: "$$ROOT"
//               }
//             }
//           },
//           {
//             $project: {
//               _id:0,
//               articles:{$slice:["$articles",5]}
//             }
//           },
//           {
//             $unwind: "$articles"
//           },
//           {
//             $replaceRoot: {
//               newRoot: "$articles"
//             }
//           },
//           {
//             $sort: {
//               createdAt: 1
//             }
//           },
//           {
//             $addFields: {
//               dislikes: {$size:"$dislikes"},
//               likes:{$size:"$likes"}
//             }
//           },
//   				{
//             $lookup: {
//     				from: "blogusers",
//     				localField: "createdBy",
//     				foreignField: "_id",
//     				as: "createdBy",
//             pipeline:[
//               {
//                 $project:{
//                   _id:0,
//                   password:0,
//                   createdAt:0,
//                   updatedAt:0

//                 }
//               }
//             ]
//   					}
//           },
//   				{
//             $unwind:"$createdBy"
//           }
//           ])

//         console.log("Fetched Articles:", articles.length);
//         return NextResponse.json(articles, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching articles:", error);
//         return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
//     }
// }

/*
find methods on the ArticleModel extract all article in plain javascript means there will not be any methods will be applyed of mongoose because of lean() methods
--const articles = await ArticleModel.find().lean()

if i want to sort and catergory and limit to apply
-- const articles = await ArticleModel.find({category:"cricket"}).sort({createdAt: -1}).limit(5).lean();

if i want to get wwe and cricket with the help of find then i can use
---const wweArticles = await ArticleModel.find({ category: 'wwe' })
  .sort({ createdAt: -1 }) // Sort by latest articles if needed
  .limit(5)
  .lean();

const cricketArticles = await ArticleModel.find({ category: 'cricket' })
  .sort({ createdAt: -1 })
  .limit(5)
  .lean();

// Combine the two results
const articles = [...wweArticles, ...cricketArticles];

console.log(articles);

if you want to query with find and with two condition then you can use following but it will give only match till five , it does,nt give each of five article

--const articles = await ArticleModel.find({category:{$in:["cricket","wwe"]}}).sort({createdAt: -1}).limit(5).lean();


if i use following code, ther is not need of lean because it directly talk to the mongodb and give a plain object
--const articles = await ArticleModel.aggregate([
            {$match:{category:{$in:['wwe','cricket']}}}, // Filter by categories
            {$sort :{createdAt: -1}}, // Sort by date
            { $group: { _id: '$category', articles: { $push: '$$ROOT' } } }, // Group by category
            { $project: { articles: { $slice: ['$articles', 5] } } } // Limit to 5 articles per category

        ])


[
  {
    "_id": "wwe",
    "articles": [ 5 WWE articles  ]
},
{
  "_id": "cricket",
  "articles": [ 5 Cricket articles ]
}
]


*/

// [
//   {$match: {
//     category:{$in:["cricket","wwe"]}
//    }
//   },
//   {$group: {
//     _id: "$category",
//     articles:{$push:"$$ROOT"},
//    }
//   },
//   {
//     $project: {
//       _id:0,
// $slice divide array to the 5 array
//       articles:{$slice:["$articles",5]},
//     }
//   },
// $unwind stage is used for destructuring a array in different ducument
//   {
//     $unwind:  "$articles"
//   },
// it is used for replacing key holding object
//   {$replaceRoot: {
//     newRoot: "$articles"
//   }},
// {
//   $sort: {
//     createdAt: 1
//   }
// },
// {
//   $addFields: {
//     dislikes: {$size:"$dislikes"},
//     likes:{$size:"$likes"}
//   }
// }
// ]

// why some pipeline stages keys are taking object structure and some taking array , can you give me reason behind it: [ {$match: { category:{$in:["wwe","cricket"]} } } ]
// Sure! Let's break down the concept of pipeline stages in MongoDB and why some keys take an object structure while others take an array. I'll explain this in a simple way, as if you're new to this.

// What is a Pipeline in MongoDB?
// A pipeline in MongoDB is like a series of steps you follow to process data. It's similar to a water pipeline where water passes through different stages, and each stage does something to the water. In MongoDB, instead of water, we're processing data, and the stages are instructions on how to process that data.

// MongoDB Aggregation Pipeline
// Each stage in the aggregation pipeline is represented as a document (what we call an object in JavaScript or a dictionary in Python). For example:

// [
//   { $match: { category: { $in: ["wwe", "cricket"] } } }
// ]
// Here, { $match: { category: { $in: ["wwe", "cricket"] } } } is a stage where $match is the operation, and { category: { $in: ["wwe", "cricket"] } } is the criteria for matching documents.

// Why Use Object Structure?
// Clarity and Structure: Objects (or documents) are used because they clearly define the operation and its criteria. It's easy to see what the stage is doing.
// Complex Criteria: Objects can contain complex nested structures, which is useful for defining detailed criteria.
// Why Use Array Structure?
// You might think, "Okay, then why do some stages use arrays?" To answer this, we need to look at specific stages.

// $project Stage
// The $project stage is used to include or exclude specific fields from the output. Sometimes, you might use an array to specify fields you want to include or exclude:

// [
//   { $project: ["_id", "name", "age"] }
// ]
// However, more commonly, $project uses an object structure:

// [
//   { $project: { name: 1, age: 1, _id: 0 } }
// ]
// In this case:

// 1 means include the field.
// 0 means exclude the field.
// _id: 0 is used to exclude the default _id field.
// $match Stage
// The $match stage is used to filter documents, and it

// continue
// Absolutely, let's continue with the explanation of the $match stage and why different stages use different structures.

// $match Stage
// The $match stage is used to filter documents in your MongoDB collection. It works similarly to a WHERE clause in SQL. The criteria for the $match stage are always specified using an object structure because it needs to define complex conditions.

// For example:

// [
//   { $match: { category: { $in: ["wwe", "cricket"] } } }
// ]
// Here:

// $match is the stage operation.
// { category: { $in: ["wwe", "cricket"] } } is the condition or criteria.
// The criteria is an object because it needs to specify the field (category) and the condition ($in operator with an array of values).
// Why Different Structures for Different Stages?
// Clarity and Flexibility:

// Objects (Documents): Most stages use objects because they provide a clear and flexible way to specify criteria and operations. Objects can contain nested structures, which means you can define complex operations and conditions easily.
// Arrays: Some stages, like $project, use arrays when you just need to list a set of fields without additional conditions. It's more concise for simple inclusion/exclusion of fields.
// Specific Stage Requirements:

// $project: Can use either an object or an array, but objects provide more flexibility for including/excluding fields, computed fields, etc.
// $group: Uses an object to specify the grouping criteria and aggregation expressions.
// $sort: Uses an object where keys are the fields to sort by, and values specify the sort order (1 for ascending, -1 for descending).
// $lookup (a more advanced stage): Uses an object to specify the join conditions and fields.
// Simple Example of Different Structures
// Let's look at a few more examples:

// $project Stage Using Array
// [
//   { $project: ["name", "age"] }
// ]
// This includes only the name and age fields in the output.

// $project Stage Using Object
// [
//   { $project: { name: 1, age: 1, _id: 0, fullName: { $concat:
// what is the work of $group in mongodb
// Great question! Let's dive into the $group stage in MongoDB and understand its purpose and how it works.

// What is the $group Stage in MongoDB?
// The $group stage in MongoDB is used to aggregate documents based on a specified grouping expression. It's akin to the GROUP BY clause in SQL. The result of the $group stage is a new set of documents, where each document represents a group of documents from the input collection.

// Key Components of $group
// The $group stage uses an object structure, and it has a few key components:

// _id Field: This is required and specifies the grouping criteria. It's like the GROUP BY clause in SQL. The value of _id can be a single field, a combination of fields, or an expression.

// Accumulator Expressions: These are used to perform calculations or operations on the documents in each group. Accumulators are fields in the $group stage that use MongoDB aggregation expressions to compute values. Common accumulators include $sum, $avg, $max, $min, and $count.

// Basic Syntax of $group
// Here’s the basic syntax for the $group stage:

// {
//   $group: {
//     _id: <grouping expression>, // Required
//     <output field>: { <accumulator expression> }, // Optional
//     <output field>: { <accumulator expression> }, // Optional
//     ...
//   }
// }
// Examples to Illustrate $group
// Let’s look at some examples to understand how $group works.

// Example 1: Simple Grouping
// Suppose you have a collection of products, and you want to group them by their category and find the total number of products in each category.

// db.products.aggregate([
//   {
//     $group: {
//       _id: "$category", // Group by the 'category' field
//       count: { $sum: 1 } // Count the number of products in each group
//     }
//   }
// ])
// Explanation:

// _id: "$category": Groups documents by the category field.
// count: { $sum: 1 }: For each group, adds up 1 for each document, effectively counting the number of products in each category.
// Example 2: Grouping and Calculating Totals
// can you explain the code , [ {$match: { category:{$in:["wwe","cricket"]} } }, { $group: { _id: "$category", articles: { $push:"$$ROOT" } } } ]
// Sure, let's break down the MongoDB aggregation pipeline you provided step by step. This pipeline consists of two stages: $match and $group. I'll explain each stage in detail to help you understand how the data is processed.

// The Provided Pipeline
// [
//   {
//     $match: {
//       category: { $in: ["wwe", "cricket"] }
//     }
//   },
//   {
//     $group: {
//       _id: "$category",
//       articles: { $push: "$$ROOT" }
//     }
//   }
// ]
// Stage 1: $match
// The $match stage filters the documents that pass through the pipeline based on a specified condition. In this case, the condition is to include only those documents where the category field is either "wwe" or "cricket".

// Code Explanation:

// {
//   $match: {
//     category: { $in: ["wwe", "cricket"] }
//   }
// }
// $match: This is the stage operation that filters documents.
// category: { $in: ["wwe", "cricket"] }: This is the condition for matching documents. The $in operator checks if the category field of a document is one of the values in the array ["wwe", "cricket"].
// Example: If your collection has these documents:

// [
//   { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//   { "_id": 2, "category": "cricket", "title": "Cricket Match Update" },
//   { "_id": 3, "category": "soccer", "title": "Soccer News" },
//   { "_id": 4, "category": "wwe", "title": "WWE News" }
// ]
// After the $match stage, only the following documents will pass through:

// [
//   { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//   { "_id": 2, "category": "cricket", "title": "Cricket Match Update" },
//   { "_id": 4, "category": "wwe", "title": "WWE News" }
// ]
// Stage 2
// continue where left off
// Sure, let's continue with the explanation of the second stage in the pipeline:

// Stage 2: $group
// The $group stage aggregates the documents based on a specified grouping expression. In this case, it groups the documents by the category field and creates an array of articles (original documents) for each category.

// Code Explanation:

// {
//   $group: {
//     _id: "$category",
//     articles: { $push: "$$ROOT" }
//   }
// }
// $group: This is the stage operation that aggregates documents.
// _id: "$category": This is the grouping expression. It groups the documents by the category field. The _id field in the output group document will be the value of the category field.
// articles: { $push: "$$ROOT" }: This is an accumulator expression. The $push operator adds the entire document ($$ROOT refers to the current document from the previous stage) to an array named articles for each group.
// Example: Detailed Breakdown
// Let's start with the filtered documents from the $match stage:

// [
//   { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//   { "_id": 2, "category": "cricket", "title": "Cricket Match Update" },
//   { "_id": 4, "category": "wwe", "title": "WWE News" }
// ]
// Grouping by category:
// Group 1: category is "wwe"

// Documents :
// { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
// { "_id": 4, "category": "wwe", "title": "WWE News" }
// Group 2: category is "cricket"

// Documents :
// { "_id": 2, "category": "cricket", "title": "Cricket Match Update" }
// Applying $group Stage:
// For each group, MongoDB will create a new document with:

// _id set to the category value.
// articles set to an array containing all theSure, let's continue with the detailed application of the $group stage.
// Applying the $group Stage
// For each group, MongoDB will create a new document with:

// _id: Set to the category value.
// articles: Set to an array containing all the documents in that group.
// Let's look at how the $group stage processes the filtered documents:

// Group 1: category is "wwe"
// Documents in this group:

// { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
// { "_id": 4, "category": "wwe", "title": "WWE News" }
// Resulting group document:

// {
//   "_id": "wwe",
//   "articles": [
//     { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//     { "_id": 4, "category": "wwe", "title": "WWE News" }
//   ]
// }
// Group 2: category is "cricket"
// Documents in this group:

// { "_id": 2, "category": "cricket", "title": "Cricket Match Update" }
// Resulting group document:

// {
//   "_id": "cricket",
//   "articles": [
//     { "_id": 2, "category": "cricket", "title": "Cricket Match Update" }
//   ]
// }
// Final Output of the Pipeline
// After the $group stage, the pipeline will output the following documents:

// [
//   {
//     "_id": "wwe",
//     "articles": [
//       { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//       { "_id": 4, "category": "wwe", "title": "WWE News" }
//     ]
//   },
//   {
//     "_id": "cricket",
//     "articles": [
//       { "_id": 2, "category": "cricket", "title": "Cricket Match Update" }
//     ]
//   }
// ]
// Summary
// **
// continue
// Sure, let's summarize what the entire pipeline does and how the data is transformed at each stage.

// Summary of the Pipeline
// Initial Collection of Documents:

// Suppose you have a collection named articles with the following documents:

// [
//   { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//   { "_id": 2, "category": "cricket", "title": "Cricket Match Update" },
//   { "_id": 3, "category": "soccer", "title": "Soccer News" },
//   { "_id": 4, "category": "wwe", "title": "WWE News" }
// ]
// Stage 1: $match

// The $match stage filters the documents to include only those where the category field is either "wwe" or "cricket".

// {
//   $match: {
//     category: { $in: ["wwe", "cricket"] }
//   }
// }
// After the $match stage, the documents are filtered to:

// [
//   { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//   { "_id": 2, "category": "cricket", "title": "Cricket Match Update" },
//   { "_id": 4, "category": "wwe", "title": "WWE News" }
// ]
// Stage 2: $group

// The $group stage then groups these filtered documents by the category field. For each unique category, it creates a new document. The articles field in each group document is an array of the original documents that belong to that category.

// {
//   $group: {
//     _id: "$category",
//     articles: { $push: "$$ROOT" }
//   }
// }
// Here's how the grouping is done:

// Group 1: category is "wwe"
// Documents in this group:
// { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
// { "_id":Sure, let's continue with the grouping for the `"wwe"` category and then finish with the `"cricket"` category to see the complete output.

// Group 1: category is "wwe"
// Documents in this group:

// [
//   { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//   { "_id": 4, "category": "wwe", "title": "WWE News" }
// ]
// Resulting group document:

// {
//   "_id": "wwe",
//   "articles": [
//     { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//     { "_id": 4, "category": "wwe", "title": "WWE News" }
//   ]
// }
// Group 2: category is "cricket"
// Documents in this group:

// [
//   { "_id": 2, "category": "cricket", "title": "Cricket Match Update" }
// ]
// Resulting group document:

// {
//   "_id": "cricket",
//   "articles": [
//     { "_id": 2, "category": "cricket", "title": "Cricket Match Update" }
//   ]
// }
// Final Output of the Pipeline
// After processing all documents through the $match and $group stages, the final output of the pipeline is:

// [
//   {
//     "_id": "wwe",
//     "articles": [
//       { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//       { "_id": 4, "category": "wwe", "title": "WWE News" }
//     ]
//   },
//   {
//     "_id": "cricket",
//     "articles": [
//       { "_id": 2, "category": "cricket", "title": "Cricket Match Update" }
//     ]
//   }
// ]
// Summary of the Pipeline
// Initial Collection:
// [
//   { "_id": 1, "category": "wwe", "title": "WWE
// what is "$$ROOT" how it work
// Great question! Let's dive into what $$ROOT is and how it works in MongoDB aggregation.

// Understanding $$ROOT
// In MongoDB's aggregation framework, $$ROOT is a system variable. It represents the entire document as it exists in the current stage of the aggregation pipeline. When you use $$ROOT, you're essentially telling MongoDB to refer to the whole document being processed, rather than just a specific field within the document.

// How $$ROOT Works
// Entire Document: Instead of referencing a single field, $$ROOT gives you access to the whole document.
// Usage: It is often used in stages like $group, $push, $addFields, and others where you might want to preserve the entire document in an output field or perform operations on the entire document.
// Example Usage of $$ROOT
// Let's use the example you provided to understand how $$ROOT works in the context of the $group stage.

// Example Pipeline with $$ROOT
// [
//   {
//     $match: {
//       category: { $in: ["wwe", "cricket"] }
//     }
//   },
//   {
//     $group: {
//       _id: "$category",
//       articles: { $push: "$$ROOT" }
//     }
//   }
// ]
// Stage 1: $match
// The $match stage filters the documents to include only those where the category field is either "wwe" or "cricket".

// After the $match stage, the documents look like this:

// [
//   { "_id": 1, "category": "wwe", "title": "WWE Match Report" },
//   { "_id": 2, "category": "cricket", "title": "Cricket Match Update" },
//   { "_id": 4, "category": "wwe", "title": "WWE News" }
// ]
// Stage 2: $group
// The $group stage groups these filtered documents by the category field. For each unique category, it creates a new document. The articles field in each group document is an array of the entire documents that belong to that category.

// Key Part: articles: { $push: "$$ROOT" }

// _id: "$category": Groups the documents by the category field
