export function generateUrlName(headline: string): string {
	return headline
		.toLowerCase() // Convert to lowercase
		.trim() // Remove leading and trailing spaces
		.replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
		.replace(/\s+/g, "-"); // Replace spaces with hyphens
}