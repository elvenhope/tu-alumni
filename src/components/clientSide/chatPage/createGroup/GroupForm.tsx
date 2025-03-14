import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import style from "@/src/styles/clientSide/chatPage/createGroup/GroupForm.module.scss";

interface GroupFormProps {
	onSubmit: (values: {
		name: string;
		description: string;
		tags: string[];
	}) => void;
	onCancel: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onSubmit, onCancel }) => {
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
				.map((tag) => tag.trim());
			onSubmit({ ...values, tags: formattedTags });
		},
	});

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
						formik.touched.name && formik.errors.name
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
				<button type="submit" className={style.submitButton}>
					Create
				</button>
			</div>
		</form>
	);
};

export default GroupForm;
