import { NextResponse } from "next/server";
import connectToDB from "@/src/lib/connectToDB";
import Article from "@/src/models/articleModel";
import { v4 as uuidv4 } from "uuid";

// GET: Fetch articles (all or just About Us)
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const isAboutUs = searchParams.get("aboutus") === "true";

	try {
		await connectToDB();

		const result = isAboutUs
			? await Article.findOne({ aboutUs: true })
			: await Article.find({});

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Error fetching articles:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// POST: Create a new article or set an article as About Us
export async function POST(req: Request) {
	try {
		await connectToDB();
		const body = await req.json();

		if (body.aboutUs === true && body.id) {
			// Set all articles' aboutUs to false
			await Article.updateMany({}, { $set: { aboutUs: false } });

			// Set the specified article's aboutUs to true
			const updated = await Article.findOneAndUpdate(
				{ id: body.id },
				{ $set: { aboutUs: true } },
				{ new: true }
			);

			if (!updated) {
				return NextResponse.json({ error: "Article not found" }, { status: 404 });
			}

			return NextResponse.json(updated, { status: 200 });
		} else {
			const id = uuidv4();

			// Validate required localized fields and image
			if (
				!body.headline?.en ||
				!body.headline?.lv ||
				!body.description?.en ||
				!body.description?.lv ||
				!body.image
			) {
				return NextResponse.json(
					{ error: "Missing required fields: headline, description, or image" },
					{ status: 400 }
				);
			}

			const newArticle = await Article.create({
				id,
				headline: {
					en: body.headline.en,
					lv: body.headline.lv,
				},
				description: {
					en: body.description.en,
					lv: body.description.lv,
				},
				author: {
					en: body.author?.en || "",
					lv: body.author?.lv || "",
				},
				image: body.image,
				day: body.day,
				month: body.month,
				year: body.year,
				active: body.active ?? true,
				aboutUs: body.aboutUs ?? false,
				featured: body.featured ?? false,
				dateAdded: body.dateAdded || new Date().toISOString(),
			});

			return NextResponse.json(newArticle, { status: 201 });
		}
	} catch (error) {
		console.error("Error creating article:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// PUT: Update article
export async function PUT(req: Request) {
	try {
		await connectToDB();
		const body = await req.json();

		const {
			id,
			headline,
			description,
			author,
			image,
			day,
			month,
			year,
			active,
			aboutUs,
			featured,
			dateAdded,
		} = body;

		if (!id) {
			return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
		}

		if (
			!headline?.en ||
			!headline?.lv ||
			!description?.en ||
			!description?.lv ||
			!image
		) {
			return NextResponse.json(
				{ error: "Missing required fields: headline, description, or image" },
				{ status: 400 }
			);
		}

		const updated = await Article.findOneAndUpdate(
			{ id },
			{
				headline,
				description,
				author: {
					en: author?.en || "",
					lv: author?.lv || "",
				},
				image,
				day,
				month,
				year,
				active,
				aboutUs,
				featured,
				dateAdded,
			},
			{ new: true }
		);

		if (!updated) {
			return NextResponse.json({ error: "Article not found" }, { status: 404 });
		}

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("Error updating article:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

// DELETE: Remove article
export async function DELETE(req: Request) {
	try {
		await connectToDB();
		const { id } = await req.json();

		if (!id) {
			return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
		}

		const deleted = await Article.findOneAndDelete({ id });

		if (!deleted) {
			return NextResponse.json({ error: "Article not found" }, { status: 404 });
		}

		return NextResponse.json({ message: "Deleted", deleted }, { status: 200 });
	} catch (error) {
		console.error("Error deleting article:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
