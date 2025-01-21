import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/src/lib/uploadImage";

export async function POST(req: NextRequest) {
	try {
		const contentType = req.headers.get("content-type");
		if (!contentType || !contentType.includes("multipart/form-data")) {
			return NextResponse.json(
				{ error: "Invalid content type. Expecting multipart/form-data" },
				{ status: 400 }
			);
		}

		// Parse the form data
		const formData = await req.formData();

		// Extract the file from the form data
		const file = formData.get("file") as File | null;
		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Use the buffer to upload the image
		const uploadedImageObject = await uploadImage(file);

		// Return the uploaded image URL
		return NextResponse.json({ url: uploadedImageObject.url }, { status: 200 });
	} catch (error) {
		console.error("Error handling file upload:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}