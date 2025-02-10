import { BulletPoint } from "@/src/types/types";
import React, { useState } from "react";
import { SingleValue } from "react-select";
import { Bounce, toast } from "react-toastify";
import Image from "next/image";
import DescriptionEditor from "@/src/components/misc/descriptionEditor";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import Select from "react-select";

interface props {
	selectOptions: Array<{ value: BulletPoint; label: string }>;
}

function BulletPointEditor({ selectOptions }: props) {
	const [selectedBulletPoint, setSelectedBulletPoint] =
		useState<BulletPoint>();
	const [bulletPointSelectOptions, setBulletPointSelectOptions] =
		useState<Array<{ value: BulletPoint; label: string }>>(selectOptions);
	function newBulletPointSelected(
		newValue: SingleValue<{ value: BulletPoint; label: string }>
	) {
		setSelectedBulletPoint(newValue?.value);
	}

	async function removeBulletPoint() {
		const requestObject = {
			id: selectedBulletPoint?.id,
		};

		try {
			const response = await fetch(`/api/admin/bulletpoints`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestObject),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to delete bullet point: ${response.statusText}`
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
			window.location.reload();
		}
	}

	function addBulletPoint() {
		const tmpBulletPoint = {
			description: "",
			image: "",
			active: false,
		};

		setBulletPointSelectOptions((prevOptions) => [
			...prevOptions,
			{ value: tmpBulletPoint, label: "New Bullet Point" },
		]);

		setSelectedBulletPoint(tmpBulletPoint);
	}

	async function saveBulletPoint() {
		if (!selectedBulletPoint) {
			console.error("No bullet point selected");
			return;
		}

		try {
			if (selectedBulletPoint.id) {
				const bulletPointObject = {
					id: selectedBulletPoint.id,
					description: selectedBulletPoint.description,
					image: selectedBulletPoint.image,
					active: selectedBulletPoint.active,
				};
				const updatedBulletPoint = await fetch(
					`/api/admin/bulletpoints`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(bulletPointObject),
					}
				);

				if (!updatedBulletPoint.ok) {
					throw new Error(
						`Failed to update bullet point: ${updatedBulletPoint.statusText}`
					);
				}
			} else {
				if (!selectedBulletPoint.image) {
					toast.error("Image is required for new bullet points!", {
						position: "bottom-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "light",
						transition: Bounce,
					});
					return;
				}

				const bulletPointObject = {
					description: selectedBulletPoint.description,
					image: selectedBulletPoint.image,
					active: selectedBulletPoint.active,
				};

				const newBulletPoint = await fetch(`/api/admin/bulletpoints`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(bulletPointObject),
				});

				if (!newBulletPoint.ok) {
					throw new Error(
						`Failed to create bullet point: ${newBulletPoint.statusText}`
					);
				}

				const data = await newBulletPoint.json();
				setSelectedBulletPoint(data);
			}
		} catch (error) {
			console.error("Error saving bullet point:", error);
		} finally {
			window.location.reload();
		}
	}

	function BulletPointEditor() {
		const handleInputChange = (
			field: keyof BulletPoint,
			value: string | boolean
		) => {
			setSelectedBulletPoint((prev) => {
				return prev
					? { ...prev, [field]: value }
					: {
							id: "",
							description: "",
							image: "",
							active: false,
							[field]: value,
					  };
			});
		};

		const handleFileChange = async (file: File | null) => {
			if (file) {
				const formData = new FormData();
				formData.append("file", file);

				// Make the POST request to the upload API
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					throw new Error("Failed to upload file");
				}

				// Extract the uploaded image URL from the response
				const uploadedImageObject = await response.json();

				setSelectedBulletPoint((prev) => {
					return prev
						? { ...prev, image: uploadedImageObject.url }
						: {
								id: "",
								description: "",
								active: false,
								image: uploadedImageObject.url,
						  };
				});
			}
		};

		if (!selectedBulletPoint) {
			return "Something went wrong. Code 109!";
		}

		return (
			<div className={style.formDiv}>
				<h2>Edit Bullet Point</h2>
				<form className={style.form}>
					{selectedBulletPoint?.image ? (
						<div>
							<label>Current Image:</label>
							<div className={style.curImageContainer}>
								<Image
									src={selectedBulletPoint?.image}
									fill={true}
									alt={"Current Image"}
								/>
							</div>
						</div>
					) : null}
					<div>
						<DescriptionEditor
							description={selectedBulletPoint.description}
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
							checked={selectedBulletPoint.active}
							onChange={(e) =>
								handleInputChange("active", e.target.checked)
							}
						/>
					</div>
					<div>
						<label htmlFor="bullet_image">Image:</label>
						<input
							name="bullet_image"
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
						onClick={saveBulletPoint}
						className={style.button_default}
					>
						Save
					</button>
				</form>
			</div>
		);
	}

	function displayBulletPointEditor() {
		return (
			<>
				<div className={style.editorHeader}>
					<button
						onClick={addBulletPoint}
						className={style.button_default}
					>
						Add a bullet point
					</button>
					{selectedBulletPoint?.id ? (
						<button
							onClick={removeBulletPoint}
							className={style.button_red}
						>
							Remove bullet point
						</button>
					) : null}
				</div>
				<Select
					instanceId={"bullet-point-selector"}
					options={bulletPointSelectOptions}
					onChange={newBulletPointSelected}
					value={bulletPointSelectOptions.find(
						(option) => option.value === selectedBulletPoint
					)}
					placeholder="Select a bullet point"
				/>
				{selectedBulletPoint ? BulletPointEditor() : null}
			</>
		);
	}
	return displayBulletPointEditor();
}

export default BulletPointEditor;
