"use client";

import { AboutUsContent } from "@/src/types/types";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/AboutUsPage.module.scss";
import Image from "next/image";
import LoadingSpinner from "@/src/components/misc/LoadingSpinner";
import { useLoading } from "@/src/components/misc/LoadingContext";

function Page() {
	const t = useTranslations("aboutUs");
	const [content, setContent] = useState<AboutUsContent>();
	const [selectedGallery, setSelectedGallery] = useState<string>();
	const [imagesToDisplay, setImagesToDisplay] = useState<string[]>();
	const { isLoading, setLoading } = useLoading();
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	);

	
	useEffect(() => {
		setLoading(true);
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

	// Function to open the lightbox
	function openLightbox(index: number) {
		setSelectedImageIndex(index);
	}

	// Function to close the lightbox
	function closeLightbox() {
		setSelectedImageIndex(null);
	}

	// Function to go to the previous image
	function prevImage() {
		if (selectedImageIndex !== null && imagesToDisplay) {
			setSelectedImageIndex((prev) =>
				prev! > 0 ? prev! - 1 : imagesToDisplay.length - 1
			);
		}
	}

	// Function to go to the next image
	function nextImage() {
		if (selectedImageIndex !== null && imagesToDisplay) {
			setSelectedImageIndex((prev) =>
				prev! < imagesToDisplay.length - 1 ? prev! + 1 : 0
			);
		}
	}

	// Close modal on Escape key press
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				closeLightbox();
			} else if (event.key === "ArrowLeft") {
				prevImage();
			} else if (event.key === "ArrowRight") {
				nextImage();
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [selectedImageIndex]);

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

	return (
		<>
			<div className={style.container}>
				{displayMainArticle()}
				{displayGalleries()}
				<div className={style.galleryImagesContainer}>
					{imagesToDisplay?.map((image, index) => (
						<div
							key={index}
							className={style.galleryImage}
							onClick={() => openLightbox(index)}
						>
							<Image
								src={image}
								fill={true}
								style={{ objectFit: "cover" }}
								alt="Gallery Image"
							/>
						</div>
					))}
				</div>
			</div>

			{/* Lightbox Modal */}
			{selectedImageIndex !== null && imagesToDisplay && (
				<div className={style.lightbox} onClick={closeLightbox}>
					<button
						className={style.prevButton}
						onClick={(e) => {
							e.stopPropagation();
							prevImage();
						}}
					>
						❮
					</button>
					<Image
						src={imagesToDisplay[selectedImageIndex]}
						fill={true}
						style={{ objectFit: "contain" }}
						alt="Full Image"
					/>
					<button
						className={style.nextButton}
						onClick={(e) => {
							e.stopPropagation();
							nextImage();
						}}
					>
						❯
					</button>
					<button
						className={style.closeButton}
						onClick={closeLightbox}
					>
						✕
					</button>
				</div>
			)}
		</>
	);
}

export default Page;
