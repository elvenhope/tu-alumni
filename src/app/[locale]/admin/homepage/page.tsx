"use client";

import { Headline, Event, BulletPoint } from "@/src/types/types";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import Select from "react-select";
import EventEditor from "@/src/components/adminSide/adminHome/EventEditor";
import HeadlineEditor from "@/src/components/adminSide/adminHome/HeadlineEditor";
import BulletPointEditor from "@/src/components/adminSide/adminHome/BulletPointEditor";

export default function AdminPage() {
	const { data: session } = useSession();

	const [events, setEvents] = useState<Array<Event>>([]);

	const [headlines, setHeadlines] = useState<Array<Headline>>([]);

	const [bulletPoints, setBulletPoints] = useState<Array<BulletPoint>>([]);

	const [selectedCategory, setSelectedCategory] = useState<string>();


	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const headingsResponse = await fetch("/api/admin/headings");
				if (!headingsResponse.ok) {
					throw new Error(
						`Failed to fetch headers: ${headingsResponse.statusText}`
					);
				}

				const headingsData: Headline[] = await headingsResponse.json();
				setHeadlines(headingsData);


				const eventsResponse = await fetch("/api/admin/events");
				if (!eventsResponse.ok) {
					throw new Error(
						`Failed to fetch events: ${eventsResponse.statusText}`
					);
				}

				const eventsData: Event[] = await eventsResponse.json();
				setEvents(eventsData);

				// Inside your existing useEffect
				const bulletPointsResponse = await fetch(
					"/api/admin/bulletpoints"
				);
				if (!bulletPointsResponse.ok) {
					throw new Error(
						`Failed to fetch bullet points: ${bulletPointsResponse.statusText}`
					);
				}

				const bulletPointsData: BulletPoint[] =
					await bulletPointsResponse.json();
				setBulletPoints(bulletPointsData);
			} catch (err) {
				console.log(err);
			}
		};

		fetchInfo();
	}, []);

	const categorySelector = [
		{ value: "Headlines", label: "Headlines" },
		{ value: "Events", label: "Events" },
		{ value: "BulletPoints", label: "Bullet Points" },
	];

	if (!session) {
		return <p>Access Denied</p>;
	}

	if (session.user.role !== "admin") {
		return <p>Access Denied</p>;
	}


	function newCategorySelected(
		newValue: SingleValue<{ value: string; label: string }>
	) {
		setSelectedCategory(newValue?.value);
	}

	function initialOptionsEvents():  Array<{ value: Event; label: string }>  {
		const returnObject = events.map((event) => ({
			value: event,
			label: event.headline,
		}));
		
		return returnObject;
	}

	function initialOptionsHeadlines(): Array<{ value: Headline; label: string }> {
		const returnObject = headlines.map((headline) => ({
			value: headline,
			label: headline.headline,
		}));

		return returnObject;
	}

	function initialOptionsBulletPoints(): Array<{ value: BulletPoint; label: string }> {
		const returnObject = bulletPoints.map((point) => ({
			value: point,
			label: point.description,
		}));

		return returnObject;
	}

	return (
		<>
			<div className={style.content}>
				<h1>Editing Homepage</h1>
				<div className={style.selections}>
					<Select
						options={categorySelector}
						onChange={newCategorySelected}
						value={categorySelector.find(
							(option) => option.value === selectedCategory
						)}
						placeholder="Select a category"
						className={style.selector}
					/>
					{selectedCategory === "Headlines"
						? <HeadlineEditor selectOptions={initialOptionsHeadlines()} />
						: null}
					{selectedCategory === "Events"
						? <EventEditor selectOptions={initialOptionsEvents()}/>
						: null}
					{selectedCategory === "BulletPoints"
						? <BulletPointEditor selectOptions={initialOptionsBulletPoints()} />
						: null}
				</div>
			</div>
		</>
	);
}
