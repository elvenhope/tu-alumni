import { Model, Document } from "mongoose";

export default async function addFieldIfMissing<T extends Document> (model: Model<T> ,id: string, fieldName: string, defaultValue: unknown) {
	// Find the document without the field
	const existingDoc = await model.findOne({ id, [fieldName]: { $exists: false } });

	if (existingDoc) {
		// Delete the old document
		await model.deleteOne({ _id: existingDoc._id });

		// Create a new document with the missing field added
		const newDoc = { ...existingDoc.toObject(), [fieldName]: defaultValue };
		delete newDoc._id; // Ensure MongoDB generates a new _id

		const insertedDoc = await model.create(newDoc);
		return insertedDoc;
	}

	return null; // Return null if no document needed replacement
};