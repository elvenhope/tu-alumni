import { Headline } from "@/src/types/types";
import React, { useState } from "react";
import { SingleValue } from "react-select";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import DescriptionEditor from "@/src/components/misc/descriptionEditor";
import Select from "react-select";

interface props {
	selectOptions: Array<{ value: Headline; label: string }>;
}

function HeadlineEditor({ selectOptions }: props) {
	const [selectedHeadline, setSelectedHeadline] = useState<Headline>();
	const [headlineSelectOptions, setHeadlineSelectOptions] =
		useState<Array<{ value: Headline; label: string }>>(selectOptions);

	function newHeadlineSelected(
		newValue: SingleValue<{ value: Headline; label: string }>
	) {
		setSelectedHeadline(newValue?.value);
	}

	async function removeHeadline() {
		const requestObject = {
			id: selectedHeadline?.id,
		};

		try {
			const updatedHeadline = await fetch(`/api/admin/headings`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestObject),
			});

			if (!updatedHeadline.ok) {
				throw new Error(
					`Failed to delete headline: ${updatedHeadline.statusText}`
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
			window.location.reload();
		}
	}

	function addHeadline() {
		// const newHeader = await new headingModel({
		// 	heading: "Untitled",
		// 	author: "Author not set",
		// 	description: "New Description"
		// });
		const tmpHeadline = {
			headline: "Untitled",
			author: "Unknown",
			description: "",
			active: false,
		};

		setHeadlineSelectOptions((prevOptions) => [
			...prevOptions,
			{ value: tmpHeadline, label: tmpHeadline.headline },
		]);

		setSelectedHeadline(tmpHeadline);
	}

	async function saveHeadline() {
		if (!selectedHeadline) {
			console.error("No headline selected");
			return;
		}

		try {
			if (selectedHeadline.id) {
				const headerObject = {
					id: selectedHeadline.id,
					headline: selectedHeadline.headline,
					author: selectedHeadline.author,
					description: selectedHeadline.description,
					active: selectedHeadline.active,
				};
				// If ID exists, update the existing headline
				const updatedHeadline = await fetch(`/api/admin/headings`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(headerObject),
				});

				if (!updatedHeadline.ok) {
					throw new Error(
						`Failed to update headline: ${updatedHeadline.statusText}`
					);
				}

				console.log("Headline updated successfully");
			} else {
				const headerObject = {
					headline: selectedHeadline.headline,
					author: selectedHeadline.author,
					description: selectedHeadline.description,
					active: selectedHeadline.active,
				};
				// If no ID, create a new headline
				const newHeadline = await fetch(`/api/admin/headings`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(headerObject),
				});

				if (!newHeadline.ok) {
					throw new Error(
						`Failed to create headline: ${newHeadline.statusText}`
					);
				}

				const data = await newHeadline.json();
				console.log("Headline created successfully:", data);
				setSelectedHeadline(data); // Update the selected headline with the newly created one
			}
		} catch (error) {
			console.error("Error saving headline:", error);
		} finally {
			window.location.reload();
		}
	}

	function HeadlineEditor() {
		const handleInputChange = (
			field: keyof Headline,
			value: string | boolean
		) => {
			setSelectedHeadline((prev) => {
				// Ensure `prev` exists; if not, initialize it with default values
				return prev
					? { ...prev, [field]: value }
					: {
							id: "",
							headline: "",
							author: "",
							description: "",
							active: false,
							[field]: value,
					  };
			});
		};

		if (!selectedHeadline) {
			return "Something went wrong. Code 107!";
		}

		return (
			<div className={style.formDiv}>
				<h2>Edit Headline</h2>
				<form className={style.form}>
					<div>
						<label htmlFor="headline_headline">Headline:</label>
						<input
							name="headline_headline"
							type="text"
							value={selectedHeadline.headline || ""}
							onChange={(e) =>
								handleInputChange("headline", e.target.value)
							}
						/>
					</div>
					<div>
						<label htmlFor="active">Active:</label>
						<input
							id="active"
							type="checkbox"
							checked={selectedHeadline.active}
							onChange={(e) =>
								handleInputChange("active", e.target.checked)
							}
						/>
					</div>
					<div>
						<label htmlFor="headline_author">Author:</label>
						<input
							name="headline_author"
							type="text"
							value={selectedHeadline.author || ""}
							onChange={(e) =>
								handleInputChange("author", e.target.value)
							}
						/>
					</div>
					<div>
						<DescriptionEditor
							description={selectedHeadline.description}
							onUpdateDescription={(value) => {
								handleInputChange("description", value);
							}}
						/>
					</div>
					<button
						type="button"
						onClick={saveHeadline}
						className={style.button_default}
					>
						Save
					</button>
				</form>
			</div>
		);
	}

	function displayHeadlineEditor() {
		return (
			<>
				<div className={style.editorHeader}>
					<button
						onClick={addHeadline}
						className={style.button_default}
					>
						Add a headline
					</button>
					{selectedHeadline?.id ? (
						<button
							onClick={removeHeadline}
							className={style.button_red}
						>
							Remove a headline
						</button>
					) : null}
				</div>
				<Select
					instanceId={"headline-selector"}
					options={headlineSelectOptions}
					onChange={newHeadlineSelected}
					value={headlineSelectOptions.find(
						(option) => option.value === selectedHeadline
					)}
					placeholder="Select a headline"
				/>
				{selectedHeadline ? HeadlineEditor() : null}
			</>
		);
	}
	return displayHeadlineEditor();
}

export default HeadlineEditor;
