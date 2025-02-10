import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import Article from "@/src/models/articleModel";
import { v4 as uuidv4 } from "uuid";
import addFieldIfMissing from "@/src/lib/addFieldIfMissing";

// Handle GET requests to fetch all articles
export async function GET(req: Request) {

	const { searchParams } = new URL(req.url);
	const isAboutUs = searchParams.get("aboutus") === "true";

	try {
		await connectToDB();
		if (isAboutUs) {
			const articles = await Article.findOne({ aboutUs: true });
			return NextResponse.json(articles, { status: 200 });
		} else {
			const articles = await Article.find({});
			return NextResponse.json(articles, { status: 200 });
		}
	} catch (error) {
		console.error("Error fetching articles:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle POST requests to create a new article
export async function POST(req: Request) {
	try {
		await connectToDB();
		const body = await req.json();

		if (body.aboutUs === true && body.id) {
			// Step 1: Unset `aboutUs` from all other articles
			await Article.updateMany({}, { $set: { aboutUs: false } });

			// Step 2: Find and update the specified article
			const updatedArticle = await Article.findOneAndUpdate(
				{ id: body.id },
				{ $set: { aboutUs: true } }, // ✅ Ensures field is added if missing
				{ new: true }
			);

			if (!updatedArticle) {
				return NextResponse.json(
					{ error: "Article not found" },
					{ status: 404 }
				);
			}

			return NextResponse.json(updatedArticle, { status: 200 });
		} else {
			body.id = uuidv4();
			// Create a new article entry
			const newArticle = await Article.create({
				id: body.id,
				headline: body.headline,
				description: body.description,
				image: body.image,
				author: body.author,
				day: body.day,
				month: body.month,
				year: body.year,
				active: body.active,
			});

			return NextResponse.json(newArticle, { status: 201 });
		}
	} catch (error) {
		console.error("Error creating article:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle PUT requests to update an existing article
export async function PUT(req: Request) {
	try {
		await connectToDB();
		const { id, headline, description, image, author, day, month, year, active } =
			await req.json();

		// Validate required fields
		if (!id || !headline || !description) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Find and update the article
		const updatedArticle = await Article.findOneAndUpdate(
			{ id: id }, // Find document by `_id`
			{ headline, description, image, author, day, month, year, active }, // Update fields
			{ new: true } // Return the updated document
		);

		if (!updatedArticle) {
			return NextResponse.json(
				{ error: "Article not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(updatedArticle, { status: 200 });
	} catch (error) {
		console.error("Error updating article:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

// Handle DELETE requests to remove an article by `id`
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
		const deletedArticle = await Article.findOneAndDelete({ id: id });

		if (!deletedArticle) {
			return NextResponse.json(
				{ error: "Article not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ message: "Article deleted successfully", deletedArticle },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error deleting article:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
