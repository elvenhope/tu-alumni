import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		if (!body.firstName || !body.lastName || !body.email || !body.password || !body.role) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		await connectToDB();
		
		body.id = uuidv4();
		body.password = await bcrypt.hash(body.password, 12);

		const newUser = new User(body);
		await newUser.save();

		return NextResponse.json({ message: "User created successfully" }, { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const body = await req.json();
		if (!body.id) {
			return NextResponse.json({ error: "User ID is required" }, { status: 400 });
		}

		await connectToDB();
		const updatedUser = await User.findByIdAndUpdate(body.id, body, { new: true });

		if (!updatedUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
