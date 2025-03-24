// useThrottledMessages.ts
import { useEffect, useRef, useState } from "react";
import { Message } from "@/src/types/types";

export function useThrottledMessages(messages: Message[], delay = 100): Message[] {
	const [throttledMessages, setThrottledMessages] = useState<Message[]>(messages);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		// Clear any existing timer
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		// Set a new timer to update the throttled messages
		timeoutRef.current = setTimeout(() => {
			setThrottledMessages(messages);
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [messages, delay]);

	return throttledMessages;
}
