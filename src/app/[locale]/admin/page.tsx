"use client";

import { Headline, Event } from "@/src/types/types";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import Select from "react-select";
import Image from "next/image";
import { Bounce, toast } from "react-toastify";
import DescriptionEditor from "@/src/components/misc/descriptionEditor";
import { error } from "console";

export default function AdminPage() {
	const { data: session } = useSession();

	const [selectedCategory, setSelectedCategory] = useState<string>();

	const [headlines, setHeadlines] = useState<Array<Headline>>([]);
	const [selectedHeadline, setSelectedHeadline] = useState<Headline>();
	const [headlineSelectOptions, setHeadlineSelectOptions] = useState<
		Array<{ value: Headline; label: string }>
	>([]);

	const [events, setEvents] = useState<Array<Event>>([]);
	const [selectedEvent, setSelectedEvent] = useState<Event>();
	const [eventSelectOptions, setEventSelectOptions] = useState<
		Array<{ value: Event; label: string }>
	>([]);

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

				// Set initial options for headlines
				const headingsInitialOptions = headingsData.map((headline) => ({
					value: headline,
					label: headline.headline,
				}));
				setHeadlineSelectOptions(headingsInitialOptions);

				const eventsResponse = await fetch("/api/admin/events");
				if (!eventsResponse.ok) {
					throw new Error(
						`Failed to fetch events: ${eventsResponse.statusText}`
					);
				}

				const eventsData: Event[] = await eventsResponse.json();
				setEvents(eventsData);

				// Set initial options for headlines
				const eventInitialOptions = eventsData.map((event) => ({
					value: event,
					label: event.headline,
				}));
				setEventSelectOptions(eventInitialOptions);
			} catch (err) {
				console.log(err);
			}
		};

		fetchInfo();
	}, []);

	const categorySelector = [
		{ value: "Headlines", label: "Headlines" },
		{ value: "Events", label: "Events" },
	];

	const numberOfOptionsPerCategory = [
		{ category: "Headlines", number: 5 },
		{ category: "Events", number: 4 },
	];

	if (!session) {
		return <p>Access Denied</p>;
	}

	if (session.user.role !== "admin") {
		return <p>Access Denied</p>;
	}

	function getToken() {
		console.log(headlines);
	}

	function newCategorySelected(
		newValue: SingleValue<{ value: string; label: string }>
	) {
		setSelectedCategory(newValue?.value);
	}

	function newHeadlineSelected(
		newValue: SingleValue<{ value: Headline; label: string }>
	) {
		setSelectedHeadline(newValue?.value);
	}

	function newEventSelected(
		newValue: SingleValue<{ value: Event; label: string }>
	) {
		setSelectedEvent(newValue?.value);
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
		};

		setHeadlineSelectOptions((prevOptions) => [
			...prevOptions,
			{ value: tmpHeadline, label: tmpHeadline.headline },
		]);

		setSelectedHeadline(tmpHeadline);
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
					`Failed to delete headline: ${updatedEvent.statusText}`
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
			month: 1,
			day: 1,
			image: "",
		};

		setEventSelectOptions((prevOptions) => [
			...prevOptions,
			{ value: tmpEvent, label: tmpEvent.headline },
		]);

		setSelectedEvent(tmpEvent);
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

	async function saveEvent() {
		if (!selectedEvent) {
			console.error("No headline selected");
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
					image: selectedEvent.image,
				};
				// If ID exists, update the existing headline
				const updatedEvent = await fetch(`/api/admin/events`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(eventObject),
				});

				if (!updatedEvent.ok) {
					throw new Error(
						`Failed to update headline: ${updatedEvent.statusText}`
					);
				}

				console.log("Headline updated successfully");
			} else {
				if (!selectedEvent.image) {
					toast.error("Image is required for new events!", {
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
				}
				{
					const eventObject = {
						headline: selectedEvent.headline,
						description: selectedEvent.description,
						month: selectedEvent.month,
						day: selectedEvent.day,
						image: selectedEvent.image,
					};
					// If no ID, create a new headline
					const newEvent = await fetch(`/api/admin/events`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(eventObject),
					});

					if (!newEvent.ok) {
						throw new Error(
							`Failed to create headline: ${newEvent.statusText}`
						);
					}

					const data = await newEvent.json();
					console.log("Headline created successfully:", data);
					setSelectedEvent(data); // Update the selected headline with the newly created one
				}
			}
		} catch (error) {
			console.error("Error saving headline:", error);
		} finally {
			window.location.reload();
		}
	}

	function HeadlineEditor() {
		const handleInputChange = (field: keyof Headline, value: string) => {
			setSelectedHeadline((prev) => {
				// Ensure `prev` exists; if not, initialize it with default values
				return prev
					? { ...prev, [field]: value }
					: {
							id: "",
							headline: "",
							author: "",
							description: "",
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

	function EventEditor() {
		const handleInputChange = (
			field: keyof Omit<Event, "image">,
			value: string | number
		) => {
			setSelectedEvent((prev) => {
				return prev
					? { ...prev, [field]: value }
					: {
							id: "",
							day: 1,
							month: 1,
							headline: "",
							description: "",
							image: "",
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

				setSelectedEvent((prev) => {
					return prev
						? { ...prev, image: uploadedImageObject.url }
						: {
								id: "",
								day: 1,
								month: 1,
								headline: "",
								description: "",
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
						<label htmlFor="event_headline">Headline:</label>
						<input
							name="event_headline"
							type="text"
							value={selectedEvent?.headline || ""}
							onChange={(e) =>
								handleInputChange("headline", e.target.value)
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
						<label htmlFor="event_image">Image:</label>
						<input
							name="event_image"
							type="file"
							accept="image/*"
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

	return (
		<>
			<div className={style.content}>
				<h1>Welcome {session.user.firstName}</h1>
				{/* <button onClick={() => getToken()}>press</button> */}
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
						? displayHeadlineEditor()
						: null}
					{selectedCategory === "Events"
						? displayEventEditor()
						: null}
				</div>
			</div>
		</>
	);
}
