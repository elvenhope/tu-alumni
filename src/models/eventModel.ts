import mongoose from "mongoose";
import { Event } from "@/src/types/types";

const eventSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	headline: { type: String, required: true },
	description: { type: String, required: true },
	month: { type: Number, required: true },
	day: { type: Number, require: true },
	image: { type: String, require: true },
	active: { type: Boolean, required: true },
})

export default mongoose.models.Event || mongoose.model<Event>("Event", eventSchema);