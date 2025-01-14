import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  req: NextRequest 
) {
    console.log(req);
    
    const searchParams = req.nextUrl.searchParams;
    console.log("serachParams:-",searchParams);
    
    const id = searchParams.get("id");
  console.log("Slug:", id);

  return NextResponse.json({
    message: "Successfully got data",
    status: 200,
    data: { id },
  });
}




























// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest 
// ) {
//     const searchParams = req.nextUrl.searchParams;
//     console.log("serachParams:-",searchParams);
    
//     const id = searchParams.get("id");
//   console.log("Slug:", id);

//   return NextResponse.json({
//     message: "Successfully got data",
//     status: 200,
//     data: { id },
//   });
// }
