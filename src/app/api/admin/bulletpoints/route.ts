import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import { v4 as uuidv4 } from "uuid";
import bulletModel from "@/src/models/bulletModel";
import { BulletPoint } from "@/src/types/types";
import addFieldIfMissing from "@/src/lib/addFieldIfMissing";

export async function GET() {
	try {
		await connectToDB();
		const bulletPoints = await bulletModel.find({});
		return NextResponse.json(bulletPoints, { status: 200 });
	} catch (error) {
		console.error("Error fetching bullet points:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		await connectToDB();
		const body: BulletPoint = await req.json();

		body.id = uuidv4();

		const newBulletPoint = await bulletModel.create(body);
		return NextResponse.json(newBulletPoint, { status: 201 });
	} catch (error) {
		console.error("Error creating bullet point:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function PUT(req: Request) {
	try {
		await connectToDB();
		const { id, description, image, active }: BulletPoint = await req.json();

		if (!id || !description || !image || active === undefined) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		await addFieldIfMissing(bulletModel, id, "active", false);

		const updatedBulletPoint = await bulletModel.findOneAndUpdate(
			{ id },
			{ description, image, active },
		);

		if (!updatedBulletPoint) {
			return NextResponse.json(
				{ error: "Bullet point not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedBulletPoint, { status: 200 });
	} catch (error) {
		console.error("Error updating bullet point:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

export async function DELETE(req: Request) {
	try {
		await connectToDB();

		const { id } = await req.json();

		if (!id) {
			return NextResponse.json(
				{ error: "Missing required field: id" },
				{ status: 400 }
			);
		}

		const deletedBulletPoint = await bulletModel.findOneAndDelete({ id });

		if (!deletedBulletPoint) {
			return NextResponse.json(
				{ error: "Bullet point not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Bullet point deleted successfully", deletedBulletPoint },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting bullet point:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}