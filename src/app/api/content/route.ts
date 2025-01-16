import { Headline, Event } from "@/src/app/types";

export async function POST(request: Request): Promise<Response> {
	try {
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
		const headlines: Headline[] = Array.from({ length: 5 }, (_, index) => ({
			headline: `${pageName} - Headline ${index + 1}`,
			author: `Author ${index + 1}`,
			description: `${pageName} - Description Nullam vel nunc eget enim volutpat pretium. Nullam orci dolor, hendrerit in aliquet varius, facilisis non diam. Fusce tristique mauris vel augue aliquam fringilla. Nulla gravida felis sem, non porttitor metus efficitur a. Duis ultrices malesuada augue mollis congue. Curabitur id neque eget diam maximus maximus ac nec risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. ${index + 1}`,
		}));

		const events: Event[] = Array.from({ length: 4 }, (_, index) => ({
			headline: `${pageName} - Headline ${index + 1}`,
			description: `${pageName} - Description Nullam vel nunc eget enim volutpat pretium. Nullam orci dolor, hendrerit in aliquet varius, facilisis non diam. Fusce tristique mauris vel augue aliquam fringilla. Nulla gravida felis sem, non porttitor metus efficitur a. Duis ultrices malesuada augue mollis congue. Curabitur id neque eget diam maximus maximus ac nec risus. Interdum et malesuada fames ac ante ipsum primis in faucibus. ${index + 1}`,
			day: 1,
			month: 1,
			image: "https://picsum.photos/600/400",
		}));

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
