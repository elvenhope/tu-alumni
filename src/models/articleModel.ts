import mongoose from "mongoose";
import { Article } from "../types/types";

const localizedStringSchema = {
	en: { type: String, required: true },
	lv: { type: String, required: true },
};

const articleSchema = new mongoose.Schema(
	{
		// _id is auto-managed by MongoDB; if you want custom id, uncomment below:
		id: { type: String, required: true, unique: true },
		headline: { type: localizedStringSchema, required: true },
		description: { type: localizedStringSchema, required: true },
		author: {
			en: { type: String, default: "" },
			lv: { type: String, default: "" },
		},
		image: { type: String, required: true },
		day: { type: Number, required: false },
		month: { type: Number, required: false },
		year: { type: Number, required: false },
		active: { type: Boolean, default: true },
		aboutUs: { type: Boolean, default: false },
		featured: { type: Boolean, default: false },
		dateAdded: { type: String, required: true },

		// Optional: timestamps
	},
	{ timestamps: true }
);

export default mongoose.models.Article || mongoose.model<Article>("Article", articleSchema);
