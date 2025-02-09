import { google } from "googleapis";
import { NextResponse } from "next/server";

const folderId = "1jQY3QB0FgETBO-imlbcGjcqFp09RanpF"; // Root folder ID

export async function POST(req: Request) {
	try {
		const { collectionName } = await req.json();
		if (!collectionName) {
			return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
		}

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
			return NextResponse.json({ error: `Folder '${collectionName}' not found` }, { status: 404 });
		}

		const subFolderId = folderResponse.data.files[0].id;

		// Get images from the matched subfolder
		const imageResponse = await drive.files.list({
			q: `'${subFolderId}' in parents and mimeType contains 'image/'`,
			fields: "files(id, name, mimeType)",
		});

		const images = imageResponse.data.files?.map((file) => ({
			id: file.id,
			name: file.name,
			url: `https://drive.google.com/uc?id=${file.id}`,
		})) || [];

		return NextResponse.json(images);
		//eslint-disable-next-line
	} catch (error: any) {
		console.error("Error fetching images:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
