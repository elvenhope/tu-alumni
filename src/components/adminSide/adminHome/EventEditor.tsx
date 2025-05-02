import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { toast, Bounce } from "react-toastify";
import DescriptionEditor from "@/src/components/misc/descriptionEditor";
import { Event } from "@/src/types/types";
import Image from "next/image";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import { useLoading } from "../../misc/LoadingContext";

interface props {
	selectOptions: Array<{ value: Event; label: string }>;
}

function EventEditor({selectOptions}: props) {
	const [selectedEvent, setSelectedEvent] = useState<Event>();
	const [eventSelectOptions, setEventSelectOptions] =
		useState<Array<{ value: Event; label: string }>>(selectOptions);
	
	const { setLoading } = useLoading();


	useEffect(() => {
		setEventSelectOptions(selectOptions);
	}, [selectOptions])	

	function newEventSelected(
		newValue: SingleValue<{ value: Event; label: string }>
	) {
		setSelectedEvent(newValue?.value);
	}
	async function removeEvent() {
		const requestObject = {
			id: selectedEvent?.id,
		};

		try {
			const updatedEvent = await fetch(`/api/admin/events`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestObject),
			});

			if (!updatedEvent.ok) {
				throw new Error(
					`Failed to delete Event: ${updatedEvent.statusText}`
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
			window.location.reload();
		}
	}
	function addEvent() {
		const tmpEvent = {
			headline: "Untitled",
			description: "",
			registrationLink: null,
			month: 1,
			day: 1,
			year: 2025,
			image: "",
			active: false,
		};

		setEventSelectOptions((prevOptions) => [
			...prevOptions,
			{ value: tmpEvent, label: tmpEvent.headline },
		]);

		setSelectedEvent(tmpEvent);
	}
	async function saveEvent() {
		if (!selectedEvent) {
			console.error("No Event selected");
			return;
		}

		try {
			if (selectedEvent.id) {
				const eventObject = {
					id: selectedEvent.id,
					headline: selectedEvent.headline,
					description: selectedEvent.description,
					month: selectedEvent.month,
					day: selectedEvent.day,
					year: selectedEvent.year,
					image: selectedEvent.image,
					active: selectedEvent.active,
					registrationLink: selectedEvent.registrationLink
				};
				// If ID exists, update the existing Event
				const updatedEvent = await fetch(`/api/admin/events`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(eventObject),
				});

				const updatedEventData = await updatedEvent.json();

				if (!updatedEvent.ok) {
					toast.error(updatedEventData.error, {
						position: "bottom-right",
						autoClose: 10000,
						hideProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "light",
						transition: Bounce,
					});
					throw new Error(
						`Failed to create Event: ${updatedEvent.statusText}`
					);
				}

				console.log("Event updated successfully");
				window.location.reload();
			} else {
				if (!selectedEvent.image) {
					toast.error("Image is required for new events!", {
						position: "bottom-right",
						autoClose: 10000,
						hideProgressBar: false,
						closeOnClick: false,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: "light",
						transition: Bounce,
					});
				}
				{
					const eventObject = {
						headline: selectedEvent.headline,
						description: selectedEvent.description,
						month: selectedEvent.month,
						day: selectedEvent.day,
						year: selectedEvent.year,
						image: selectedEvent.image,
						active: selectedEvent.active,
						registrationLink: selectedEvent.registrationLink
					};
					// If no ID, create a new Event
					const newEvent = await fetch(`/api/admin/events`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(eventObject),
					});

					const newEventData = await newEvent.json();

					if (!newEvent.ok) {
						toast.error(newEventData.error, {
							position: "bottom-right",
							autoClose: 10000,
							hideProgressBar: false,
							closeOnClick: false,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							theme: "light",
							transition: Bounce,
						});
						throw new Error(
							`Failed to create Event: ${newEvent.statusText}`
						);
					}

					console.log("Event created successfully:", newEventData);
					setSelectedEvent(newEventData); // Update the selected Event with the newly created one
					window.location.reload();
				}
			}
		} catch (error) {
			console.error("Error saving Event:", error);
		}
	}
	function EventEditor() {
		const handleInputChange = (
			field: keyof Omit<Event, "image">,
			value: string | number | boolean
		) => {
			setSelectedEvent((prev) => {
				return prev
					? { ...prev, [field]: value }
					: {
							id: "",
							day: 1,
							month: 1,
							year: 2025,
							headline: "",
							description: "",
							image: "",
							active: false,
							registrationLink: null,
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

				setSelectedEvent((prev) => {
					return prev
						? { ...prev, image: uploadedImageObject.url }
						: {
								id: "",
								day: 1,
								month: 1,
								year: 2025,
								headline: "",
								description: "",
								registrationLink: null,
								active: false,
								image: uploadedImageObject.url,
						  };
				});
			}
		};

		if (!selectedEvent) {
			return "Something went wrong. Code 108!";
		}

		return (
			<div className={style.formDiv}>
				<h2>Edit Event</h2>
				<form className={style.form}>
					{selectedEvent?.image ? (
						<div>
							<label htmlFor="event_day">Current Image:</label>
							<div className={style.curImageContainer}>
								<Image
									src={selectedEvent?.image}
									fill={true}
									alt={"Current Image"}
								/>
							</div>
						</div>
					) : null}
					<div>
						<label htmlFor="event_day">Day:</label>
						<input
							name="event_day"
							type="number"
							min="1"
							max="31"
							value={selectedEvent?.day || ""}
							onChange={(e) =>
								handleInputChange(
									"day",
									parseInt(e.target.value, 10)
								)
							}
						/>
					</div>
					<div>
						<label htmlFor="event_month">Month:</label>
						<input
							name="event_month"
							type="number"
							min="1"
							max="12"
							value={selectedEvent?.month || ""}
							onChange={(e) =>
								handleInputChange(
									"month",
									parseInt(e.target.value, 10)
								)
							}
						/>
					</div>
					<div>
						<label htmlFor="event_year">Year:</label>
						<input
							name="event_year"
							type="number"
							value={selectedEvent?.year || ""}
							onChange={(e) =>
								handleInputChange(
									"year",
									parseInt(e.target.value, 10)
								)
							}
						/>
					</div>
					<div>
						<label htmlFor="event_Event">Event:</label>
						<input
							name="event_Event"
							type="text"
							value={selectedEvent?.headline || ""}
							onChange={(e) =>
								handleInputChange("headline", e.target.value)
							}
						/>
					</div>
					<div>
						<label htmlFor="event_regLink">Registration Link:</label>
						<input
							name="event_regLink"
							type="text"
							value={selectedEvent?.registrationLink || ""}
							onChange={(e) =>
								handleInputChange("registrationLink", e.target.value)
							}
						/>
					</div>
					<div>
						<DescriptionEditor
							description={selectedEvent.description}
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
							checked={selectedEvent.active}
							onChange={(e) =>
								handleInputChange("active", e.target.checked)
							}
						/>
					</div>
					<div>
						<label htmlFor="event_image">Image:</label>
						<input
							name="event_image"
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
						onClick={saveEvent}
						className={style.button_default}
					>
						Save
					</button>
				</form>
			</div>
		);
	}
	function displayEventEditor() {
		return (
			<>
				<div className={style.editorHeader}>
					<button onClick={addEvent} className={style.button_default}>
						Add an event
					</button>
					{selectedEvent?.id ? (
						<button
							onClick={removeEvent}
							className={style.button_red}
						>
							Remove an event
						</button>
					) : null}
				</div>
				<Select
					instanceId={"event-category-selector"}
					options={eventSelectOptions}
					onChange={newEventSelected}
					value={eventSelectOptions.find(
						(option) => option.value === selectedEvent
					)}
					placeholder="Select an Event"
				/>
				{selectedEvent ? EventEditor() : null}
			</>
		);
	}
	return displayEventEditor();
}

export default EventEditor;
