'use client';

import { Article, Gallery } from "@/src/types/types";
import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import { Bounce, toast } from "react-toastify";
import GalleryEditor from "@/src/components/adminSide/adminAboutUs/galleryEditor";

function Page() {
	const [mainArticle, setMainArticle] = useState<Article>();
	const [articles, setArticles] = useState<Article[]>([]);
	const [articleOptions, setArticleOptions] = useState<
		Array<{ value: Article; label: string }>
	>([]);


	const [galleries, setGalleries] = useState<Gallery[]>([]);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const articlesResponse = await fetch("/api/admin/articles");
				if (!articlesResponse.ok) {
					throw new Error(
						`Failed to fetch articles: ${articlesResponse.statusText}`
					);
				}

				const ArticleData: Article[] = await articlesResponse.json();
				setArticles(ArticleData);

				const articleOptions = ArticleData.map((article) => ({
					value: article,
					label: article.headline,
				}));

				setArticleOptions(articleOptions);

				const mainArticleResponse = await fetch("/api/admin/articles?aboutus=true");
				if (!mainArticleResponse.ok) {
					throw new Error(
						`Failed to fetch main article: ${mainArticleResponse.statusText}`
					);
				}

				const mainArticleData: Article = await mainArticleResponse.json();
				setMainArticle(mainArticleData);

				const galleriesResponse = await fetch("/api/admin/galleries");
				if (!galleriesResponse.ok) {
					throw new Error(
						`Failed to fetch galleries: ${galleriesResponse.statusText}`
					);
				}

				const galleriesData: Gallery[] = await galleriesResponse.json();
				setGalleries(galleriesData);
			} catch (err) {
				console.log(err);
			}
		};

		fetchInfo();
	}, []);

	async function saveNewMainArticle(value: Article) {
		const requestObject = {
			id: value?.id,
			aboutUs: true,
		};

		try {
			const updatedArticle = await fetch(`/api/admin/articles`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestObject),
			});

			if (!updatedArticle.ok) {
				throw new Error(
					`Failed to update article: ${updatedArticle.statusText}`
				);
			}

			toast.success("Main article successfully updated", {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: false,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
				transition: Bounce,
			});


			const updatedArticleData: Article = await updatedArticle.json();
			setMainArticle(updatedArticleData);
		} catch (err) {
			console.log(err);
		}
	}

	function newArticleSelected(
		newValue: SingleValue<{ value: Article; label: string }>
	) {
		if(newValue) {
			setMainArticle(newValue?.value);
			saveNewMainArticle(newValue.value);
		}
	}

	function initialGalleryOptions(): Array<{ value: Gallery; label: string }> {
		const returnObject = galleries.map((gallery) => ({
			value: gallery,
			label: gallery.headline,
		}));

		return returnObject;
	}

	return (
		<>
			<div className={style.content}>
				<div className={style.selections}>
					<h1>Main Article</h1>
					<Select
						instanceId={"main-article-select"}
						options={articleOptions}
						onChange={newArticleSelected}
						value={articleOptions.find(
							(option) => option.label === mainArticle?.headline
						)}
						placeholder="Select the article to display on the page"
					/>
					<GalleryEditor selectOptions={initialGalleryOptions()} />
				</div>
			</div>
		</>
	);
}

export default Page;
