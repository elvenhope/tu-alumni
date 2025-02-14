'use client';

import React, { useEffect, useState } from "react";
import { Event } from "@/src/types/types";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import EventEditor from "@/src/components/adminSide/adminHome/EventEditor";

function Page() {
	const [events, setEvents] = useState<Event[]>([]);
	const [eventOptions, setEventOptions] = useState<Array<{ value: Event; label: string }>>([]);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const eventsResponse = await fetch("/api/admin/events");
				if (!eventsResponse.ok) {
					throw new Error(
						`Failed to fetch events: ${eventsResponse.statusText}`
					);
				}

				const EventData: Event[] = await eventsResponse.json();
				setEvents(EventData);

				const EventOptions = EventData.map((event) => ({
					value: event,
					label: event.headline,
				}));

				setEventOptions(EventOptions);
			} catch (err) {
				console.log(err);
			}
		};

		fetchInfo();
	}, []);

	return (
		<>
			<div className={style.content}>
				<h1>Editing Events</h1>
				<div className={style.selections}>
					<EventEditor selectOptions={eventOptions} />
				</div>
			</div>
		</>
	);
}

export default Page;
