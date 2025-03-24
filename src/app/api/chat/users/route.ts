import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // For JWT token extraction
import connectToDB from "@/src/lib/connectToDB";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";

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
			if (token.id !== id) {
				return NextResponse.json({ error: "Unauthorized to access this user's data" }, { status: 403 });
			}

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
