import mongoose from "mongoose";
import { Message } from "@/src/types/types";

const messageSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	content: { type: String, required: true },
	authorId: { type: String, required: true },
	authorFirstName: { type: String, required: true },
	authorLastName: { type: String, required: true },
	authorImage: { type: String, required: true }, // Assuming you store the image URL as a string
	targetGroupId: { type: String, required: true },
	timestamp: { type: String, required: true }, // You could use Date if you prefer
}, { strict: false })

export default mongoose.models.Message || mongoose.model<Message>("Message", messageSchema);