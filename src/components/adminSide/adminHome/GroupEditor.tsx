import React, { useEffect, useState } from "react";
import Select, { SingleValue, MultiValue } from "react-select";
import { toast, Bounce } from "react-toastify";
import { Group } from "@/src/types/types";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import Image from "next/image";

// Use the imported User type from "@/src/types/types"
import { User } from "@/src/types/types";
import { useLoading } from "../../misc/LoadingContext";

interface GroupEditorProps {
	selectOptions: Array<{ value: Group; label: string }>;
}

interface UserOption {
	value: User;
	label: string;
}

function GroupEditor({ selectOptions }: GroupEditorProps) {
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
	const [groupSelectOptions, setGroupSelectOptions] = useState(selectOptions);
	const [userOptions, setUserOptions] = useState<UserOption[]>([]);
	const {isLoading, setLoading} = useLoading();
	const [tagsInput, setTagsInput] = useState("");


	useEffect(() => {
		setGroupSelectOptions(selectOptions);
	}, [selectOptions]);

	useEffect(() => {
		if (selectedGroup) {
			setTagsInput(selectedGroup.tags.join(", "));
		}
	}, [selectedGroup]);

	// Fetch available users for the multi-select
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("/api/admin/users");
				if (!res.ok) {
					throw new Error(`Failed to fetch users: ${res.statusText}`);
				}
				const users: User[] = await res.json();
				const options: UserOption[] = users.map((user) => ({
					value: user,
					label: user.firstName + " " + user.lastName,
				}));
				setUserOptions(options);
			} catch (err) {
				console.error(err);
			}
		};
		fetchUsers();
	}, []);

	function newGroupSelected(
		newValue: SingleValue<{ value: Group; label: string }>
	) {
		setSelectedGroup(newValue?.value || null);
	}

	async function removeGroup() {
		if (!selectedGroup?.id) {
			toast.error("No group selected for removal", {
				theme: "light",
				transition: Bounce,
			});
			return;
		}

		try {
			const res = await fetch("/api/admin/groups", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id: selectedGroup.id }),
			});
			if (!res.ok) {
				throw new Error(`Failed to delete group: ${res.statusText}`);
			}
			toast.success("Group removed successfully!");
			window.location.reload();
		} catch (error) {
			console.error(error);
			toast.error("Error deleting group", {
				theme: "light",
				transition: Bounce,
			});
		}
	}

	function addGroup() {
		// Create a temporary group object with default values.
		const tmpGroup: Group = {
			id: "", // Empty id indicates a new group.
			name: "Untitled Group",
			description: "",
			image: "",
			users: [],
			tags: [],
		};
		setGroupSelectOptions((prev) => [
			...prev,
			{ value: tmpGroup, label: tmpGroup.name },
		]);
		setSelectedGroup(tmpGroup);
	}

	async function saveGroup() {
		if (!selectedGroup) {
			toast.error("No group selected", {
				theme: "light",
				transition: Bounce,
			});
			return;
		}
		try {
			if (selectedGroup.id) {
				// Update existing group.
				const res = await fetch("/api/admin/groups", {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(selectedGroup),
				});
				const data = await res.json();
				if (!res.ok) {
					toast.error(data.error, {
						theme: "light",
						transition: Bounce,
					});
					throw new Error(
						`Failed to update group: ${res.statusText}`
					);
				}
				toast.success("Group updated successfully!");
				window.location.reload();
			} else {
				// Create new group.
				const res = await fetch("/api/admin/groups", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(selectedGroup),
				});
				const data = await res.json();
				if (!res.ok) {
					toast.error(data.error, {
						theme: "light",
						transition: Bounce,
					});
					throw new Error(
						`Failed to create group: ${res.statusText}`
					);
				}
				toast.success("Group created successfully!");
				setSelectedGroup(data); // update selected group with data returned from server.
				window.location.reload();
			}
		} catch (error) {
			console.error("Error saving group:", error);
		}
	}

	// Helper to update simple text-based fields.
	function handleInputChange(
		field: keyof Omit<Group, "users" | "tags" | "id">,
		value: string
	) {
		setSelectedGroup((prev) => (prev ? { ...prev, [field]: value } : prev));
	}

	// Update tags from a comma-separated list.
	// function handleTagsChange(e: React.ChangeEvent<HTMLInputElement>) {
	// 	const tags = e.target.value
	// 		.split(",")
	// 		.map((tag) => tag.trim())
	// 		.filter((tag) => tag !== "");
	// 	setSelectedGroup((prev) => (prev ? { ...prev, tags } : prev));
	// }

	const handleFileChange = async (file: File | null) => {
		setLoading(true);
		if (file) {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				toast.error("Failed to upload image", {
					theme: "light",
					transition: Bounce,
				});
				return;
			}

			const uploadedImageObject = await response.json();

			setSelectedGroup((prev) =>
				prev ? { ...prev, image: uploadedImageObject.url } : prev
			);
			setLoading(false);
		}
	};


	const renderEditor = () => {
		if (!selectedGroup) {
			return <p>No group selected</p>;
		}
		return (
			<div className={style.formDiv}>
				<h2>Edit Group</h2>
				<form className={style.form}>
					<div>
						<label htmlFor="group_name">Name:</label>
						<input
							id="group_name"
							type="text"
							value={selectedGroup.name}
							onChange={(e) =>
								handleInputChange("name", e.target.value)
							}
						/>
					</div>
					<div>
						<label htmlFor="group_description">Description:</label>
						<textarea
							id="group_description"
							value={selectedGroup.description}
							onChange={(e) =>
								handleInputChange("description", e.target.value)
							}
						/>
					</div>
					<div>
						<label htmlFor="group_image">Image:</label>
						<input
							id="group_image"
							type="file"
							accept="image/png, image/jpeg, image/jpg, image/webp"
							onChange={(e) =>
								handleFileChange(
									e.target.files ? e.target.files[0] : null
								)
							}
						/>
					</div>
					<div>
						{selectedGroup?.image && (
							<div className={style.curImageContainer}>
								<p>Image preview:</p>
								<Image
									src={selectedGroup.image}
									alt="Group preview"
									style={{
										maxHeight: "150px",
										objectFit: "contain",
									}}
									fill={true}
								/>
							</div>
						)}
					</div>
					<div>
						<label htmlFor="group_tags">
							Tags (comma separated):
						</label>
						<input
							id="group_tags"
							type="text"
							value={tagsInput}
							onChange={(e) => setTagsInput(e.target.value)}
							onBlur={() => {
								const tags = tagsInput
									.split(",")
									.map((tag) => tag.trim())
									.filter((tag) => tag !== "");
								setSelectedGroup((prev) =>
									prev ? { ...prev, tags } : prev
								);
							}}
						/>
					</div>

					<div>
						<label>Users:</label>
						{/* Use a multi-select for choosing users */}
						<Select
							isMulti
							instanceId="group-users-multi"
							options={userOptions}
							value={userOptions.filter((option) =>
								selectedGroup.users.some(
									(user) => user.id === option.value.id
								)
							)}
							onChange={(selected: MultiValue<UserOption>) => {
								const updatedUsers = selected.map(
									(option) => option.value
								);
								setSelectedGroup((prev) =>
									prev
										? { ...prev, users: updatedUsers }
										: prev
								);
							}}
							placeholder="Select users..."
						/>
					</div>
					<button
						type="button"
						onClick={saveGroup}
						className={style.button_default}
					>
						Save Group
					</button>
				</form>
			</div>
		);
	};

	return (
		<>
			<div className={style.editorHeader}>
				<button onClick={addGroup} className={style.button_default}>
					Add Group
				</button>
				{selectedGroup?.id ? (
					<button onClick={removeGroup} className={style.button_red}>
						Remove Group
					</button>
				) : null}
			</div>
			<Select
				instanceId={"group-selector"}
				options={groupSelectOptions}
				onChange={newGroupSelected}
				value={groupSelectOptions.find(
					(option) => option.value.id === selectedGroup?.id
				)}
				placeholder="Select a Group"
			/>
			{selectedGroup ? renderEditor() : null}
		</>
	);
}

export default GroupEditor;
