'use client';

import React, { useEffect } from "react";
import style from "@/src/styles/misc/loadingSpinner.module.scss";
import { useLoading } from "@/src/components/misc/LoadingContext";

function LoadingSpinner() {
	const { isLoading } = useLoading();

	useEffect(() => {
		console.log("Spinner " + isLoading);
	}, [isLoading])

	return (
		// <div className={style.loadingContainer}>
		// 	<div className={style.spinner}></div>
		// </div>
		<div
			className={style.loading}
			style={{ display: isLoading ? "block" : "none" }}
		>
			<div className={style.loader}>
				<div className={style.inner + " " + style.one}></div>
				<div className={style.inner + " " + style.two}></div>
				<div className={style.inner + " " + style.three}></div>
			</div>
		</div>
	);
}

export default LoadingSpinner;
