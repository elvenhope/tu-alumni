import type * as Party from "partykit/server";
import { v4 as uuidv4 } from "uuid";

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) { }

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(
			`Connected:
  			id: ${conn.id}
  			room: ${this.room.id}
  			url: ${new URL(ctx.request.url).pathname}`
		);

		// let's send a message to the connection
		// conn.send("hello from server");
	}

	onMessage(message: string, sender: Party.Connection) {
		// let's log the message
		console.log(`connection ${sender.id} sent message: ${message} in ${this.room.id}`);
		// as well as broadcast it to all the other connections in the room...
		const response = {
			type : "local",
			message: `${message}`,
			socketSenderId: sender.id,
			id: uuidv4()
		}
		this.room.broadcast(
			JSON.stringify(response),
			// ...except for the connection it came from
		);
	}

	onClose(connection: Party.Connection): void | Promise<void> {
		console.log(connection.id + " disconnected");
	}
}

Server satisfies Party.Worker;
