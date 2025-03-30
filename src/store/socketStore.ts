import { create } from "zustand";
import { devtools } from "zustand/middleware";
import PartySocket from "partysocket";
import { Message, User, WebSocketMessage } from "@/src/types/types";


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
	fetchLocalMessages: (groupId: string) => Promise<void>;
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

			socket.onopen = async () => {

				console.log("Connected to WebSocket!");
				set({ isConnected: true });
				
			};

			socket.onmessage = (e: MessageEvent) => {
				try {
					const data: WebSocketMessage = JSON.parse(e.data);
					if (data.user.id) {
						const newMessage: Message = data.message;

						if (data.type === "local") {
							set((state) => ({
								localMessages: [...state.localMessages, newMessage],
							}));
						}
					}
				} catch (err) {
					console.error("Invalid WebSocket message:", err);
				}
			}

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
			const { socket } = get();
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

		fetchLocalMessages: async (groupId: string) => {
			try {
				const response = await fetch("/api/chat/message", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ groupId: groupId }),
				});

				if (!response.ok) {
					throw new Error("Failed to fetch messages");
				}

				const data = await response.json();

				// Assuming 'data.messages' contains the fetched messages
				if (data.messages) {
					// Handle the messages (e.g., store them in a state or update UI)
					set({ localMessages: data.messages });
				}
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		},

		clearLocalMessages: () => {
			set({ localMessages: [] });
		}
	}))
);
