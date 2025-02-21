import mongoose from "mongoose";
import { BulletPoint } from "@/src/types/types";

const bulletSchema = new mongoose.Schema({
	id: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	image: { type: String, require: true },
	active: { type: Boolean, required: true },
}, {strict: false})

export default mongoose.models.BulletPoint || mongoose.model<BulletPoint>("BulletPoint", bulletSchema);