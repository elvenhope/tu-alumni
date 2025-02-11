"use client";

import { AboutUsContent } from "@/src/types/types";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/AboutUsPage.module.scss";
import Image from "next/image";

function Page() {
	const t = useTranslations("aboutUs");
	const [content, setContent] = useState<AboutUsContent>();
	const [selectedGallery, setSelectedGallery] = useState<string>();
	const [imagesToDisplay, setImagesToDisplay] = useState<string[]>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pageName: "About Us" }),
			});
			const data = await response.json();
			setContent(data.data);
			setLoading(false);
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (!selectedGallery) return;
		const imageObject = content?.galleryImages.find(
			(gallery) => gallery.storageName === selectedGallery
		);
		console.log(imageObject);
		setImagesToDisplay(imageObject?.images.map((image) => image.url));
	}, [selectedGallery]);

	function displayMainArticle() {
		if (!content) return null;
		return (
			<div className={style.mainArticleContainer}>
				<div className={style.mainArticleImage}>
					<div>
						<Image
							src={content.mainArticle.image}
							fill={true}
							style={{ objectFit: "contain" }}
							alt="About Us Image"
						/>
					</div>
				</div>
				<div className={style.mainArticleText}>
					<h1>{content.mainArticle.headline}</h1>
					<div
						dangerouslySetInnerHTML={{
							__html: content.mainArticle.description,
						}}
					></div>
				</div>
			</div>
		);
	}

	function displayGalleries() {
		if (!content) return null;
		return (
			<div className={style.galleryContainer}>
				{content.galleries.map((gallery) => (
					<div
						key={gallery.id}
						className={style.gallery}
						onClick={() => setSelectedGallery(gallery.storageName)}
					>
						<div className={style.galleryImage}>
							<Image
								src={gallery.thumbnail}
								fill={true}
								style={{ objectFit: "cover" }}
								alt="Gallery Image"
							/>
						</div>
						<div className={style.galleryText}>
							<h1>Photo Album from</h1>
							<h1>{gallery.headline}</h1>
							<p className={style.date}>
								{gallery.day}/{gallery.month}/{gallery.year}
							</p>
							<div
								dangerouslySetInnerHTML={{
									__html: gallery.description,
								}}
							></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	function LoadingSpinner() {
		return (
			<div className={style.loadingContainer}>
				<div className={style.spinner}></div>
			</div>
		);
	}

	return (
		<>
			{loading ? (
				LoadingSpinner()
			) : (
				<div className={style.container}>
					{displayMainArticle()}
					{displayGalleries()}
					<div className={style.galleryImagesContainer}>
						{imagesToDisplay?.map((image, index) => (
							<div key={index} className={style.galleryImage}>
								<Image
									src={image}
									fill={true}
									style={{ objectFit: "contain" }}
									alt="Gallery Image"
								/>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
}

export default Page;
