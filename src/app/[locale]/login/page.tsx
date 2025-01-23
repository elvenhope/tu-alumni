"use client";
import React from "react";
import style from "@/src/styles/clientSide/LoginPage.module.scss";
import Image from "next/image";
import loginImage from "@/assets/images/loginImage.png";
import blueLogoEN from "@/assets/images/blueLogoEN.png";
import blueLogoLV from "@/assets/images/blueLogoLV.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocale } from "next-intl";
import { camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { Link } from "@/src/i18n/routing";
import { signIn } from "next-auth/react";

interface formValues {
	email: string;
	password: string;
	rememberMe: boolean;
}

function LoginPage() {
	const locale = useLocale();

	const initialValues: formValues = {
		email: "",
		password: "",
		rememberMe: false,
	};

	const signInSchema = Yup.object().shape({
		email: Yup.string().email().required("Email is required"),

		password: Yup.string()
			.required("Password is required")
			.min(4, "Password is too short - should be 4 chars minimum"),

		rememberMe: Yup.boolean(),
	});

	function headerImage() {
		const imageLV = (
			<Image
				src={blueLogoLV}
				alt="Login image"
				fill={true}
				style={{ objectFit: "contain" }}
			/>
		);

		const imageEN = (
			<Image
				src={blueLogoEN}
				alt="Login image"
				fill={true}
				style={{ objectFit: "contain" }}
			/>
		);

		return (
			<Link href={"/"}>
				<div className={style.header}>
					<div className={style.headerImage}>
						{locale === "lv" ? imageLV : imageEN}
					</div>
				</div>
			</Link>
		);
	}

	function triggerSignIn(values: formValues) {
		signIn("credentials", {
			email: values.email,
			password: values.password,
			rememberMe: values.rememberMe,
		});
	}

	return (
		<div className={style.container}>
			<div className={style.imageContainer}>
				<Image
					src={loginImage}
					alt="Login image"
					fill={true}
					style={{ objectFit: "cover" }}
				/>
			</div>
			<div className={style.formContainer}>
				<Formik
					initialValues={initialValues}
					validationSchema={signInSchema}
					onSubmit={(values) => {
						triggerSignIn(values);
					}}
				>
					{(formik) => {
						const { errors, touched, isValid, dirty } = formik;
						return (
							<Form>
								{headerImage()}

								<div className={style.form}>
									<h1
										className={
											style.headerTitle +
											" " +
											camingoDosProCdSemiBold.className
										}
									>
										Log In
									</h1>
									<p className={style.headerParagraph}>
										Nullam vel nunc eget enim volutpat
										pretium. Nullam orci dolor, hendrerit in
										aliquet varius, facilisis non diam.
										Fusce tristique mauris vel augue aliquam
										fringilla.
									</p>
									<div className={style.formGroup}>
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
									<div className={style.formGroup}>
										<label htmlFor="password">
											Password
										</label>
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
									<div className={style.optionsDiv}>
										<div className={style.checkbox_container}>

												<Field
													type="checkbox"
													name="rememberMe" // Name to link the checkbox to Formik state
													className={
														style.checkbox_input
													}
													checked={
														formik.values.rememberMe
													} // Bind the checkbox state with Formik's value
													onChange={() =>
														formik.setFieldValue(
															"rememberMe",
															!formik.values
																.rememberMe
														)
													} // Toggle the checkbox state on change
												/>
												<div
													className={
														style.checkbox_custom +
														`${
															formik.values
																.rememberMe
																? " checked"
																: ""
														}`
													}
													onClick={() =>
														formik.setFieldValue(
															"rememberMe",
															!formik.values
																.rememberMe
														)
													} // Toggle on click
												>
													{formik.values
														.rememberMe && (
														<div
															className={
																style.checkbox_checkmark
															}
														></div>
													)}
												</div>
												<span className={style.checkbox_text}>
													Remember Me
												</span>
										</div>
										<div className={style.forgotPasswordContainer}>
											<Link href="/">Forgot Password?</Link>
										</div>
									</div>
									<button
										type="submit"
										className={
											style.signInButton +
											" " +
											camingoDosProCdSemiBold.className
										}
										disabled={!isValid || !dirty}
									>
										Log In
									</button>
								</div>
							</Form>
						);
					}}
				</Formik>
			</div>
		</div>
	);
}

export default LoginPage;
