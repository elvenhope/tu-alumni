import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB"; // Adjust based on your structure
import Group from "@/src/models/groupModel"; // Adjust based on your model


export async function GET() {
	try {
		await connectToDB(); // Ensure the DB connection

		// Aggregation pipeline to get unique tags
		const result = await Group.aggregate([
			{ $unwind: "$tags" }, // Flatten the tags array
			{ $group: { _id: "$tags" } }, // Group by unique tag values
			{ $project: { _id: 0, tag: "$_id" } } // Reshape output
		]);

		const tags = result.map(item => item.tag); // Extract tag values

		return NextResponse.json({ tags }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
	}
}
