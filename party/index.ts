import { Message, WebSocketMessage } from "@/src/types/types";
import type * as Party from "partykit/server";
import { v4 as uuidv4 } from "uuid";

const messageBuffer: Array<WebSocketMessage> = [];

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) { }


	// onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
	// 	// A websocket just connected!
	// 	console.log(`
	// 		Connected:
	// 		id: ${ conn.id }
	// 		room: ${ this.room.id }
	// 		url: ${ new URL(ctx.request.url).pathname }`
	// 	);

	// 	// let's send a message to the connection
	// 	// conn.send("hello from server");
	// }

	async onRequest(request: Party.Request) {
		// Handle DELETE requests to remove a message
		if (request.method === "DELETE") {
			// Extract the messageId and groupId from the request payload
			const { message } = await request.json<{ message: Message }>();

			// Validate that the groupId matches the room
			if (message.targetGroupId !== this.room.id) {
				return new Response("Invalid group ID", { status: 400 });
			}

			// Broadcast the deletion message to all clients in the room
			this.room.broadcast(JSON.stringify({
				type: "update",
				message: message
			}));

			return new Response("Message deleted", { status: 200 });
		}

		// Return 405 for unsupported methods
		return new Response("Method not allowed", { status: 405 });
	}

	async onMessage(newPackage: string, sender: Party.Connection) {
		//console.log(`connection ${sender.id} sent message: ${newPackage}`);

		const parsedMessage = JSON.parse(newPackage) as WebSocketMessage;
		const { user, message } = parsedMessage;

		message.id = uuidv4(); // Generate a unique ID for the message

		const response: WebSocketMessage = {
			type: "local",
			message,
			user,
		};

		// Store in RAM
		messageBuffer.push(response);

		// If we hit 500 messages, send them to the backend API
		if (messageBuffer.length >= 0) {
			await this.flushMessagesToAPI();
			console.log("Flushed messages to API at room :" + this.room.id);
		}

		// Broadcast message
		this.room.broadcast(JSON.stringify(response));
	}

	async flushMessagesToAPI() {
		try {
			const messagesToSend = [...messageBuffer];
			messageBuffer.length = 0; // Clear local buffer

			const websiteURL = "http://localhost:3000/api/saveMessages";

			// const websiteURL = "https://tu-alumni.vercel.app/api/saveMessages";

			await fetch(websiteURL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: messagesToSend }),
			});

			console.log("Sent 100 messages to API");
		} catch (error) {
			console.error("Failed to send messages to API:", error);
		}
	}
}

Server satisfies Party.Worker;
