import mongoose from 'mongoose'

const connectToDB = async () => {
	if (mongoose.connection.readyState >= 1) {
		return
	}
	// console.log(process.env.MONGODB_URI);
	mongoose.connect(process.env.MONGODB_URI as string).then((con) => console.log("Connected to DB!"))
}

export default connectToDB