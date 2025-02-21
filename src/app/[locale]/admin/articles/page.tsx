'use client';


import { Article } from "@/src/types/types";
import React, { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { Bounce, toast } from "react-toastify";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import DescriptionEditor from "@/src/components/misc/descriptionEditor";
import Image from "next/image";
import Select from "react-select";


function Page() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [selectedArticle, setSelectedArticle] = useState<Article>();
	const [articleOptions, setArticleOptions] = useState<Array<{ value: Article; label: string }>>([]);

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
			} catch (err) {
				console.log(err);
			}
		};

		fetchInfo();
	}, []);

	function newArticleSelected(
		newValue: SingleValue<{ value: Article; label: string }>
	) {
		setSelectedArticle(newValue?.value);
	}

	async function removeArticle() {
		const requestObject = {
			id: selectedArticle?.id,
		};

		try {
			const updatedArticle = await fetch(`/api/admin/articles`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestObject),
			});

			if (!updatedArticle.ok) {
				throw new Error(
					`Failed to delete article: ${updatedArticle.statusText}`
				);
			}
		} catch (e) {
			console.log(e);
		} finally {
			window.location.reload();
		}
	}

	function addArticle() {
		const tmpArticle = {
			headline: "Untitled",
			description: "",
			month: 1,
			day: 1,
			year: 2025,
			image: "",
			active: false,
			author: "",
			featured: false,
			dateAdded: new Date().toString()
		};

		setArticleOptions((prevOptions) => [
			...(prevOptions || []),
			{ value: tmpArticle, label: tmpArticle.headline },
		]);

		setSelectedArticle(tmpArticle);
	}

	async function saveArticle() {
		if (!selectedArticle) {
			console.error("No article selected");
			return;
		}

		try {
			if (selectedArticle.id) {
				const articleObject = {
					id: selectedArticle.id,
					headline: selectedArticle.headline,
					description: selectedArticle.description,
					month: selectedArticle.month,
					day: selectedArticle.day,
					image: selectedArticle.image,
					active: selectedArticle.active,
					year: selectedArticle.year,
					featured: selectedArticle.featured,
					dateAdded: selectedArticle.dateAdded ?? null
				};

				console.log(articleObject);
				// If ID exists, update the existing headline
				const updatedArticle = await fetch(`/api/admin/articles`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(articleObject),
				});

				if (!updatedArticle.ok) {
					throw new Error(
						`Failed to update article: ${updatedArticle.statusText}`
					);
				}

				console.log("Article updated successfully");
			} else {
				if (!selectedArticle.image) {
					toast.error("Image is required for new articles!", {
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
				}
				{
					const articleObject = {
						headline: selectedArticle.headline,
						description: selectedArticle.description,
						month: selectedArticle.month,
						day: selectedArticle.day,
						image: selectedArticle.image,
						active: selectedArticle.active,
						year: selectedArticle.year,
						featured: selectedArticle.featured,
					};
					// If no ID, create a new article
					const newArticle = await fetch(`/api/admin/articles`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(articleObject),
					});

					if (!newArticle.ok) {
						throw new Error(
							`Failed to create headline: ${newArticle.statusText}`
						);
					}

					const data = await newArticle.json();
					console.log("Article created successfully:", data);
					setSelectedArticle(data); // Update the selected headline with the newly created one
				}
			}
		} catch (error) {
			console.error("Error saving Article:", error);
		} finally {
			window.location.reload();
		}
	}

	function ArticleEditor() {
		const handleInputChange = (
			field: keyof Omit<Article, "image">,
			value: string | number | boolean
		) => {
			setSelectedArticle((prev) => {
				return prev
					? { ...prev, [field]: value }
					: {
							id: "",
							day: 1,
							month: 1,
							year: 2025,
							headline: "",
							description: "",
							image: "",
							author: "",
							active: false,
							featured: false,
							dateAdded: "",
							[field]: value,
					  };
			});
		};

		const handleFileChange = async (file: File | null) => {
			if (file) {
				const formData = new FormData();
				formData.append("file", file);

				// Make the POST request to the upload API
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					throw new Error("Failed to upload file");
				}

				// Extract the uploaded image URL from the response
				const uploadedImageObject = await response.json();

				setSelectedArticle((prev) => {
					return prev
						? { ...prev, image: uploadedImageObject.url }
						: {
								id: "",
								day: 1,
								month: 1,
								year: 2025,
								headline: "",
								description: "",
								active: false,
								author: "",
								featured: false,
								dateAdded: "",
								image: uploadedImageObject.url,
						  };
				});
			}
		};

		if (!selectedArticle) {
			return "Something went wrong. Code 108!";
		}

		return (
			<div className={style.formDiv}>
				<h2>Edit article</h2>
				<form className={style.form}>
					{selectedArticle?.image ? (
						<div>
							<label>Current Image:</label>
							<div className={style.curImageContainer}>
								<Image
									src={selectedArticle?.image}
									fill={true}
									alt={"Current Image"}
								/>
							</div>
						</div>
					) : null}
					<div>
						<label htmlFor="article_day">Day:</label>
						<input
							name="article_day"
							type="number"
							min="1"
							max="31"
							value={selectedArticle?.day || ""}
							onChange={(e) =>
								handleInputChange(
									"day",
									parseInt(e.target.value, 10)
								)
							}
						/>
					</div>
					<div>
						<label htmlFor="article_month">Month:</label>
						<input
							name="article_month"
							type="number"
							min="1"
							max="12"
							value={selectedArticle?.month || ""}
							onChange={(e) =>
								handleInputChange(
									"month",
									parseInt(e.target.value, 10)
								)
							}
						/>
					</div>
					<div>
						<label htmlFor="article_year">Year:</label>
						<input
							name="article_year"
							type="number"
							min="2025"
							value={selectedArticle?.year || ""}
							onChange={(e) =>
								handleInputChange(
									"year",
									parseInt(e.target.value, 10)
								)
							}
						/>
					</div>
					<div>
						<label htmlFor="article">Headline:</label>
						<input
							name="article_article"
							type="text"
							value={selectedArticle?.headline || ""}
							onChange={(e) =>
								handleInputChange("headline", e.target.value)
							}
						/>
					</div>
					<div>
						<label htmlFor="article_article">Author:</label>
						<input
							name="article_article"
							type="text"
							value={selectedArticle?.author || ""}
							onChange={(e) =>
								handleInputChange("author", e.target.value)
							}
						/>
					</div>
					<div>
						<DescriptionEditor
							description={selectedArticle.description}
							onUpdateDescription={(value) => {
								handleInputChange("description", value);
							}}
						/>
					</div>
					<div>
						<label htmlFor="active">Active:</label>
						<input
							id="active"
							type="checkbox"
							checked={selectedArticle.active}
							onChange={(e) =>
								handleInputChange("active", e.target.checked)
							}
						/>
					</div>
					<div>
						<label htmlFor="active">Featured:</label>
						<input
							id="active"
							type="checkbox"
							checked={selectedArticle.featured}
							onChange={(e) =>
								handleInputChange("featured", e.target.checked)
							}
						/>
					</div>
					<div>
						<label htmlFor="article_image">Image:</label>
						<input
							name="article_image"
							type="file"
							accept="image/png, image/jpeg, image/jpg, image/webp"
							onChange={(e) =>
								handleFileChange(
									e.target.files ? e.target.files[0] : null
								)
							}
						/>
					</div>
					<button
						type="button"
						onClick={saveArticle}
						className={style.button_default}
					>
						Save
					</button>
				</form>
			</div>
		);
	}

	return (
		<>
			<div className={style.content}>
				<div className={style.selections}>
					<div className={style.editorHeader}>
						<button
							onClick={addArticle}
							className={style.button_default}
						>
							Add an article
						</button>
						{selectedArticle?.id ? (
							<button
								onClick={removeArticle}
								className={style.button_red}
							>
								Remove an Article
							</button>
						) : null}
					</div>
					<Select
						instanceId={"article-select"}
						options={articleOptions}
						onChange={newArticleSelected}
						value={articleOptions.find(
							(option) => option.value === selectedArticle
						)}
						placeholder="Select an Article"
					/>
					{selectedArticle ? ArticleEditor() : null}
				</div>
			</div>
		</>
	);
}

export default Page;
