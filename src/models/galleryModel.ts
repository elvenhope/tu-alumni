import mongoose from "mongoose";
import { Gallery } from "@/src/types/types";

const GallerySchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	thumbnail: { type: String, required: true },
	day: { type: Number, required: true },
	month: { type: Number, required: true },
	year: { type: Number, required: true },
	headline: { type: String, required: true },
	description: { type: String, required: true },
	active: { type: Boolean, required: true },
	storageName: { type: String, required: true },
}, {strict: false});

export default mongoose.models.Gallery || mongoose.model<Gallery>("Gallery", GallerySchema);