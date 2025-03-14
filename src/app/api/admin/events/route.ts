import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import { v4 as uuidv4 } from "uuid";
import eventModel from "@/src/models/eventModel";
import { Event } from "@/src/types/types";
import addFieldIfMissing from "@/src/lib/addFieldIfMissing";

// Handle GET requests to fetch all events
export async function GET() {
	try {
		await connectToDB();
		const events = await eventModel.find({});
		return NextResponse.json(events, { status: 200 });
	} catch (error) {
		console.error("Error fetching events:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle POST requests to create a new event
export async function POST(req: Request) {
	try {
		await connectToDB();
		const body: Event = await req.json();

		// Add a unique ID to the event
		body.id = uuidv4();

		// Create a new event
		try {
			const newEvent = await eventModel.create(body);
			return NextResponse.json(newEvent, { status: 201 });
		} catch (error) {
			return NextResponse.json(
				{ error: "Failed to create event, " + error },
				{ status: 403 }
			);
		}
		
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle PUT requests to update an existing event
export async function PUT(req: Request) {
	try {
		await connectToDB();
		const { id, day, month, year, headline, description, image, active, registrationLink }: Event =
			await req.json();

		// Validate required fields
		if (!id || !day || !month || !year || !headline || !description || !image || active === null) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Use findOneAndUpdate to find a document by `id` and update it
		const updatedEvent = await eventModel.findOneAndUpdate(
			{ id }, // Find the document with the matching `id`
			{ day, month, year, headline, registrationLink, description, image, active }, // Update fields
		);

		if (!updatedEvent) {
			return NextResponse.json(
				{ error: "Event not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedEvent, { status: 200 });
	} catch (error) {
		console.error("Error updating event:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle DELETE requests to delete a event by `id`
export async function DELETE(req: Request) {
	try {
		await connectToDB();

		// Parse the request body
		const { id } = await req.json();

		// Validate required field
		if (!id) {
			return NextResponse.json(
				{ error: "Missing required field: id" },
				{ status: 400 }
			);
		}

		// Use findOneAndDelete to find and delete the document by `id`
		const deletedEvent = await eventModel.findOneAndDelete({ id });

		if (!deletedEvent) {
			return NextResponse.json(
				{ error: "Event not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Event deleted successfully", deletedEvent },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting event:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}