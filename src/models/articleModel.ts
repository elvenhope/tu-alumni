import mongoose from "mongoose";
import { Article } from "@/src/types/types";

const articleSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	headline: { type: String, required: true },
	description: { type: String, required: true },
	image: { type: String, required: false },
	author: { type: String, required: false },
	day: { type: Number, required: false },
	month: { type: Number, required: false },
	year: { type: Number, required: false },
	active: { type: Boolean, required: true },
	featured: { type: Boolean, default: false, required: true },
	aboutUs: { type: Boolean, default: false},
}, { strict: false })

export default mongoose.models.Article || mongoose.model<Article>("Article", articleSchema,);