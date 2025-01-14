import { connectToDatabase } from "@/lib/mongodb";
import { BlogUser } from "@/model/user_model";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";


interface ErrorMongoDbProps {
    errorResponse: {
        index: 0,
        code: 11000,
        errmsg: 'E11000 duplicate key error collection: blog.blogusers index: username_1 dup key: { username: "chandanyadav" }',
        keyPattern: { username: 1 },
        keyValue: { username: 'chandanyadav' }
    }
}

export interface LoginProps {
    fullname: string;
    email: string;
    password: string;
    username: string;
    _id: string;
}

const Access_Refresh_Token = async (id: string): Promise<{ refreshToken: string }> => {
    const refreshToken = jwt.sign({ id }, process.env.NEXT_PUBLIC_JWT_SECRET as string, { expiresIn: "7d" });
    console.log("Refresh Token:-", refreshToken);
    await BlogUser.findByIdAndUpdate({ _id: id }, { refreshToken });
    return { refreshToken };
}

export async function POST(req: NextRequest) {
    // const data = req.url;
    const { searchParams } = new URL(req.url);
    const newParam = searchParams.get("new");

    console.log("data:-", searchParams.get("new"));

    await connectToDatabase();

    if (newParam === "newAccount") {
        try {

            const { username, fullname, email, password } = await req.json();

            console.log(username, fullname, email, password);

            // console.log("db connection log", dbConnection);

            const newUser = new BlogUser({
                username,
                fullname,
                email,
                password
            });
            await newUser.save();

            console.log("new User", newUser);

            return NextResponse.json({ status: 200, data: "Successfully created your account" });
        } catch (error) {
            const errorProps = error as ErrorMongoDbProps
            console.log("Error in ", errorProps.errorResponse);

            return NextResponse.json({ status: 500, message: errorProps.errorResponse })
        }
    } else {
        const { email, password } = await req.json();
        console.log(email, password);

        const dbResponse = await BlogUser.findOne({ email }).lean() as LoginProps | null;

        if (!dbResponse) {
            return NextResponse.json({ status: 404, message: `User not found with Email Id` });
        }

        if (dbResponse as LoginProps) {
            const passwordCheaking = await bcrypt.compare(password, dbResponse.password);
            console.log("", passwordCheaking);
            if (!passwordCheaking) {
                return NextResponse.json({ status: 404, message: `User Password Incorrect` });
            } else if (passwordCheaking === true) {
                const { email, fullname, _id, username } = dbResponse;

                // access and refresh tokenn generate
                const { refreshToken } = await Access_Refresh_Token(_id);

                console.log(refreshToken);

                // Set the refresh token as a secure HTTP-only cookie

                const cookieStore = await cookies();
                cookieStore.set("accessToken", refreshToken, { 
                    httpOnly: true, 
                    secure: true, 
                    sameSite: "strict", 
                    path: "/" 
                });

                return NextResponse.json({ status: 200, message: `User Logged in Successfully`, data: { email, fullname, _id, username } });

            }

        }
    }
}


/*
if you want to use bcrypt in the backend then you can not use the following code because it bypasses the bcrypt hashing
 const newUser = await BlogUser.create({
                    username,
                    fullname,
                    email,
                    password
                });
        
                console.log("new User",newUser);
*/