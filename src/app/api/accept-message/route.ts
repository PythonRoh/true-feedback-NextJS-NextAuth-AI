import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"; // needed for getServerSession
import { User } from "next-auth";

// getServerSession
// why this ? 
// to get the session on the server side
// we configured the session to store the user id in the session

// this function is to update the user isAcceptingMessages field
export async function POST(request: Request) {
    // to allow or disallow other users to send messages to them

    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true } // to return the updated document
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages"
                },
                {
                    status: 401
                }
            )

        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages: ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {
                status: 500
            }
        )
    }

}

// this function is to get the user isAcceptingMessages field
export async function GET(request: Request) {
    // to know if the user is accepting messages or not
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Failed to get user Message acceptance status: ", error);
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            {
                status: 500
            }
        )
    }
}