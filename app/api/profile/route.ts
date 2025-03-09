import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "@/model/blog_model";
import { BlogUser } from "@/model/user_model";
import mongoose from "mongoose";


export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const profileName = url.searchParams.get("profileName");

        if (!profileName) {
            return NextResponse.json({ message: "profileName missing", status: 200 });
        }

        let cookiesObject = req.cookies.get("userId") ;

        let ExistingUser=cookiesObject?.value??"";

        console.log("Value:- ", ExistingUser);
        // ExistingUser = "6755455603bf36a0b4db1726"

        // Database connection, to know there is connection established to the mongodb
        await connectToDatabase();
        const userExisting = await BlogUser.aggregate([
          {
            $match: {
              username:profileName
            }
          },
          {
            $lookup: {
              from: "articlemodels",
              localField: "_id",
              foreignField: "createdBy",
              as: "result",
              pipeline:[
                {
                  $sort:{createdAt:-1}
                },
                {
                  $group:{
                    _id:"$category",
                    articles:{
                      $push:"$$ROOT"
                    }
                  }
                },
                {
                  $addFields:{
                    articles:{
                      $slice:["$articles",5]
                    }
                  }
                },
                {
                  $unwind:"$articles"
                },
                {
                  $replaceRoot:{
                    newRoot:"$articles"
                  }
                },
                {
                  $addFields:{
                    likes:{
                      $size:"$likes"
                    },
                    dislikes:{
                      $size:"$dislikes"
                    }
                  }
                },
                {
                  $project:{
                    content:0,
                    createdBy:0,
                    __v:0
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              followerCount: {
                $size:"$followers"
              },
              isFollowing:{
                $in:[
                  {$convert:{input:ExistingUser,to:"objectId",onError:null}},
                  "$followers"
                ]
              },
              ownerChannel:{
                $eq:[
                  "$_id",
                  {$convert:{input:ExistingUser,to:"objectId",onError:null}}
                ]
              }
            }
          },
          {
            $project: {
              refreshToken:0,
              password:0,
              followers:0
            }
          }
        ])
        // console.log(userExisting[0]);


        return NextResponse.json({ message: "Successfully Fetched Data", status: 200,data: userExisting[0]??{}});
    } catch (error) {
      console.log(error);
      
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}








/**
 * 
 * [
  {
    $match: {
      username:"chandanyadav"
    }
  },
  {
    $lookup: {
      from: "articlemodels",
      localField: "_id",
      foreignField: "createdBy",
      as: "result",
      pipeline:[
        {
          $sort:{
            createdAt:-1
          }
        },
        {
          $group:{
            _id:"$category",
            articles:{
              $push:"$$ROOT"
            }
          }
        },
        {
          $project:{
            articles:{
              $slice:["$articles",5]
            }
          }
        },
        {
          $unwind:"$articles"
        },
        {
          $replaceRoot:{
            newRoot:"$articles"
          }
        },
        {
          $addFields:{
            likes:{
              $size:"$likes"
            },
            dislikes:{
              $size:"$dislikes"
            }
          }
        },
        {
          $project:{
            content:0,
      			createdBy:0
          }
        }
      ]
    }
  },
  {
    $addFields: {
      followerCount: {
        $size:"$followers"
      },
      ownerChannel:{
        $eq:[
          "$_id",
          {$convert:{input:"6755455603bf36a0b4db1726",to:"objectId",onError:null}}
        ]
      },
      isYouFollowed:{
        $in:[
          {$convert:{input:"6755455603bf36a0b4db1726",to:"objectId",onError:null}},
          "$followers"
        ]
      }
    }
  },
  {
    $project: {
      refreshToken:0,
      password:0,
      followers:0,
      email:0
    }
  }
]
 */