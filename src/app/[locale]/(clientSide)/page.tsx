'use client'

import React, { useEffect, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import style from "@/src/styles/clientSide/HomePage.module.scss";
import heroImage from "@/assets/images/heroImage.png";
import Image from "next/image";
import { camingoDosProCdExtraBold, camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { useTranslations } from "next-intl";
import boardIcon from "@/assets/images/boardIcon.svg";
import hatIcon from "@/assets/images/hatIcon.svg";
import peopleIcon from "@/assets/images/peopleIcon.svg";
import { HomePageContent } from "@/src/types/types";

export default function Page() {
	const t = useTranslations("homePage");
	const [content, setContent] = useState<HomePageContent>({ headlines: [], events: [], bulletPoints: [] });

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pageName: "Home" }),
			});
			const data = await response.json();
			setContent(data.data);
		};

		fetchData();
	}, []);

	return (
		<>
			<div className={style.container}>
				<div className={style.textSection}>
					<p className={camingoDosProCdExtraBold.className}>
						{t("welcomeMsg")}
					</p>
				</div>
				<div className={style.imageSection}>
					<Image
						src={heroImage}
						alt="logo"
						fill={true}
						style={{
							objectFit: "cover", // cover, contain, none
						}}
					/>
				</div>
			</div>
			<div className={style.aboutUsSection}>
				<p
					className={
						style.aboutUsSection_header +
						" " +
						camingoDosProCdExtraBold.className
					}
				>
					{t("aboutUS")}
				</p>
				<div className={style.bulletPoints}>
					{content.bulletPoints.map((point) => (
						<div key={point.id} className={style.point}>
							<Image
								src={point.image}
								width={115}
								height={115}
								alt="bullet point icon"
							/>
							<div
								className={style.pointText}
								dangerouslySetInnerHTML={{
									__html: point.description,
								}}
							>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className={style.headlineSection}>
				{content.headlines.length > 0
					? content.headlines.map((headlineObject, index) => {
							return (
								<div key={index} className={style.headline}>
									<p
										className={
											camingoDosProCdSemiBold.className +
											" " +
											style.headlineTitle
										}
									>
										{headlineObject.headline}
									</p>
									<p className={style.headlineAuthor}>
										{headlineObject.author}
									</p>
									<div
										className={style.headlineDescription}
										dangerouslySetInnerHTML={{
											__html: headlineObject.description,
										}}
									/>
								</div>
							);
					  })
					: null}
			</div>
			<div className={style.eventSection}>
				{content.events.length > 0
					? content.events.map((eventObject, index) => {
							return (
								<div key={index} className={style.event}>
									<div className={style.eventImageContainer}>
										<div className={style.eventImage}>
											<Image
												src={eventObject.image}
												alt="event image"
												fill={true}
												style={{
													objectFit: "cover", // cover, contain, none
												}}
											/>
										</div>
										<div
											className={
												style.eventDate +
												" " +
												camingoDosProCdSemiBold.className
											}
										>
											<p>
												{String(
													eventObject.day
												).padStart(2, "0")}{" "}
												/{" "}
												{String(
													eventObject.month
												).padStart(2, "0")}
											</p>
										</div>
									</div>
									<div className={style.eventContent}>
										<p
											className={
												camingoDosProCdSemiBold.className +
												" " +
												style.eventTitle
											}
										>
											{eventObject.headline}
										</p>
										<div
											className={style.eventDescription}
											dangerouslySetInnerHTML={{
												__html: eventObject.description,
											}}
										></div>
									</div>
								</div>
							);
					  })
					: null}
			</div>
		</>
	);
}
