import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import Gallery from "@/src/models/galleryModel";
import { v4 as uuidv4 } from "uuid";

// Handle GET requests to fetch all event galleries
export async function GET() {
	try {
		await connectToDB();
		const events = await Gallery.find({});
		return NextResponse.json(events, { status: 200 });
	} catch (error) {
		console.error("Error fetching event galleries:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle POST requests to create a new event gallery
export async function POST(req: Request) {
	try {
		await connectToDB();
		const body = await req.json();

		body.id = uuidv4();

		// Create a new event gallery entry
		const newGallery = await Gallery.create({
			id: body.id,
			thumbnail: body.thumbnail,
			day: body.day,
			month: body.month,
			year: body.year,
			headline: body.headline,
			description: body.description,
			active: body.active,
			storageName: body.storageName,
		});

		return NextResponse.json(newGallery, { status: 201 });
	} catch (error) {
		console.error("Error creating event gallery:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle PUT requests to update an existing event gallery
export async function PUT(req: Request) {
	try {
		await connectToDB();
		const { id, thumbnail, day, month, year, headline, description, active, storageName } =
			await req.json();

		// Validate required fields
		if (!id || !thumbnail || !day || !month || !year || !headline || !description || active == null || !storageName) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Find and update the event gallery entry
		const updatedGallery = await Gallery.findOneAndUpdate(
			{ id }, // Find document by `id`
			{ thumbnail, day, month, year, headline, description, active, storageName }, // Update fields
		);

		if (!updatedGallery) {
			return NextResponse.json(
				{ error: "Event gallery not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedGallery, { status: 200 });
	} catch (error) {
		console.error("Error updating event gallery:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle DELETE requests to remove an event gallery entry by `id`
export async function DELETE(req: Request) {
	try {
		await connectToDB();
		const { id } = await req.json();

		// Validate required field
		if (!id) {
			return NextResponse.json(
				{ error: "Missing required field: id" },
				{ status: 400 }
			);
		}

		// Find and delete the document
		const deletedGallery = await Gallery.findOneAndDelete({ id });

		if (!deletedGallery) {
			return NextResponse.json(
				{ error: "Event gallery not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Event gallery deleted successfully", deletedGallery },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting event gallery:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}