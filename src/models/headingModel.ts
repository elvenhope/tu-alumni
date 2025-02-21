import mongoose from "mongoose";
import { Headline } from "@/src/types/types";

const headingSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	headline: { type: String, required: true },
	author: { type: String, required: true },
	description: { type: String, required: true },
	active: { type: Boolean, required: true },
}, { strict: false })

export default mongoose.models.Heading || mongoose.model<Headline>("Heading", headingSchema);