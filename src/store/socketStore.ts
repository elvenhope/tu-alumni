import { create } from "zustand";
import { devtools } from "zustand/middleware";
import PartySocket from "partysocket";
import { Message, User } from "@/src/types/types";
import defaultImage from "@/assets/images/defaultImage.jpg";

// Define the shape of incoming WebSocket messages
interface WebSocketMessage {
	type: "local"; // Extendable for more message types
	message: string;
	user: User;
	id?: string;
}

// Define PartySocket options (excluding event handlers)
export interface PartySocketOptions {
	host: string;
	room: string;
	id?: string;
	party?: string;
}

// Define the Zustand store type
interface SocketStore {
	socket: PartySocket | null;
	isConnected: boolean;
	isUpdating: boolean;
	localMessages: Message[];
	groupUpdates: string[];
	initSocket: (options: PartySocketOptions) => void;
	updateSocket: (options: PartySocketOptions) => void;
	sendMessage: (data: WebSocketMessage) => void;
	disconnect: (code?: number, reason?: string) => void;
	clearLocalMessages: () => void;
}

export const useSocketStore = create<SocketStore>()(
	devtools((set, get) => ({
		socket: null,
		isConnected: false,
		isUpdating: false,
		localMessages: [],
		groupUpdates: [],

		initSocket: (options: PartySocketOptions) => {
			const socket = new PartySocket(options);

			socket.onopen = () => {
				console.log("Connected to WebSocket!");
				set({ isConnected: true });
			};

			socket.onmessage = (e: MessageEvent) => {
				try {
					const data: WebSocketMessage = JSON.parse(e.data);
					const parsedData = JSON.parse(data.message);
					const newMessage: Message = {
						id: data.id,
						content: parsedData.message,
						authorFirstName: parsedData.user.firstName,
						authorLastName: parsedData.user.lastName,
						authorId: parsedData.user.id,
						authorImage: parsedData.user.profileImage ?? defaultImage
						// (other properties as needed)
					};

					if (data.type === "local") {
						set((state) => ({
							localMessages: [...state.localMessages, newMessage],
						}));
					}
				} catch (err) {
					console.error("Invalid WebSocket message:", err);
				}
			};

			socket.onclose = () => {
				console.log("Socket closed");
				// Only clear the socket if we are not in the middle of updating
				if (!get().isUpdating) {
					set({ socket: null, isConnected: false });
				} else {
					console.log("Socket update in progress - ignoring onclose event");
				}
			};

			socket.onerror = (e) => {
				console.error("Socket error:", e);
			};

			set({ socket });
		},

		updateSocket: (options: PartySocketOptions) => {
			const { socket, initSocket } = get();
			if (socket) {
				console.log("Updating socket properties:", options);
				// Mark that an update is in progress
				set({ isUpdating: true });
				socket.updateProperties(options);
				socket.reconnect();
				// Reset the update flag after a short delay (adjust as needed)
				setTimeout(() => {
					set({ isUpdating: false });
				}, 500);
			}
		},

		sendMessage: (data: WebSocketMessage) => {
			const { socket } = get();
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(data));
			} else {
				console.error("Cannot send message, socket is not open.");
			}
		},

		disconnect: (code?: number, reason?: string) => {
			const { socket } = get();
			if (socket) {
				socket.close(code, reason);
				console.log("Disconnected!");
				set({ socket: null, isConnected: false });
			}
		},

		clearLocalMessages: () => {
			set({ localMessages: [] });
		}
	}))
);
