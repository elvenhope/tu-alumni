import { User } from "@/src/types/types";

export async function fetchUserInfoFrom_Id(userId: string): Promise<User | null> {
	try {
		const response = await fetch(`/api/chat/users/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: userId }),
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
		}

		const data: User = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user info:", error);
		return null;
	}
}
