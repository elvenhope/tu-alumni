import { createClient } from "redis";

let redisInstance: ReturnType<typeof createClient> | null = null;

const getRedisClient = async () => {
	// If the Redis client is already initialized, return it
	if (redisInstance) {
		return redisInstance;
	}

	// If not, initialize the Redis client
	redisInstance = createClient({ url: process.env.REDIS_URL });

	// Try to connect to Redis
	try {
		await redisInstance.connect();
		console.log("Connected to Redis!");
	} catch (error) {
		console.error("Error connecting to Redis:", error);
		throw error;
	}

	return redisInstance;
};

export default getRedisClient;
