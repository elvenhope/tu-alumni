import connectToDB from "@/src/lib/connectToDB";
import articleModel from "@/src/models/articleModel";
import bulletModel from "@/src/models/bulletModel";
import eventModel from "@/src/models/eventModel";
import galleryModel from "@/src/models/galleryModel";
import headingModel from "@/src/models/headingModel";
import { Headline, Event, BulletPoint } from "@/src/types/types";
import { fetchImagesFromCollection } from "@/src/app/api/getImage/route";
import { format, parseISO, differenceInDays } from 'date-fns';

function sortEventsByDate(events: Event[]): Event[] {
	return events.sort((a, b) => {
		const dateA = new Date(a.year, a.month - 1, a.day);
		const dateB = new Date(b.year, b.month - 1, b.day);

		// Compare the dates
		return dateA.getTime() - dateB.getTime();
	})
}


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


		if (pageName == "Home") {
			const headlines: Headline[] = await headingModel.find({ active: true }).limit(5);

			const today = new Date();
			const events: Event[] = await eventModel.find({
				active: true,
				$or: [
					{ year: { $gt: today.getFullYear() } },
					{
						year: today.getFullYear(),
						$or: [
							{ month: { $gt: today.getMonth() + 1 } },
							{
								month: today.getMonth() + 1,
								day: { $gt: today.getDate() }
							}
						]
					}
				]
			}).limit(4);

			const bulletPoints: BulletPoint[] = await bulletModel.find({ active: true }).limit(3);

			const data = { headlines, events, bulletPoints };

			// Return the response
			return new Response(
				JSON.stringify({ data }),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		} else if (pageName == "About Us") {
			const mainArticle = await articleModel.findOne({ aboutUs: true });
			
			const galleries = await galleryModel.find({ active: true }).limit(5);

			const galleryImages = await Promise.all(
				galleries.map(async (gallery) => ({
					storageName: gallery.storageName, // Assuming each gallery object has storageName
					images: await fetchImagesFromCollection(gallery.storageName),
				}))
			);

			const data = { mainArticle, galleries, galleryImages };
			return new Response(
				JSON.stringify({ data }),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		} else if (pageName == "Events") {
			const today = new Date();
			const events: Event[] = await eventModel.find({
				active: true,
				$or: [
					{ year: { $gt: today.getFullYear() } },
					{
						year: today.getFullYear(),
						$or: [
							{ month: { $gt: today.getMonth() + 1 } },
							{
								month: today.getMonth() + 1,
								day: { $gt: today.getDate() }
							}
						]
					}
				]
			});

			const sortedEvents = sortEventsByDate(events).slice(0,20);
			
			const data = { events: sortedEvents };
			return new Response(
				JSON.stringify({ data }),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		} else if (pageName == "OneEvent") {
			const event = await eventModel.findOne({id: body.id});
			return new Response(
				JSON.stringify(event),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		} else {
			return new Response(
				JSON.stringify({ error: "Invalid page name" }),
				{ status: 400, headers: { "Content-Type": "application/json" } }
			);
		}
	} catch (error) {
		console.error("Error handling POST request:", error);
		return new Response(
			JSON.stringify({ error: "An error occurred while processing the request" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
}
