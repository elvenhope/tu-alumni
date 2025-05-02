import { Gallery } from "@/src/types/types";
import React, { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import DescriptionEditor from "@/src/components/misc/descriptionEditor";
import Select from "react-select";
import Image from "next/image";
import { useLoading } from "../../misc/LoadingContext";
import { set } from "mongoose";

interface props {
	selectOptions: Array<{ value: Gallery; label: string }>;
}

function GalleryEditor({ selectOptions }: props) {
	const [selectedGallery, setSelectedGallery] = useState<Gallery>();
	const [GallerySelectOptions, setGallerySelectOptions] =
		useState<Array<{ value: Gallery; label: string }>>(selectOptions);
	const { setLoading } = useLoading();


	useEffect(() => {
		console.log(GallerySelectOptions);
		console.log(selectOptions);
		if (selectOptions) {
			setGallerySelectOptions(selectOptions);
		}
	}, [selectOptions]); 

	function newGallerySelected(
		newValue: SingleValue<{ value: Gallery; label: string }>
	) {
		setSelectedGallery(newValue?.value);
	}

	async function removeGallery() {
		const requestObject = {
			id: selectedGallery?.id,
		};

		try {
			const updatedGallery = await fetch(`/api/admin/galleries`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestObject),
			});

			if (!updatedGallery.ok) {
				throw new Error(
					`Failed to delete Gallery: ${updatedGallery.statusText}`
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
			window.location.reload();
		}
	}

	function addGallery() {
		// const newHeader = await new headingModel({
		// 	heading: "Untitled",
		// 	author: "Author not set",
		// 	description: "New Description"
		// });
		const tmpGallery = {
			thumbnail: "",
			day: 1,
			month: 1,
			year: 2021,
			headline: "Untitled",
			description: "",
			active: false,
			storageName: "",
		};

		setGallerySelectOptions((prevOptions) => [
			...prevOptions,
			{ value: tmpGallery, label: tmpGallery.headline },
		]);

		setSelectedGallery(tmpGallery);
	}

	async function saveGallery() {
		if (!selectedGallery) {
			console.error("No Gallery selected");
			return;
		}

		try {
			if (selectedGallery.id) {
				const headerObject = {
					id: selectedGallery.id,
					headline: selectedGallery.headline,
					description: selectedGallery.description,
					active: selectedGallery.active,
					day: selectedGallery.day,
					month: selectedGallery.month,
					year: selectedGallery.year,
					thumbnail: selectedGallery.thumbnail,
					storageName: selectedGallery.storageName,
				};
				// If ID exists, update the existing Gallery
				const updatedGallery = await fetch(`/api/admin/galleries`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(headerObject),
				});

				if (!updatedGallery.ok) {
					throw new Error(
						`Failed to update Gallery: ${updatedGallery.statusText}`
					);
				}

				console.log("Gallery updated successfully");
			} else {
				const headerObject = {
					headline: selectedGallery.headline,
					description: selectedGallery.description,
					active: selectedGallery.active,
					day: selectedGallery.day,
					month: selectedGallery.month,
					year: selectedGallery.year,
					thumbnail: selectedGallery.thumbnail,
					storageName: selectedGallery.storageName,
				};
				// If no ID, create a new Gallery
				const newGallery = await fetch(`/api/admin/galleries`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(headerObject),
				});

				if (!newGallery.ok) {
					throw new Error(
						`Failed to create Gallery: ${newGallery.statusText}`
					);
				}

				const data = await newGallery.json();
				console.log("Gallery created successfully:", data);
				setSelectedGallery(data); // Update the selected Gallery with the newly created one
			}
		} catch (error) {
			console.error("Error saving Gallery:", error);
		} finally {
			window.location.reload();
		}
	}

	function GalleryEditor() {
		const handleInputChange = (
			field: keyof Gallery,
			value: string | boolean
		) => {
			setSelectedGallery((prev) => {
				// Ensure `prev` exists; if not, initialize it with default values
				return prev
					? { ...prev, [field]: value }
					: {
							id: "",
							thumbnail: "",
							day: 1,
							month: 1,
							year: 2021,
							headline: "Untitled",
							description: "",
							active: false,
							storageName: "",
							[field]: value,
					  };
			});
		};

		const handleFileChange = async (file: File | null) => {
			if (file) {
				setLoading(true);
				const formData = new FormData();
				formData.append("file", file);

				// Make the POST request to the upload API
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					setLoading(false);
					throw new Error("Failed to upload file");
				}
				setLoading(false);

				// Extract the uploaded image URL from the response
				const uploadedImageObject = await response.json();

				setSelectedGallery((prev) => {
					return prev
						? { ...prev, thumbnail: uploadedImageObject.url }
						: {
								id: "",
								thumbnail: uploadedImageObject.url,
								day: 1,
								month: 1,
								year: 2021,
								headline: "Untitled",
								description: "",
								storageName: "",
								active: false,
						  };
				});
			}
		};

		if (!selectedGallery) {
			return "Something went wrong. Code 107!";
		}

		return (
			<div className={style.formDiv}>
				<h2>Edit Gallery</h2>
				<form className={style.form}>
					{selectedGallery?.thumbnail ? (
						<div>
							<label htmlFor="event_day">Current Thumbnail:</label>
							<div className={style.curImageContainer}>
								<Image
									src={selectedGallery?.thumbnail}
									fill={true}
									alt={"Current Image"}
								/>
							</div>
						</div>
					) : null}
					<div>
						<label htmlFor="gallery_headline">Headline:</label>
						<input
							name="gallery_headline"
							type="text"
							value={selectedGallery.headline || ""}
							onChange={(e) =>
								handleInputChange("headline", e.target.value)
							}
						/>
					</div>
					<div>
						<label htmlFor="gallery_storageName">
							Google drive folder name:
						</label>
						<input
							name="gallery_storageName"
							type="text"
							value={selectedGallery.storageName || ""}
							onChange={(e) =>
								handleInputChange("storageName", e.target.value)
							}
						/>
					</div>
					<div>
						<DescriptionEditor
							description={selectedGallery.description}
							onUpdateDescription={(value) => {
								handleInputChange("description", value);
							}}
						/>
					</div>
					<div>
						<label htmlFor="active">Active:</label>
						<input
							id="active"
							type="checkbox"
							checked={selectedGallery.active}
							onChange={(e) =>
								handleInputChange("active", e.target.checked)
							}
						/>
					</div>
					<div>
						<label htmlFor="gallery_image">Thumbnail:</label>
						<input
							name="gallery_image"
							type="file"
							accept="image/png, image/jpeg, image/jpg, image/webp"
							onChange={(e) =>
								handleFileChange(
									e.target.files ? e.target.files[0] : null
								)
							}
						/>
					</div>
					<button
						type="button"
						onClick={saveGallery}
						className={style.button_default}
					>
						Save
					</button>
				</form>
			</div>
		);
	}

	function displayGalleryEditor() {
		return (
			<>
				<div className={style.editorHeader}>
					<button
						onClick={addGallery}
						className={style.button_default}
					>
						Add a Gallery
					</button>
					{selectedGallery?.id ? (
						<button
							onClick={removeGallery}
							className={style.button_red}
						>
							Remove a Gallery
						</button>
					) : null}
				</div>
				<Select
					instanceId={"Gallery-selector"}
					options={GallerySelectOptions}
					onChange={newGallerySelected}
					value={GallerySelectOptions.find(
						(option) => option.label === selectedGallery?.headline
					)}
					placeholder="Select a Gallery"
				/>
				{selectedGallery ? GalleryEditor() : null}
			</>
		);
	}
	return displayGalleryEditor();
}

export default GalleryEditor;
