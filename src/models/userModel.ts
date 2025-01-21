import mongoose from "mongoose";

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
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;