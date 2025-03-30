import { NextResponse } from "next/server";
import redis from "@/src/lib/redisInstance";
import { WebSocketMessage, Message } from "@/src/types/types";
import MessageModel from "@/src/models/messageModel"; // Import the Mongoose Message model

const redisClient = await redis(); // Initialize the Redis client

export async function POST(req: Request) {
	try {
		const { messages } = await req.json() as { messages: WebSocketMessage[] };

		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json({ error: "Invalid data" }, { status: 400 });
		}

		for (const entity of messages) {
			const message = entity.message;
			if (!message.id || !message.content || !message.authorId || !message.targetGroupId) {
				console.log("Invalid message format:", message);
				return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
			}

			const redisKey = `chat:messages:${message.targetGroupId}`;
			const messageString  = JSON.stringify(message);
			await redisClient.rPush(redisKey, messageString);

			const listSize = await redisClient.lLen(redisKey);
			console.log(`Current list size for ${redisKey}:`, listSize);

			if (listSize > 100) {
				// Fetch all messages from the Redis list
				const redisMessages = await redisClient.lRange(redisKey, 0, -1);

				// Parse messages from JSON
				const messagesToSave: Array<Message> = redisMessages.map((msg: string) => JSON.parse(msg));

				// Save messages to MongoDB using the Message model
				try {
					await MessageModel.insertMany(messagesToSave);  // Insert the messages into MongoDB
					console.log("Messages saved to MongoDB!");

					// Optionally, clear the Redis list after saving to MongoDB
					await redisClient.del(redisKey);
				} catch (error) {
					console.error("Error saving messages to MongoDB:", error);
				}

				await redisClient.lTrim(redisKey, -100, -1); // Keep only the last 100 messages
			}
			console.log("Message saved to Redis");
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving messages:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
