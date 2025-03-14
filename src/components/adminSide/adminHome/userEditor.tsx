import React, { useState } from "react";
import { toast, Bounce } from "react-toastify";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import { User } from "@/src/types/types";

function UserEditor() {
	const [selectedUser, setSelectedUser] = useState<User>();

	function addUser() {
		const tmpUser: User = {
			firstName: "New",
			lastName: "User",
			password: "",
			role: "User",
			email: "",
		};
		setSelectedUser(tmpUser);
	}

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
				throw new Error("Failed to save user")
			};
			window.location.reload();
		} catch (error) {
			toast.error("Error saving user!" + error, {
				position: "bottom-right",
				autoClose: 5000,
				transition: Bounce,
			});
		}
	}

	const handleInputChange = (field: keyof User, value: string) => {
		setSelectedUser((prev) =>
			prev ? { ...prev, [field]: value } : undefined
		);
	};

	const generatePassword = () => {
		const password = Math.random().toString(36).slice(-10);
		navigator.clipboard.writeText(password).then(() => {
			toast.success("Password copied to clipboard!", {
				position: "bottom-right",
				autoClose: 3000,
				transition: Bounce,
			});
		});
		setSelectedUser((prev) => (prev ? { ...prev, password } : undefined));
	};

	return (
		<div>
			<div className={style.editorHeader}>
				<button onClick={addUser} className={style.button_default}>
					Add User
				</button>
			</div>
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
						<div>
							<button
								type="button"
								onClick={saveUser}
								className={style.button_default}
							>
								Save
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default UserEditor;