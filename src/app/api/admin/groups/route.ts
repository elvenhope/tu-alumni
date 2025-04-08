import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import Group from "@/src/models/groupModel";
import { v4 as uuidv4 } from "uuid";

// GET - return all groups
export async function GET() {
	try {
		await connectToDB();
		const groups = await Group.find().populate("users", "id firstName lastName role profileImage");;
		return NextResponse.json(groups, { status: 200 });
	} catch (error) {
		console.error("Error fetching groups:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// POST - create a new group
export async function POST(req: Request) {
	try {
		const body = await req.json();

		if (!body.name) {
			return NextResponse.json({ error: "Name is required" }, { status: 400 });
		}

		await connectToDB();

		const newGroup = new Group({
			...body,
			id: uuidv4(), // generate unique UUID
		});

		await newGroup.save();

		return NextResponse.json(newGroup, { status: 201 });
	} catch (error) {
		console.error("Error creating group:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// PUT - update a group
export async function PUT(req: Request) {
	try {
		const body = await req.json();

		if (!body.id) {
			return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
		}

		await connectToDB();

		const updatedGroup = await Group.findOneAndUpdate(
			{ id: body.id },
			body,
			{ new: true }
		);

		if (!updatedGroup) {
			return NextResponse.json({ error: "Group not found" }, { status: 404 });
		}

		return NextResponse.json(updatedGroup, { status: 200 });
	} catch (error) {
		console.error("Error updating group:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// DELETE - delete a group
export async function DELETE(req: Request) {
	try {
		const { id } = await req.json();

		if (!id) {
			return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
		}

		await connectToDB();

		const deleted = await Group.findOneAndDelete({ id });

		if (!deleted) {
			return NextResponse.json({ error: "Group not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting group:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
