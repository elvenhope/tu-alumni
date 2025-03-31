import { create } from "zustand";
import { fetchUserInfoFrom_Id } from "@/src/lib/fetchUserInfo"; // Adjust path as needed
import { Group, User } from "@/src/types/types";

// Zustand store interface
interface UserState {
	user: User | null;
	isLoading: boolean;
	error: string | null;
	selectedGroup: Group | null;
	setSelectedGroup: (group: Group | null) => void;
	fetchUser: (userId: string) => Promise<void>;
	updateUser: (userId: string, updatedUserData: Partial<User>) => Promise<void>;
}

// Create Zustand store
export const useUserStore = create<UserState>((set) => ({
	user: null,
	isLoading: false,
	error: null,
	selectedGroup: null,

	setSelectedGroup: (group: Group | null) => set({ selectedGroup: group }),

	fetchUser: async (userId) => {
		set({ isLoading: true, error: null }); // Set loading state
		try {
			const user = await fetchUserInfoFrom_Id(userId);
			if (user) {
				set({ user, isLoading: false });
			} else {
				set({ user: null, isLoading: false, error: "User not found" });
			}
		} catch (err) {
			set({ user: null, isLoading: false, error: "Failed to fetch user data" });
		}
	},

	updateUser: async (userId, updatedUserData) => {
		set({ isLoading: true, error: null }); // Set loading state

		try {
			const payload = {
				userId,
				...updatedUserData,
			}
			const response = await fetch(`/api/chat/users`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				const updatedUser = await response.json();
				set({ user: updatedUser, isLoading: false });
			} else {
				set({ isLoading: false, error: "Failed to update user data" });
			}
		} catch (err) {
			set({ isLoading: false, error: "Failed to update user data" });
		}
	},
}));
