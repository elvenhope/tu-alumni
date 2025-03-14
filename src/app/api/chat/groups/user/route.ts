import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import Group from "@/src/models/groupModel";
import { getServerSession } from "next-auth";
import { config } from "@/src/lib/auth"; // Adjust based on your NextAuth setup
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
	try {
		// 🔹 Connect to MongoDB
		await connectToDB();

		// 🔹 Get authenticated user
		const session = await getServerSession(config);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const userId = session.user._id; // Get the user ID from the session

		// 🔹 Fetch groups where the user is a member
		const groups = await Group.find({ users: userId }).populate("users", "id firstName lastName role");

		// 🔹 Return the groups
		return NextResponse.json({ groups });
	} catch (error) {
		console.error("Error fetching groups:", error);
		return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	try {
		// 🔹 Connect to MongoDB
		await connectToDB();

		// 🔹 Get authenticated user session
		const session = await getServerSession(config);
		if (!session || !session.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// 🔹 Parse request body
		const { name, description, tags } = await req.json();
		if (!name || !description || !tags || !Array.isArray(tags)) {
			return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
		}

		// 🔹 Check if group already exists
		const existingGroup = await Group.findOne({ name });
		if (existingGroup) {
			return NextResponse.json({ error: "Group already exists" }, { status: 409 });
		}

		const newId = uuidv4();

		// 🔹 Convert user ID to ObjectId (needed for mongoose references)
		const userObjectId = session.user._id;

		console.log("User ID:", userObjectId);

		// 🔹 Create new group
		const newGroup = new Group({
			id: newId,
			name,
			description,
			tags,
			users: [userObjectId], // Add the creator as the first member
		});

		await newGroup.save();

		// 🔹 Return success response
		return NextResponse.json({ message: "Group created successfully", group: newGroup }, { status: 201 });
	} catch (error) {
		console.error("Error creating group:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
