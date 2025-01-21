import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
	id: { type: String, required: true },
	headline: { type: String, required: true },
	description: { type: String, required: true },
	month: { type: Number, required: true },
	day: { type: Number, require: true },
	image: { type: String, require: true }
})

export default mongoose.models.Event || mongoose.model("Event", eventSchema);