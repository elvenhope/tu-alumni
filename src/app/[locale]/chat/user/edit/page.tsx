"use client";

import { useUserStore } from "@/src/store/userStore";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User } from "@/src/types/types";
import style from "@/src/styles/clientSide/chatPage/userPage/UserEdit.module.scss";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/src/i18n/routing";

// The EditUserPage component
const EditUserPage = () => {
	const { user, updateUser, fetchUser, isLoading } = useUserStore();
	const { data: session } = useSession();
	const router = useRouter();

	// Check if user is already available, otherwise, fetch the user
	useEffect(() => {
		if (!user && session?.user) {
			const userId = session.user.id;
			fetchUser(userId);
		}
	}, [user, fetchUser, session]);

	// Validation schema using Yup
	const validationSchema = Yup.object({
		firstName: Yup.string().required("First name is required"),
		lastName: Yup.string().required("Last name is required"),
		password: Yup.string().optional(),
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		phoneNumber: Yup.string().optional(),
		graduatedMajor: Yup.string().optional(),
		graduatedYear: Yup.string().optional(),
		profileImage: Yup.string().optional(),
		location: Yup.string().optional(),
		jobExperienceDescription: Yup.string().optional(),
		website: Yup.string().optional(),
		socialFacebook: Yup.string().optional(),
		socialInstagram: Yup.string().optional(),
		socialLinkedin: Yup.string().optional(),
		interests: Yup.string().optional(),
		whoAmI: Yup.string().optional(),
		whatIWantToAchieve: Yup.string().optional(),
		whatICanOfferYou: Yup.string().optional(),
		whereCanYouFindMe: Yup.string().optional(),
		hashtags: Yup.array().of(Yup.string()).optional(),
	});

	// Initial values from the user store (no role)
	const initialValues = {
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		password: user?.password || "",
		email: user?.email || "",
		phoneNumber: user?.phoneNumber || "",
		graduatedMajor: user?.graduatedMajor || "",
		graduatedYear: user?.graduatedYear || "",
		profileImage: user?.profileImage || "",
		location: user?.location || "",
		jobExperienceDescription: user?.jobExperienceDescription || "",
		website: user?.website || "",
		socialFacebook: user?.socialFacebook || "",
		socialInstagram: user?.socialInstagram || "",
		socialLinkedin: user?.socialLinkedin || "",
		interests: user?.interests || "",
		whoAmI: user?.whoAmI || "",
		whatIWantToAchieve: user?.whatIWantToAchieve || "",
		whatICanOfferYou: user?.whatICanOfferYou || "",
		whereCanYouFindMe: user?.whereCanYouFindMe || "",
		hashtags: user?.hashtags || [],
	};

	// Handle form submission
	const handleSubmit = (values: Partial<User>) => {
		if (user?.id) {
			updateUser(user?.id, values);
			if(isLoading == false) {
				router.push("/chat");
			}
		}
	};

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className={style.container}>
			<h1>Edit Your Profile</h1>
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ setFieldValue }) => (
					<Form className={style.form}>
						{/* First Name */}
						<div className={style.inputGroup}>
							<label htmlFor="firstName">First Name</label>
							<Field
								type="text"
								id="firstName"
								name="firstName"
								className={style.input}
							/>
							<ErrorMessage
								name="firstName"
								component="div"
								className={style.error}
							/>
						</div>

						{/* Last Name */}
						<div className={style.inputGroup}>
							<label htmlFor="lastName">Last Name</label>
							<Field
								type="text"
								id="lastName"
								name="lastName"
								className={style.input}
							/>
							<ErrorMessage
								name="lastName"
								component="div"
								className={style.error}
							/>
						</div>

						{/* Password */}
						<div className={style.inputGroup}>
							<label htmlFor="password">Password</label>
							<Field
								type="password"
								id="password"
								name="password"
								className={style.input}
							/>
							<ErrorMessage
								name="password"
								component="div"
								className={style.error}
							/>
						</div>

						{/* Email */}
						<div className={style.inputGroup}>
							<label htmlFor="email">Email</label>
							<Field
								type="email"
								id="email"
								name="email"
								className={style.input}
							/>
							<ErrorMessage
								name="email"
								component="div"
								className={style.error}
							/>
						</div>

						{/* Phone Number */}
						<div className={style.inputGroup}>
							<label htmlFor="phoneNumber">Phone Number</label>
							<Field
								type="text"
								id="phoneNumber"
								name="phoneNumber"
								className={style.input}
							/>
							<ErrorMessage
								name="phoneNumber"
								component="div"
								className={style.error}
							/>
						</div>

						{/* More fields can go here... */}

						{/* Submit Button */}
						<div className={style.buttonContainer}>
							<button
								type="submit"
								className={style.submitButton}
							>
								Save Changes
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default EditUserPage;
