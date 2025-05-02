"use client";

import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User } from "@/src/types/types";
import style from "@/src/styles/clientSide/chatPage/userPage/UserEdit.module.scss";
import { useUserStore } from "@/src/store/userStore";
import { useSession } from "next-auth/react";
import { useRouter } from "@/src/i18n/routing";
import { useLoading } from "@/src/components/misc/LoadingContext";
import Image from "next/image";
import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

// The EditUserPage component
const EditUserPage = () => {
	const { user, updateUser, fetchUser, isLoading } = useUserStore();
	const { data: session } = useSession();
	const router = useRouter();
	const { setLoading } = useLoading();

	// Local state for imageUrl. Initialize from user if available.
	const [imageUrl, setImageUrl] = useState<string>(
		"https://i.ibb.co/9H795H6v/381120c1d1246968152252a939da30a0.jpg"
	);

	// Fetch user if not already available
	useEffect(() => {
		if (!user && session?.user) {
			const userId = session.user.id;
			fetchUser(userId);
		} else if (user?.profileImage) {
			setImageUrl(user.profileImage);
		}
	}, [user, fetchUser, session]);

	// Upload file function
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
		// Update local imageUrl, and you may also choose to update your user store
		setImageUrl(uploaded.url);
		setLoading(false);
	};

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

	// Initial values from the user store (profileImage now handled separately)
	const initialValues = {
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		password: user?.password || "",
		email: user?.email || "",
		phoneNumber: user?.phoneNumber || "",
		graduatedMajor: user?.graduatedMajor || "",
		graduatedYear: user?.graduatedYear || "",
		// profileImage is managed by imageUrl state
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

	// Handle form submission. Inject imageUrl into the user update.
	const handleSubmit = (values: Partial<User>) => {
		if (user?.id) {
			updateUser(user.id, { ...values, profileImage: imageUrl });
			if (isLoading === false) {
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
						{/* Personal Information Section */}
						<section className={style.section}>
							<h2>Personal Information</h2>
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

							<div className={style.inputGroup}>
								<label htmlFor="phoneNumber">
									Phone Number
								</label>
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
						</section>

						{/* Education & Profile Section */}
						<section className={style.section}>
							<h2>Education & Profile</h2>
							<div className={style.inputGroup}>
								<label htmlFor="graduatedMajor">
									Graduated Major
								</label>
								<Field
									type="text"
									id="graduatedMajor"
									name="graduatedMajor"
									className={style.input}
								/>
								<ErrorMessage
									name="graduatedMajor"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="graduatedYear">
									Graduated Year
								</label>
								<Field
									type="text"
									id="graduatedYear"
									name="graduatedYear"
									className={style.input}
								/>
								<ErrorMessage
									name="graduatedYear"
									component="div"
									className={style.error}
								/>
							</div>

							{/* File upload for profile image */}
							<div className={style.inputGroup}>
								<label>Profile Image (optional):</label>
								<input
									type="file"
									accept="image/png, image/jpeg, image/jpg, image/webp"
									onChange={(e) =>
										handleFileChange(
											e.target.files
												? e.target.files[0]
												: null
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
											alt="Profile preview"
											fill
											style={{ objectFit: "contain" }}
										/>
									</div>
								</div>
							)}

							<div className={style.inputGroup}>
								<label htmlFor="location">Location</label>
								<Field
									type="text"
									id="location"
									name="location"
									className={style.input}
								/>
								<ErrorMessage
									name="location"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="jobExperienceDescription">
									Job Experience Description
								</label>
								<Field
									as="textarea"
									id="jobExperienceDescription"
									name="jobExperienceDescription"
									className={style.input}
								/>
								<ErrorMessage
									name="jobExperienceDescription"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="website">Website</label>
								<Field
									type="text"
									id="website"
									name="website"
									className={style.input}
								/>
								<ErrorMessage
									name="website"
									component="div"
									className={style.error}
								/>
							</div>
						</section>

						{/* Additional Details Section */}
						<section className={style.section}>
							<h2>Additional Details</h2>
							<div className={style.inputGroup}>
								<label htmlFor="socialFacebook">Facebook</label>
								<Field
									type="text"
									id="socialFacebook"
									name="socialFacebook"
									className={style.input}
								/>
								<ErrorMessage
									name="socialFacebook"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="socialInstagram">
									Instagram
								</label>
								<Field
									type="text"
									id="socialInstagram"
									name="socialInstagram"
									className={style.input}
								/>
								<ErrorMessage
									name="socialInstagram"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="socialLinkedin">LinkedIn</label>
								<Field
									type="text"
									id="socialLinkedin"
									name="socialLinkedin"
									className={style.input}
								/>
								<ErrorMessage
									name="socialLinkedin"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="interests">Interests</label>
								<Field
									type="text"
									id="interests"
									name="interests"
									className={style.input}
								/>
								<ErrorMessage
									name="interests"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="whoAmI">Who Am I?</label>
								<Field
									as="textarea"
									id="whoAmI"
									name="whoAmI"
									className={style.input}
								/>
								<ErrorMessage
									name="whoAmI"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="whatIWantToAchieve">
									What I Want to Achieve
								</label>
								<Field
									as="textarea"
									id="whatIWantToAchieve"
									name="whatIWantToAchieve"
									className={style.input}
								/>
								<ErrorMessage
									name="whatIWantToAchieve"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="whatICanOfferYou">
									What I Can Offer You
								</label>
								<Field
									as="textarea"
									id="whatICanOfferYou"
									name="whatICanOfferYou"
									className={style.input}
								/>
								<ErrorMessage
									name="whatICanOfferYou"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="whereCanYouFindMe">
									Where Can You Find Me?
								</label>
								<Field
									type="text"
									id="whereCanYouFindMe"
									name="whereCanYouFindMe"
									className={style.input}
								/>
								<ErrorMessage
									name="whereCanYouFindMe"
									component="div"
									className={style.error}
								/>
							</div>

							<div className={style.inputGroup}>
								<label htmlFor="hashtags">
									Hashtags (comma-separated)
								</label>
								<Field
									type="text"
									id="hashtags"
									name="hashtags"
									className={style.input}
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) => {
										const value = e.target.value
											.split(",")
											.map((tag) => tag.trim());
										setFieldValue("hashtags", value);
									}}
								/>
								<ErrorMessage
									name="hashtags"
									component="div"
									className={style.error}
								/>
							</div>
						</section>

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
