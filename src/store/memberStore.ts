import { create } from "zustand";

interface MemberStore {
	isDisplayed: boolean;
	setDisplayed: (value: boolean) => void;
}

const useMemberStore = create<MemberStore>((set) => ({
	isDisplayed: true, // Default value
	setDisplayed: (value) => set({ isDisplayed: value }),
}));

export default useMemberStore;
