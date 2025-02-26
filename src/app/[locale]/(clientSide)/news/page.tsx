"use client";

import { Article } from "@/src/types/types";
import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/NewsPage.module.scss";
import Image from "next/image";
import { camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { generateUrlName } from "@/src/lib/generateUrlName";
import LoadingSpinner from "@/src/components/misc/LoadingSpinner";
import { useLoading } from "@/src/components/misc/LoadingContext";

function Page() {
	const [articles, setArticles] = useState<Array<Article>>([]);
	const [newestArticles, setNewestArticles] = useState<Array<Article>>([]);
	const { isLoading, setLoading } = useLoading();
	const t = useTranslations("news");

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			const response = await fetch("/api/content", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ pageName: "News" }),
			});
			const data = await response.json();
			setArticles(data.articles);

			// Sort articles by dateAdded in descending order
			const sortedArticles = data.articles.sort(
				(a: Article, b: Article) =>
					new Date(b.dateAdded).getTime() -
					new Date(a.dateAdded).getTime()
			);

			setNewestArticles(sortedArticles.slice(0, 5));
			setLoading(false);
		};

		fetchData();

		console.log(isLoading);
	}, []);

	return (
		<>
			{isLoading == false ? (
				<div className={style.container}>
					<div className={style.newestSection}>
						<h1>{t("newest")}</h1>
						<div className={style.newestContent}>
							{newestArticles.length > 0 ? (
								<div className={style.numberOne}>
									<Link
										href={
											"/news/" +
											generateUrlName(
												newestArticles[0].headline
											) +
											"?q=" +
											newestArticles[0].id
										}
									>
										<div
											className={style.thumbnailContainer}
										>
											<Image
												src={newestArticles[0].image}
												alt="Newest Article Image"
												fill={true}
												style={{ objectFit: "contain" }}
											/>
										</div>
										<h1
											className={
												camingoDosProCdSemiBold.className
											}
										>
											{newestArticles[0].headline}
										</h1>
									</Link>
									<div
										className={style.description}
										dangerouslySetInnerHTML={{
											__html: newestArticles[0]
												.description,
										}}
									></div>
								</div>
							) : null}
							<div className={style.listing}>
								{newestArticles.slice(1, 5).map((article) => {
									return (
										<div
											className={style.item}
											key={article.id}
										>
											<Link
												href={
													"/news/" +
													generateUrlName(
														article.headline
													) +
													"?q=" +
													article.id
												}
											>
												<div
													className={
														style.itemThumbnail
													}
												>
													<Image
														src={article.image}
														fill={true}
														style={{
															objectFit:
																"contain",
															objectPosition:
																"center",
														}}
														alt="Article Image"
													/>
												</div>
												<div
													className={
														style.itemContent
													}
												>
													<h1>{article.headline}</h1>
													<div
														className={
															style.description
														}
														dangerouslySetInnerHTML={{
															__html: article.description,
														}}
													></div>
												</div>
											</Link>
										</div>
									);
								})}
							</div>
						</div>
					</div>
					<div className={style.generalSection}>
						{articles.slice(5).map((article) => {
							return (
								<>
									<div
										className={style.articleBlock}
										key={article.id}
									>
										<div
											className={style.thumbnailContainer}
										>
											<Image
												src={article.image}
												alt="Newest Article Image"
												fill={true}
												style={{ objectFit: "contain" }}
											/>
										</div>
										<h1
											className={
												camingoDosProCdSemiBold.className
											}
										>
											{article.headline}
										</h1>
										<div
											className={style.description}
											dangerouslySetInnerHTML={{
												__html: article.description,
											}}
										></div>
									</div>
								</>
							);
						})}
					</div>
				</div>
			) : null}
		</>
	);
}

export default Page;
