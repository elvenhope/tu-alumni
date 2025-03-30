import { WebSocketMessage } from "@/src/types/types";
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

			//const websiteURL =  "http://localhost:3000/api/saveMessages";
			const websiteURL =  "https://tu-alumni.vercel.app/api/saveMessages";

			await fetch(websiteURL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: messagesToSend }),
			});

			console.log("Sent 500 messages to API");
		} catch (error) {
			console.error("Failed to send messages to API:", error);
		}
	}
}

Server satisfies Party.Worker;
