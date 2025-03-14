import mongoose from "mongoose";
import { User } from "@/src/types/types";

const userSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true
	},
	profileImage: {
		type: String,
		required: false
	},
	phoneNumber: {
		type: String,
		required: false
	},
	graduatedMajor: {
		type: String,
		required: false
	},
	graduatedYear: {
		type: String,
		required: false
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	location: {
		type: String,
		required: false
	},
	jobExperienceDescription: {
		type: String,
		required: false
	},
	website: {
		type: String,
		required: false
	},
	socialFacebook: {
		type: String,
		required: false
	},
	socialInstagram: {
		type: String,
		required: false
	},
	socialLinkedin: {
		type: String,
		required: false
	},
	interests: {
		type: String,
		required: false
	},
	whoAmI: {
		type: String,
		required: false
	},
	whatIWantToAchieve: {
		type: String,
		required: false
	},
	whatICanOfferYou: {
		type: String,
		required: false
	},
	whereCanYouFindMe: {
		type: String,
		required: false
	},
	hashtags: {
		type: [String],
		required: false
	}
}, { timestamps: true, strict: false });

export default mongoose.models.User || mongoose.model<User>("User", userSchema);