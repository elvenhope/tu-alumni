import connectToDB from "@/src/lib/connectToDB";
import eventModel from "@/src/models/eventModel";
import headingModel from "@/src/models/headingModel";
import { Headline, Event } from "@/src/types/types";

export async function POST(request: Request): Promise<Response> {
	try {
		await connectToDB();
		// Parse the request body
		const body = await request.json();

		// Validate the `pageName` field
		const { pageName } = body as { pageName?: string };
		if (!pageName || typeof pageName !== "string") {
			return new Response(
				JSON.stringify({ error: "Invalid or missing page name" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}

		// Mock data generation
		const headlines: Headline[] = await headingModel.find({}).limit(5);

		const events: Event[] = await eventModel.find({}).limit(4);

		const data = { headlines, events };

		// Return the response
		return new Response(
			JSON.stringify({ data }),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error("Error handling POST request:", error);
		return new Response(
			JSON.stringify({ error: "An error occurred while processing the request" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
