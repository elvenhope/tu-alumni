import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import headingModel from "@/src/models/headingModel";
import { v4 as uuidv4 } from "uuid";

// Handle GET requests to fetch all headlines
export async function GET() {
	try {
		await connectToDB();
		const headers = await headingModel.find({});
		return NextResponse.json(headers, { status: 200 });
	} catch (error) {
		console.error("Error fetching headers:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle POST requests to create a new headline
export async function POST(req: Request) {
	try {
		await connectToDB();
		const body = await req.json();

		body.id = uuidv4();

		// Create a new headline
		const newHeadline = await headingModel.create({
			id: body.id,
			headline: body.headline,
			author: body.author,
			description: body.description
		});
		return NextResponse.json(newHeadline, { status: 201 });
	} catch (error) {
		console.error("Error creating headline:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle PUT requests to update an existing headline
export async function PUT(req: Request) {
	try {
		await connectToDB();
		// Parse the request body
		const { id, headline, author, description } = await req.json();

		// Validate required fields
		if (!id || !headline || !author || !description) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Use findOneAndUpdate to find a document by `id` and update it
		const updatedHeadline = await headingModel.findOneAndUpdate(
			{ id }, // Find the document with the matching `id`
			{ headline, author, description }, // Update fields
		);

		if (!updatedHeadline) {
			return NextResponse.json(
				{ error: "Headline not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedHeadline, { status: 200 });
	} catch (error) {
		console.error("Error updating headline:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}