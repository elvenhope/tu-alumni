import { NextResponse } from "next/server";
import redis from "@/src/lib/redisInstance"; // Import the Redis instance
import { Message } from "@/src/types/types";  // Import the Mongoose Message model
import MessageModel from "@/src/models/messageModel";

const redisClient = await redis(); // Initialize the Redis client


// Function to fetch messages from MongoDB using the Mongoose model
async function fetchMessagesFromMongo(groupId: string) {
	// Fetch messages using Mongoose from the Message collection
	const messages = await MessageModel.find({ targetGroupId: groupId })
		.sort({ timestamp: 1 }) // Sort by timestamp in descending order
		.limit(100);               // Fetch up to 500 most recent messages

	return messages;
}

// Function to get messages from Redis
async function getMessagesFromRedis(groupId: string) {
	const redisKey = `chat:messages:${groupId}`;

	// Retrieve messages from Redis (list)
	const redisMessages = await redisClient.lRange(redisKey, 0, -1);

	// If no messages found in Redis, return null
	if (redisMessages.length === 0) return null;

	// Parse and return the messages from Redis
	return redisMessages.map((msg) => JSON.parse(msg));
}

// Function to save messages to Redis
async function saveMessagesToRedis(groupId: string, messages: Message[]) {
	// Store the messages in Redis (under the group-specific key)
	for (const message of messages) {
		const redisKey = `chat:messages:${message.targetGroupId}`;
		const messageString = JSON.stringify(message);
		await redisClient.rPush(redisKey, messageString);

		await redisClient.lTrim(redisKey, -500, -1); // Keep only the last 500 messages
	}
}

export async function POST(req: Request) {
	try {
		// Parse the request body to get the groupId
		const { groupId } = await req.json();
		if (!groupId) {
			return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
		}

		// First, check if the messages are available in Redis
		let messages = await getMessagesFromRedis(groupId);

		if (!messages) {
			// If not found in Redis, fetch from MongoDB using the Mongoose model
			messages = await fetchMessagesFromMongo(groupId);
			// Save the fetched messages to Redis for future requests
			if (messages && messages.length > 0) {
				await saveMessagesToRedis(groupId, messages);
			}
		}

		// Return the messages
		return NextResponse.json({ messages });
	} catch (error) {
		console.error("Error fetching messages:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
