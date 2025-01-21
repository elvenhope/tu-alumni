import mongoose from "mongoose";

const headingSchema = new mongoose.Schema({
	id: { type: String, required: true},
	headline: { type: String, required: true },
	author: { type: String, required: true },
	description: { type: String, required: true },
})

export default mongoose.models.Heading || mongoose.model("Heading", headingSchema);