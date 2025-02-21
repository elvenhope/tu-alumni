"use client";

import { Article } from "@/src/types/types";
import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/NewsPage.module.scss"
import Image from "next/image";
import { camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import loadingSpinnerStyle from "@/src/styles/misc/loadingSpinner.module.scss";

function Page() {
	const [articles, setArticles] = useState<Array<Article>>([]);
	const [newestArticles, setNewestArticles] = useState<Array<Article>>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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
			
			setNewestArticles(sortedArticles.slice(0, 5))
			setLoading(false)
		};

		fetchData();
	}, []);

	function LoadingSpinner() {
		return (
			<div className={loadingSpinnerStyle.loadingContainer}>
				<div className={loadingSpinnerStyle.spinner}></div>
			</div>
		);
	}

	if(loading) {
		return LoadingSpinner();
	}


	return (
		<>
			<div className={style.container}>
				<div className={style.newestSection}>
					<h1>NEWEST</h1>
					<div className={style.newestContent}>
						<div className={style.numberOne}>
							<div className={style.thumbnailContainer}>
								<Image src={newestArticles[0].image} alt="Newest Article Image" fill={true}
								style={{objectFit: "contain"}}/>
							</div>
							<h1 className={camingoDosProCdSemiBold.className}>{newestArticles[0].headline}</h1>
							<div className={style.description} dangerouslySetInnerHTML={{__html: newestArticles[0].description}}>
							</div>
						</div>
						<div className={style.listing}>
							{newestArticles.slice(1, 5).map((article) => {
								return (
									<div className={style.item} key={article.id}>
										<div className={style.itemThumbnail}>
											<Image src={article.image} fill={true} style={{objectFit: "contain", objectPosition: "center"}} alt="Article Image"/>
										</div>
										<div className={style.itemContent}>
											<h1>{article.headline}</h1>
											<div className={style.description} dangerouslySetInnerHTML={{__html: article.description}}></div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Page;
