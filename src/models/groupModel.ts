import mongoose from "mongoose";
import { Group } from "@/src/types/types";

const groupSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true,
	},
	image: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	users: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
	],
	tags: {
		type: [String], // ✅ Fix: No need for `[{ type: [String] }]`
		required: true,
		default: [], // Ensures it's always an array
	},
}, { timestamps: true, strict: false });

export default mongoose.models.Group || mongoose.model<Group>("Group", groupSchema);