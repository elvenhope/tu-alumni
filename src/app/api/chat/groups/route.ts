import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import Group from "@/src/models/groupModel";

export async function GET(req: NextRequest) {
	try {
		// 🔹 Connect to MongoDB
		await connectToDB();

		// 🔹 Fetch groups where the user is a member
		const groups = await Group.find({}).populate("users", "id firstName lastName role profileImage");

		// 🔹 Return the groups
		return NextResponse.json({ groups });
	} catch (error) {
		console.error("Error fetching groups:", error);
		return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
	}
}