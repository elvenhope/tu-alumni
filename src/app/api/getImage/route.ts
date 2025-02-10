import { google } from "googleapis";
import { NextResponse } from "next/server";

const folderId = "1jQY3QB0FgETBO-imlbcGjcqFp09RanpF"; // Root folder ID

export async function fetchImagesFromCollection(collectionName: string) {
	const auth = new google.auth.GoogleAuth({
		credentials: {
			client_email: "tu-alumni-image-getter@tu-alumni-450412.iam.gserviceaccount.com",
			private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCQIs77dmarsIoI\n19P1tEyCJcD2dwn7/CFEGLDnyq+fynRSWPbh0U2whhTiTSfznlZKWwrpyKtgKKaV\nI337oZY+WrzjH/QeJVmrcuMhqcjgzp2OfPGZt1pten5emm27A1jsTUHr1VvIpjzT\ne60DtS0fUXhvuKNgqscZtscwQ9XDrkRImp9SPu2ErF39zIzJh0iuhZrahkpdM5od\nL0H68+QLxJajknFwBYPTG542ROL6HzffimMUlJR9JnInQBvpv0kwG3OPSoybtuRV\nl7dQb2/rUXREruwdObiSr5glhr3XKMIq8Tr8oWjyKm1lBbQZ8Tl34Nh8ZStqUOKp\nISbQh+WvAgMBAAECggEABuZ7tUMuWCLcAN9gSN+IWCS5j7MUOcmQyCNMeNRVwxcc\nqYKT0yzDhONuZYUfGAUpCWdBZv7R4YkgrHwmAGF0gWizqUXy2GyeVdxqrkZkFQsf\nNN6bbGoAPMSD/0ByZ2UaITnzoXg17C21NMSzfD10uw6Z7vNOcwbKAFulPpTIy5Te\nUBgsNrYEARul0EeuYj3fdDaeiwr/NxkwgJ/KOeJ2n18dewg30K4EFKbzzHsWTCdD\nsIOBC8jipf8pO2FRFdMugGBflcuiaT8D1PFpUojPX11phNRbZBKWeWayK6TizSMW\n5wMMatDJ7pYl1n8qhBTcDgB85KiblncycXpg6WV4hQKBgQDCvCcszSvSOTTt5md0\nZ2N3dFd2ulO4DJgzM5xmUmtv9iNDlLMLbiZKG+iG1Bdl2A/Pt4iRMn/IEmhJGIpO\ntRDRQ0LZYmUqYI+k2BT63S43GSBqbIwsLgQQcMxwQRFn8AcrIoC6zS+rAArgzZLK\n9f/M0LFcgU0XwByn0WuFq/3+OwKBgQC9e3CbctHa3dVG5HscttAq+STmbYEVl1tC\n3PwA7rAl7mewzBJynzLBjifA+zdB4F9Mwkjsf/hzPqgxat2+lsas1XrQQherWURz\nwSHIAAik9YoGmgMnr7tDM7OfJ5CCvJbLxmS3Woy6sTWBCMg3PwBiwDDB73eFcPFf\nDk9m0le7HQKBgQCkev3v1oBr+UveoVzCsk0OaaMysmDiNSkdHju9JWJ/1/ujKmcs\ngWYv9HCr6Vq1+BAq14+vbGMH35xcGTFBF6jTyCcfq/9dEuBhUO4vkkBl44BAw9yF\nuHxQUqYrLpqAGvpDEcp/fa4Elm2Zwal6atwb6C3Wv5QZOng5uyZBaquHXwKBgGpY\nU3ULVjiOdFsbdPVCrUbRGiKxptclYbT/Lfif/gDr8wpJHrlyHByB2lH3LKYudY4x\nJJiHojucGO3TWqzTFqJ+FjW4QmyK515IMNt9GVzr6hGWctrdSC6JX/CdVf/qNIAd\n0v0NNxq4xpyq/yPymhbSYwsViXE9WFrPP0UoHNEJAoGAcpgL5b//llfJOHQkE6wg\nwEhXPvz/lYzBpWd1uNhaZVSK1pjdLxUKirREvXw8FE3BNtp4vPF0hldusHhnZf88\nTerdK0AmbIJF18480ayeDzrfNlrPPDyzg3OTF5mHEa1gY3/cQVPIucm95TCL8q1f\nSVkUXKu+KIkI68pkLhl3xrk=\n-----END PRIVATE KEY-----\n",
			project_id: "tu-alumni-450412"
		},
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
