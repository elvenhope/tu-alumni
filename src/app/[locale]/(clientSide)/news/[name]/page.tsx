"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/OneEventPage.module.scss";
import { Article } from "@/src/types/types";
import Image from "next/image";
import { camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";

function Page() {
	const searchParams = useSearchParams();

	const articleId = searchParams.get("q");

	const [article, setArticle] = useState<Article>();

	const t = useTranslations("news");

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					pageName: "OneNews",
					id: articleId,
					type: "article",
				}),
			});
			const data = await response.json();
			setArticle(data);
		};

		fetchData();
	}, []);

	if (!article) {
		return (
			<>
				<div>
					<h1>Something went wrong!</h1>
				</div>
			</>
		);
	}

	function getDate() {
		if( article?.day && article.month && article.year) {
			return (
				<>
					{String(article.day).padStart(2, "0")} /{" "}
					{String(article.month).padStart(2, "0")} /{" "}
					{String(article.year).padStart(2, "0")}
				</>
			);
		} else {
			return null;
		}
	}

	return (
		<>
			<div className={style.container}>
				<div className={style.header}>
					<h1 className={camingoDosProCdSemiBold.className}>
						{article.headline}
					</h1>
				</div>
				<div className={style.mobileSignUp}>
					<h1 className={camingoDosProCdSemiBold.className}>
						{getDate()}
					</h1>
				</div>
				<div className={style.pictureContainer}>
					<div className={style.pictureDiv}>
						<div className={style.pictureDescription}>
							<h1 className={camingoDosProCdSemiBold.className}>
								{getDate()}
							</h1>
						</div>
						<Image
							src={article.image}
							alt="Article Image"
							style={{ objectFit: "cover" }}
							fill={true}
						/>
					</div>
					<div
						className={style.description}
						dangerouslySetInnerHTML={{
							__html: article.description,
						}}
					></div>
				</div>
			</div>
		</>
	);
}

export default Page;
