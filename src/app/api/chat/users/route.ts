import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // For JWT token extraction
import connectToDB from "@/src/lib/connectToDB";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import Message from "@/src/models/messageModel"; // Add this import at the top
import redis from "@/src/lib/redisInstance";

const redisClient = await redis(); // Initialize the Redis client

export async function POST(req: NextRequest) {
	try {
		// Get the JWT token from the request
		const token = await getToken({ req, secret: process.env.JWT_SECRET });

		// If no token is found, return unauthorized
		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await connectToDB(); // Ensure DB connection

		const { id, email, password } = await req.json(); // Get POST data

		let user;

		// If an ID is provided, fetch the user by ID
		if (id) {
			// Check if the token ID matches the user ID to ensure the request is authorized
			// if (token.id !== id) {
			// 	return NextResponse.json({ error: "Unauthorized to access this user's data" }, { status: 403 });
			// }

			user = await User.findOne({ id }).select("-__v -password -_id").lean(); // Exclude Mongoose version key
		}
		// If email and password are provided, fetch the user by email and password
		else if (email && password) {
			const hashedPassword = await bcrypt.hash(password, 12);
			user = await User.findOne({ email, password: hashedPassword }).select("-__v");
		}

		// If no user is found
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	// Retrieve the userId and updated data from the request body
	const { userId, ...updatedData } = await req.json();

	// Validate if userId exists
	if (!userId) {
		return NextResponse.json({ message: "User ID is required" }, { status: 400 });
	}

	if(updatedData.password && updatedData.password.length > 0) {
		const hashedPassword = await bcrypt.hash(updatedData.password, 12);
		updatedData.password = hashedPassword;
	}

	if(updatedData.password == "") {
		delete updatedData.password;
	}

	delete updatedData.role;

	try {
		await connectToDB();

		// First get the current user to compare profile images
		const currentUser = await User.findOne({ id: userId });
		
		if (!currentUser) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		// Check if profile image has changed
		if (updatedData.profileImage && updatedData.profileImage !== currentUser.profileImage) {
			console.log("Updating profile image in messages...");

			// Update Redis messages
			const messageKeys = await redisClient.keys('chat:messages:*');
			for (const key of messageKeys) {
				const messages = await redisClient.lRange(key, 0, -1);
				const updatedMessages = messages.map(messageStr => {
					const message = JSON.parse(messageStr);
					if (message.authorId === userId) {
						return JSON.stringify({
							...message,
							authorImage: updatedData.profileImage
						});
					}
					return messageStr;
				});

				// Only update if there were changes
				if (updatedMessages.some((msg, idx) => msg !== messages[idx])) {
					await redisClient.del(key);
					if (updatedMessages.length > 0) {
						await redisClient.rPush(key, updatedMessages);
					}
				}
			}

			// Update MongoDB messages
			await Message.updateMany(
				{ authorId: userId },
				{ authorImage: updatedData.profileImage }
			);
		}

		// Update the user
		const updatedUser = await User.findOneAndUpdate(
			{ id: userId },
			updatedData,
			{ new: true } // Return the updated document
		);

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json({ message: "Failed to update user data", error }, { status: 500 });
	}
}