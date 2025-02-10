import { google } from "googleapis";
import { NextResponse } from "next/server";

const folderId = "1jQY3QB0FgETBO-imlbcGjcqFp09RanpF"; // Root folder ID

export async function fetchImagesFromCollection(collectionName: string) {
	const auth = new google.auth.GoogleAuth({
		keyFile: "./tu-alumni-450412-70d171817744.json",
		scopes: [
			"https://www.googleapis.com/auth/drive.file",
			"https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/drive.metadata.readonly"
		],
	});

	const drive = google.drive({ version: "v3", auth });

	// Find the subfolder with the matching collection name
	const folderResponse = await drive.files.list({
		q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${collectionName}'`,
		fields: "files(id, name)",
	});

	if (!folderResponse.data.files || folderResponse.data.files.length === 0) {
		// throw new Error(`Folder '${collectionName}' not found`);
		console.log("Folder not found");
		return [];
	}

	const subFolderId = folderResponse.data.files[0].id;

	// Get images from the matched subfolder
	const imageResponse = await drive.files.list({
		q: `'${subFolderId}' in parents and mimeType contains 'image/'`,
		fields: "files(id, name, mimeType)",
	});

	return imageResponse.data.files?.map((file) => ({
		url: `https://drive.google.com/uc?id=${file.id}`,
	})) || [];
}

export async function POST(req: Request) {
	try {
		const { collectionName } = await req.json();

		console.log(collectionName);

		if (!collectionName) {
			return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
		}

		const images = await fetchImagesFromCollection(collectionName);
		return NextResponse.json(images);
		//eslint-disable-next-line
	} catch (error) {
		console.error("Error fetching images:", error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
