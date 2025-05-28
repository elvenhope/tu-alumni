'use client'

import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/HomePage.module.scss";
import heroImage from "@/assets/images/heroImage.png";
import Image from "next/image";
import { camingoDosProCdExtraBold, camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { useTranslations } from "next-intl";
import { HomePageContent } from "@/src/types/types";
import { useLoading } from "@/src/components/misc/LoadingContext";
import { Link } from "@/src/i18n/routing";
import { generateUrlName } from "@/src/lib/generateUrlName";
import Modal from "@/src/components/misc/Modal"; // Create this component (see below)


export default function Page() {
	const t = useTranslations("homePage");
	const [content, setContent] = useState<HomePageContent>({ headlines: [], events: [], bulletPoints: [] });
	const { setLoading } = useLoading();
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedHeadline, setSelectedHeadline] = useState<{
		headline: string;
		description: string;
	} | null>(null);
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		if (content.headlines.length === 0) return;

		const interval = setInterval(() => {
			setSelectedIndex((prev) => (prev + 1) % content.headlines.length);
		}, 3000); // 5 seconds

		return () => clearInterval(interval);
	}, [content.headlines.length]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pageName: "Home" }),
			});
			const data = await response.json();
			setContent(data.data);
			setLoading(false);
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
						priority={true}
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
							></div>
						</div>
					))}
				</div>
			</div>
			<div className={style.headlineSection}>
				{/* Carousel Items */}
				<div
					className={style.carousel}
					style={
						{
							"--items": content.headlines.length,
							"--position": selectedIndex + 1,
						} as React.CSSProperties
					}
				>
					{content.headlines.map((headlineObject, index) => (
						<div
							key={index}
							className={style.headline}
							style={
								{ "--offset": index + 1 } as React.CSSProperties
							}
							onClick={() => {
								setSelectedHeadline({
									headline: headlineObject.headline,
									description: headlineObject.description,
								});
								setModalOpen(true);
							}}
						>
							<p className={style.headlineTitle}>
								{headlineObject.headline}
							</p>
							<p className={style.headlineAuthor}>
								{headlineObject.author}
							</p>
							<div
								className={style.headlineDescription}
								dangerouslySetInnerHTML={{
									__html: headlineObject.description
										.replace(/<p>/g, "<span>")
										.replace(/<\/p>/g, "</span><br>"),
								}}
							/>
						</div>
					))}
				</div>
				{/* Radio Inputs (hidden, but functional) */}
				<div className={style.radioButtons}>
					{content.headlines.map((_, index) => (
						<input
							key={`radio-${index}`}
							type="radio"
							name="headline-position"
							checked={selectedIndex === index}
							onChange={() => setSelectedIndex(index)}
							className={style.radioInput}
						/>
					))}
				</div>
			</div>
			<div className={style.eventSection}>
				{content.events.length > 0
					? content.events.map((eventObject, index) => {
							return (
								<div key={index} className={style.event}>
									<Link
										href={
											"/events/" +
											generateUrlName(
												eventObject.headline
											) +
											"?q=" +
											eventObject.id
										}
									>
										<div
											className={
												style.eventImageContainer
											}
										>
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
									</Link>
									<div className={style.eventContent}>
										<Link
											href={
												"/events/" +
												generateUrlName(
													eventObject.headline
												) +
												"?q=" +
												eventObject.id
											}
											className={style.eventLink}
										>
											<p
												className={
													camingoDosProCdSemiBold.className +
													" " +
													style.eventTitle
												}
											>
												{eventObject.headline}
											</p>
										</Link>
										<div
											className={style.eventDescription}
											dangerouslySetInnerHTML={{
												__html: eventObject.description
													.replace(/<p>/g, "<span>")
													.replace(
														/<\/p>/g,
														"</span><br>"
													),
											}}
										></div>
									</div>
								</div>
							);
					  })
					: null}
			</div>
			{modalOpen && selectedHeadline && (
				<Modal onClose={() => setModalOpen(false)}>
					<h2
						className={
							camingoDosProCdSemiBold.className +
							" " +
							style.modalTitle
						}
					>
						{selectedHeadline.headline}
					</h2>
					<div
						className={style.modalDescription}
						dangerouslySetInnerHTML={{
							__html: selectedHeadline.description,
						}}
					/>
				</Modal>
			)}
		</>
	);
}
