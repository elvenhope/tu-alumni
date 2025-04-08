"use client";

import React, { useState, useEffect } from "react";
import Select, { ActionMeta, SingleValue } from "react-select";
import { toast, Bounce } from "react-toastify";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import { User } from "@/src/types/types";

type OptionType = {
	value: string;
	label: string;
	user: User;
};

function UserEditor() {
	// State for list of users and the selected user for editing
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	// Fetch users on mount
	useEffect(() => {
		async function fetchUsers() {
			try {
				const response = await fetch("/api/admin/users");
				if (!response.ok) {
					throw new Error("Failed to fetch users.");
				}
				const data = await response.json();
				setUsers(data);
			} catch (error) {
				toast.error("Error fetching users: " + error, {
					position: "bottom-right",
					autoClose: 5000,
					transition: Bounce,
				});
			}
		}
		fetchUsers();
	}, []);

	// Create a new user and set it as selected for editing
	function addUser() {
		const tmpUser: User = {
			// For new users, id might be undefined or null
			firstName: "New",
			lastName: "User",
			password: "",
			role: "User",
			email: "",
		};
		setSelectedUser(tmpUser);
	}

	// Save the user via an API call
	async function saveUser() {
		if (!selectedUser) return;
		try {
			const userObject = { ...selectedUser };
			const method = userObject.id ? "PUT" : "POST";
			const response = await fetch(`/api/admin/users`, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(userObject),
			});
			if (!response.ok) {
				throw new Error("Failed to save user");
			}
			// Parse the saved/updated user returned from the API
			const updatedUser = await response.json();
			toast.success("User saved successfully!", {
				position: "bottom-right",
				autoClose: 3000,
				transition: Bounce,
			});

			window.location.reload(); // Reload the page to reflect changes
		} catch (error) {
			toast.error("Error saving user! " + error, {
				position: "bottom-right",
				autoClose: 5000,
				transition: Bounce,
			});
		}
	}

	// Delete a user via an API call
	async function deleteUser() {
		if (!selectedUser) return;
		try {
			const response = await fetch(
				`/api/admin/users?id=${selectedUser.id}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete user");
			}
			toast.success("User deleted successfully!", {
				position: "bottom-right",
				autoClose: 3000,
				transition: Bounce,
			});
			// Update the user list and clear the selection
			setUsers((prevUsers) =>
				prevUsers.filter((u) => u.id !== selectedUser.id)
			);
			setSelectedUser(null);
		} catch (error) {
			toast.error("Error deleting user: " + error, {
				position: "bottom-right",
				autoClose: 5000,
				transition: Bounce,
			});
		}
	}

	// Display a confirmation modal via toast before deleting the user
	const showDeleteConfirmation = () => {
		toast(
			({ closeToast }) => (
				<div>
					<p>
						Are you sure you want to delete{" "}
						<strong>
							{selectedUser?.firstName} {selectedUser?.lastName}
						</strong>
						?
					</p>
					<div className={style.confirmationButtons}>
						<button
							onClick={async () => {
								await deleteUser();
								closeToast();
							}}
							className={style.button_red}
						>
							Delete
						</button>
						<button
							onClick={closeToast}
							className={style.button_default}
						>
							Cancel
						</button>
					</div>
				</div>
			),
			{ autoClose: false }
		);
	};

	// Handle changes to form input fields
	const handleInputChange = (field: keyof User, value: string) => {
		setSelectedUser((prev) => (prev ? { ...prev, [field]: value } : prev));
	};

	// Generate a new password and update the selected user
	const generatePassword = () => {
		const password = Math.random().toString(36).slice(-10);
		navigator.clipboard.writeText(password).then(() => {
			toast.success("Password copied to clipboard!", {
				position: "bottom-right",
				autoClose: 3000,
				transition: Bounce,
			});
		});
		setSelectedUser((prev) => (prev ? { ...prev, password } : prev));
	};

	// Prepare options for react-select based on the users list
	const options: OptionType[] = users.map((user) => ({
		value: user.id || user.email, // fallback to email if id is missing
		label: `${user.firstName} ${user.lastName} - ${user.email}`,
		user,
	}));

	// Handler for react-select change
	const handleSelectChange = (
		option: SingleValue<OptionType>,
		actionMeta: ActionMeta<OptionType>
	) => {
		if (option) {
			setSelectedUser(option.user);
		}
	};

	return (
		<div>
			<div className={style.editorHeader}>
				<button onClick={addUser} className={style.button_default}>
					Add User
				</button>
			</div>
			{/* User Select Section using react-select */}
			<div className={style.userList}>
				<h2>Select a User</h2>
				<Select
					options={options}
					onChange={handleSelectChange}
					placeholder="Search users..."
					isClearable
					className={style.reactSelect}
				/>
			</div>

			{/* User Editor Form Section */}
			{selectedUser && (
				<div className={style.formDiv}>
					<h2>Edit User</h2>
					<form className={style.form}>
						<div>
							<label>First Name:</label>
							<input
								type="text"
								value={selectedUser.firstName}
								onChange={(e) =>
									handleInputChange(
										"firstName",
										e.target.value
									)
								}
							/>
						</div>
						<div>
							<label>Last Name:</label>
							<input
								type="text"
								value={selectedUser.lastName}
								onChange={(e) =>
									handleInputChange(
										"lastName",
										e.target.value
									)
								}
							/>
						</div>
						<div>
							<label>Email:</label>
							<input
								type="email"
								value={selectedUser.email}
								onChange={(e) =>
									handleInputChange("email", e.target.value)
								}
							/>
						</div>
						<div>
							<label>Role:</label>
							<select
								value={selectedUser.role}
								onChange={(e) =>
									handleInputChange("role", e.target.value)
								}
							>
								<option value="User">User</option>
								<option value="Admin">Admin</option>
							</select>
						</div>
						<div>
							<label>Password:</label>
							<input
								type="password"
								value={selectedUser.password}
								onChange={(e) =>
									handleInputChange(
										"password",
										e.target.value
									)
								}
							/>
							<button
								type="button"
								onClick={generatePassword}
								className={style.button_default}
							>
								Generate Password
							</button>
						</div>
						<div className={style.buttonGroup}>
							<button
								type="button"
								onClick={saveUser}
								className={style.button_default}
							>
								Save
							</button>
							<button
								type="button"
								onClick={showDeleteConfirmation}
								className={style.button_red}
							>
								Delete
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default UserEditor;
