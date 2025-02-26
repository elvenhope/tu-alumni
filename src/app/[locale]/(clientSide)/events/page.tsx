"use client";

import { EventsPageContent, Event } from "@/src/types/types";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import style from "@/src/styles/clientSide/EventPage.module.scss";
import Image from "next/image";
import { camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { IoCalendarOutline } from "react-icons/io5";
import CalendarOverlay from "@/src/components/clientSide/eventPage/CalendarOverlay";
import { Link } from "@/src/i18n/routing";
import { generateUrlName } from "@/src/lib/generateUrlName";
import LoadingSpinner from "@/src/components/misc/LoadingSpinner";
import { useLoading } from "@/src/components/misc/LoadingContext";

function Page() {
	const t = useTranslations("events");
	const [content, setContent] = useState<EventsPageContent>();
	const [events, setEvents] = useState<Event[]>();
	const [displayedEvents, setDisplayedEvents] = useState<Event[]>();
	const locale = useLocale();
	const { setLoading } = useLoading();

	useEffect(() => {
		setLoading(true)
		const fetchData = async () => {
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pageName: "Events" }),
			});
			const data = await response.json();
			setContent(data.data);
			setEvents(data.data.events);
			setDisplayedEvents(data.data.events);
			setLoading(false);
		};

		fetchData();
	}, []);


	function formatEventDate(event: Event) {
		const { day, month, year } = event;
		return new Date(year, month - 1, day).toISOString();
	}

	function dateSelected(date: Date) {
		const eventsOnTheDate = events?.filter(
			(e) =>
				e.day === date.getDate() &&
				e.month === date.getMonth() + 1 &&
				e.year === date.getFullYear()
		);

		setDisplayedEvents(eventsOnTheDate);
	}

	function resetDisplayedEvents() {
		setDisplayedEvents(events);
	}

	function eventDesign(event: Event, index: number) {
		const monthText = new Date(
			event.year,
			event.month - 1,
			event.day
		).toLocaleString(locale, { month: "short" });

		return (
			<div className={style.event} key={index}>
				<div
					className={
						style.eventDate +
						" " +
						camingoDosProCdSemiBold.className
					}
				>
					<h1>{String(event.day).padStart(2, "0")}</h1>
					<h1>{monthText}</h1>
					<h1>{event.year}</h1>
				</div>
				<div className={style.eventPicture}>
					<Image
						src={event.image}
						alt="Event Image"
						fill={true}
						style={{ objectFit: "cover" }}
					/>
				</div>
				<div className={style.eventDescription}>
					<Link
						href={
							"/events/" +
							generateUrlName(event.headline) +
							"?q=" +
							event.id
						}
					>
						<h1 className={camingoDosProCdSemiBold.className}>
							{event.headline}
						</h1>
					</Link>
					{event.registrationLink?.length > 0 ? (
						<a href={event.registrationLink}>{t("register")}</a>
					) : null}
					<div
						className={style.description}
						dangerouslySetInnerHTML={{
							__html: event.description,
						}}
					></div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className={style.container}>
					<div className={style.header}>
						<h1 onClick={() => resetDisplayedEvents()}>
							{t("headerText")}
						</h1>
						<CalendarOverlay
							events={events ?? []}
							locale={locale}
							dateSelected={dateSelected}
						/>
					</div>
					<div className={style.content}>
						{displayedEvents && displayedEvents.length ? (
							<>
								<div className={style.grid}>
									{displayedEvents
										?.slice(0, 10)
										.map((event, index) =>
											eventDesign(event, index)
										)}
								</div>
								<div className={style.grid}>
									{displayedEvents
										?.slice(10)
										.map((event, index) =>
											eventDesign(event, index)
										)}
								</div>
							</>
						) : (
							<h1>{t("noEvents")}</h1>
						)}
					</div>
				</div>
		</>
	);
}

export default Page;
