"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/OneEventPage.module.scss"
import { Event } from "@/src/types/types"
import Image from "next/image";
import { camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";



function Page() {
	const searchParams = useSearchParams();

	const eventId = searchParams.get("q");

	const [event, setEvent] = useState<Event>();

	const t = useTranslations("events");

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({pageName: "OneEvent", id: eventId, type: "event" }),
			});
			const data = await response.json();
			setEvent(data);
		};

		fetchData();
	}, []);

	if(!event) {
		return (
			<>
				<div>
					<h1>Something went wrong!</h1>
				</div>
			</>
		)
	}

	return (
		<>
			<div className={style.container}>
				<div className={style.header}>
					<h1 className={camingoDosProCdSemiBold.className}>
						{event.headline}
					</h1>
				</div>
				<div className={style.mobileSignUp}>
					<h1 className={camingoDosProCdSemiBold.className}>
						{String(event.day).padStart(2, "0")} /{" "}
						{String(event.month).padStart(2, "0")} /{" "}
						{String(event.year).padStart(2, "0")}
					</h1>
					<Link href={event.registrationLink}>
						<h2>{t("register")}</h2>
					</Link>
				</div>
				<div className={style.pictureContainer}>
					<div className={style.pictureDiv}>
						<div className={style.pictureDescription}>
							<h1 className={camingoDosProCdSemiBold.className}>
								{String(event.day).padStart(2, "0")} /{" "}
								{String(event.month).padStart(2, "0")} /{" "}
								{String(event.year).padStart(2, "0")}
							</h1>
							<Link href={event.registrationLink}>
								<h2>{t("register")}</h2>
							</Link>
						</div>
						<Image
							src={event.image}
							alt="Event Image"
							style={{ objectFit: "cover" }}
							fill={true}
						/>
					</div>
					<div
						className={style.description}
						dangerouslySetInnerHTML={{ __html: event.description }}
					></div>
				</div>
			</div>
		</>
	);
}

export default Page;
