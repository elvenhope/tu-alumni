export const uploadImage = async (
	image: File,
	name?: string,
	expiration?: number
): Promise<{
	id: string;
	title: string;
	url: string;
	displayUrl: string;
	deleteUrl: string;
	success: boolean;
}> => {
	try {
		const formData = new FormData();
		const key = process.env.IMG_BB_KEY;
		if(key) {
			formData.append("key", key);
		}
		formData.append("image", image);

		if (name) {
			formData.append("name", name);
		}

		if (expiration) {
			formData.append("expiration", expiration.toString());
		}

		const response = await fetch("https://api.imgbb.com/1/upload", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Failed to upload image: ${response.statusText}`);
		}

		const result = await response.json();

		if (result.success && result.data) {
			return {
				id: result.data.id,
				title: result.data.title,
				url: result.data.url,
				displayUrl: result.data.display_url,
				deleteUrl: result.data.delete_url,
				success: result.success,
			};
		} else {
			throw new Error("Unexpected response structure or upload failed.");
		}
	} catch (error) {
		console.error("Error uploading image:", error);
		throw error;
	}
};