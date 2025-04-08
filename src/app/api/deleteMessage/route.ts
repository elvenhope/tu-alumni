import { NextRequest, NextResponse } from "next/server";
import redis from "@/src/lib/redisInstance";
import MessageModel from "@/src/models/messageModel";
import { getServerSession } from "next-auth"; // Or your specific auth function
import { Message } from "@/src/types/types";
import { config } from "@/src/lib/auth";
import PartySocket from "partysocket";

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(config); // Adjust to match your setup

		const host =
			process.env.NODE_ENV == "development"
				? "http://127.0.0.1:1999"
				: "http://tu-alumni-party.elvenhope.partykit.dev";

		if (!session || !session.user) {
			return NextResponse.json("Unauthorized", { status: 401 });
		}

		const { message } = await req.json();

		const messageId = message.id;
		const groupId = message.targetGroupId;

		if (!messageId) {
			return NextResponse.json("Missing message Id", { status: 400 });
		}

		if (!groupId) {
			return NextResponse.json("Missing group", { status: 400 });
		}

		// Try to fetch the message from MongoDB first
		const messageObjectFromMongo = await MessageModel.findOne({ id: messageId });

		let messageObject: Message | null = null;

		if (messageObjectFromMongo) {
			messageObject = messageObjectFromMongo;
		} else {
			// If not found in MongoDB, check Redis
			const redisClient = await redis();
			const redisKey = `chat:messages:${groupId}`;
			const messageString = JSON.stringify(message);

			// Try to find the message in Redis
			const redisMessage = await redisClient.lRange(redisKey, 0, -1);
			const foundInRedis = redisMessage.find((msg) => msg === messageString);

			if (foundInRedis) {
				// If the message is found in Redis, reconstruct the object
				messageObject = JSON.parse(foundInRedis);
			}
		}

		if (!messageObject) {
			return NextResponse.json("Message not found", { status: 404 });
		}

		const isAdmin = session.user.role.toLowerCase() === "admin";
		const isAuthor = session.user.id === messageObject.authorId;

		if (!isAdmin && !isAuthor) {
			return NextResponse.json("Forbidden", { status: 403 });
		}

		// Delete from Redis if the message is found there
		if (messageObject) {
			const redisClient = await redis();
			const redisKey = `chat:messages:${groupId}`;
			const messageString = JSON.stringify(message);
			await redisClient.lRem(redisKey, 0, messageString); // Remove the message from Redis
		}

		// Delete from MongoDB if it was found there
		if (messageObjectFromMongo) {
			await MessageModel.findOneAndDelete({id: messageId});
		}

		// Broadcast the deletion to PartyKit server
		try {
			const requestUrl = host + "/" + groupId;
			console.log(requestUrl);

			const res = await PartySocket.fetch(
				{host: host, room: groupId},
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ message: messageObject }),
				}
			)

			if (res.ok) {
				console.log("Message deletion broadcasted");
			} else {
				const error = await res.text();
				console.error("Failed to broadcast message deletion:", error);
			}
		} catch (err) {
			console.error("Error sending delete request:", err);
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error deleting message:", error);
		return NextResponse.json("Internal Server Error", { status: 500 });
	}
}
