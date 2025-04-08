import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import style from "@/src/styles/clientSide/chatPage/createGroup/GroupForm.module.scss";
import { useLoading } from "@/src/components/misc/LoadingContext";
import Image from "next/image";
import { toast, Bounce } from "react-toastify";

interface GroupFormProps {
	onSubmit: (values: {
		name: string;
		description: string;
		tags: string[];
		image?: string;
	}) => void;
	onCancel: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onSubmit, onCancel }) => {
	const { isLoading, setLoading } = useLoading();
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const formik = useFormik({
		initialValues: {
			name: "",
			description: "",
			tags: "",
		},
		validationSchema: Yup.object({
			name: Yup.string().required("Group name is required"),
			description: Yup.string().required("Description is required"),
			tags: Yup.string().required("At least one tag is required"),
		}),
		onSubmit: (values) => {
			const formattedTags = values.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag !== "");

			onSubmit({
				...values,
				tags: formattedTags,
				image: imageUrl || undefined,
			});
		},
	});

	const handleFileChange = async (file: File | null) => {
		if (!file) return;
		setLoading(true);

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
			setLoading(false);
			return;
		}

		const uploaded = await response.json();
		setImageUrl(uploaded.url);
		setLoading(false);
	};

	return (
		<form onSubmit={formik.handleSubmit} className={style.formContainer}>
			<div className={style.formGroup}>
				<label>Group Name:</label>
				<input
					type="text"
					name="name"
					onChange={formik.handleChange}
					value={formik.values.name}
					className={
						formik.touched.name && formik.errors.name
							? style.inputError
							: ""
					}
				/>
				{formik.touched.name && formik.errors.name && (
					<p>{formik.errors.name}</p>
				)}
			</div>

			<div className={style.formGroup}>
				<label>Description:</label>
				<textarea
					name="description"
					onChange={formik.handleChange}
					value={formik.values.description}
					className={
						formik.touched.description && formik.errors.description
							? style.inputError
							: ""
					}
				/>
				{formik.touched.description && formik.errors.description && (
					<p>{formik.errors.description}</p>
				)}
			</div>

			<div className={style.formGroup}>
				<label>Tags (comma-separated):</label>
				<input
					type="text"
					name="tags"
					onChange={formik.handleChange}
					value={formik.values.tags}
				/>
				{formik.touched.tags && formik.errors.tags && (
					<p>{formik.errors.tags}</p>
				)}
			</div>

			<div className={style.formGroup}>
				<label>Image (optional):</label>
				<input
					type="file"
					accept="image/png, image/jpeg, image/jpg, image/webp"
					onChange={(e) =>
						handleFileChange(
							e.target.files ? e.target.files[0] : null
						)
					}
				/>
			</div>

			{imageUrl && (
				<div className={style.curImageContainer}>
					<p>Image preview:</p>
					<div
						style={{
							position: "relative",
							width: "100%",
							height: "150px",
						}}
					>
						<Image
							src={imageUrl}
							alt="Group preview"
							fill
							style={{ objectFit: "contain" }}
						/>
					</div>
				</div>
			)}

			<div className={style.formGroup}>
				<button
					type="submit"
					className={style.submitButton}
					disabled={isLoading}
				>
					{isLoading ? "Uploading..." : "Create"}
				</button>
			</div>
		</form>
	);
};

export default GroupForm;
