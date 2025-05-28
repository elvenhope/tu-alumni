"use client";

import { Article, LocalizedText } from "@/src/types/types";
import React, { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { Bounce, toast } from "react-toastify";
import style from "@/src/styles/adminSide/adminHome.module.scss";
import DescriptionEditor from "@/src/components/misc/descriptionEditor";
import Image from "next/image";
import Select from "react-select";
import { useLoading } from "@/src/components/misc/LoadingContext";

const LANGUAGES = [
	{ value: "en", label: "English" },
	{ value: "lv", label: "Latvian" },
];

function Page() {
	const [articles, setArticles] = useState<Article[]>([]);
	const [selectedArticle, setSelectedArticle] = useState<Article>();
	const [articleOptions, setArticleOptions] = useState<
		Array<{ value: Article; label: string }>
	>([]);
	const [currentLang, setCurrentLang] = useState("en"); // Current editing language
	const { setLoading } = useLoading();
		

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
					label: article.headline?.en || "Untitled",
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
		if (!selectedArticle?.id) return;
		const requestObject = {
			id: selectedArticle.id,
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
		// Init all language fields empty
		const emptyLocalizedText: LocalizedText = { en: "", lv: ""};

		const tmpArticle: Article = {
			headline: emptyLocalizedText,
			description: emptyLocalizedText,
			author: emptyLocalizedText,
			month: 1,
			day: 1,
			year: 2025,
			image: "",
			active: false,
			featured: false,
			dateAdded: new Date().toISOString(),
		};

		setArticleOptions((prevOptions) => [
			...(prevOptions || []),
			{ value: tmpArticle, label: tmpArticle.headline.en || "Untitled" },
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
					author: selectedArticle.author,
					dateAdded: selectedArticle.dateAdded ?? null,
				};

				// Update existing article
				const updatedArticle = await fetch(`/api/admin/articles`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(articleObject),
				});

				if (!updatedArticle.ok) {
					const errorText = await updatedArticle.json();
					throw new Error(
						`Failed to update article: ${errorText.error}`
					);
				} else {

				toast.success("Article updated successfully!", {
					position: "bottom-right",
					autoClose: 10000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
					transition: Bounce,
				});

				console.log("Article updated successfully");
				}
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
					return;
				}

				const articleObject = {
					headline: selectedArticle.headline,
					description: selectedArticle.description,
					month: selectedArticle.month,
					day: selectedArticle.day,
					image: selectedArticle.image,
					active: selectedArticle.active,
					year: selectedArticle.year,
					featured: selectedArticle.featured,
					author: selectedArticle.author,
				};

				// Create new article
				const newArticle = await fetch(`/api/admin/articles`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(articleObject),
				});

				if (!newArticle.ok) {
					const errorText = await newArticle.json();
					throw new Error(
						`Failed to create article: ${errorText.error}`
					);
				} else {
					toast.success("Article created successfully!", {
						position: "bottom-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						theme: "light",
						transition: Bounce,
					});
					const data = await newArticle.json();
					console.log("Article created successfully:", data);
					setSelectedArticle(data);
				}
			}
		} catch (error) {
			toast.error(`Error: ${error}`, {
				position: "bottom-right",
				autoClose: 10000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "light",
				transition: Bounce,
			});
		}
	}

	function ArticleEditor() {
		if (!selectedArticle) return "Something went wrong. Code 108!";

		// Helper to update localized fields
		const updateLocalizedField = (
			field: keyof Pick<Article, "headline" | "description" | "author">,
			value: string
		) => {
			setSelectedArticle((prev) => {
				if (!prev) return prev;
				return {
					...prev,
					[field]: {
						...prev[field],
						[currentLang]: value,
					},
				};
			});
		};

		const handleInputChange = (
			field: keyof Omit<
				Article,
				"image" | "headline" | "description" | "author"
			>,
			value: string | number | boolean
		) => {
			setSelectedArticle((prev) =>
				prev
					? { ...prev, [field]: value }
					: {
							id: "",
							day: 1,
							month: 1,
							year: 2025,
							headline: { en: "", lv: ""},
							description: { en: "", lv: ""},
							author: { en: "", lv: ""},
							image: "",
							active: false,
							featured: false,
							dateAdded: "",
							[field]: value,
					  }
			);
		};

		const handleFileChange = async (file: File | null) => {
			if (file) {
				setLoading(true);
				const formData = new FormData();
				formData.append("file", file);

				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					setLoading(false);
					throw new Error("Failed to upload file");
				}
				setLoading(false);

				const uploadedImageObject = await response.json();

				setSelectedArticle((prev) =>
					prev ? { ...prev, image: uploadedImageObject.url } : prev
				);
			}
		};

		return (
			<div className={style.formDiv}>
				<h2>Edit article</h2>
				<form
					className={style.form}
					onSubmit={(e) => e.preventDefault()}
				>
					<div>
						<label htmlFor="language-select">Language:</label>
						<Select
							instanceId="language-select"
							options={LANGUAGES}
							value={LANGUAGES.find(
								(l) => l.value === currentLang
							)}
							onChange={(option) =>
								setCurrentLang(option?.value || "en")
							}
						/>
					</div>

					{selectedArticle.image ? (
						<div>
							<label>Current Image:</label>
							<div
								className={style.curImageContainer}
								style={{
									position: "relative",
									width: "200px",
									height: "150px",
								}}
							>
								<Image
									src={selectedArticle.image}
									fill={true}
									alt={"Current Image"}
									style={{ objectFit: "contain" }}
								/>
							</div>
						</div>
					) : null}

					<div>
						<label htmlFor="article_day">Day:</label>
						<input
							name="article_day"
							type="number"
							min={1}
							max={31}
							value={selectedArticle.day || ""}
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
							min={1}
							max={12}
							value={selectedArticle.month || ""}
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
							min={2025}
							value={selectedArticle.year || ""}
							onChange={(e) =>
								handleInputChange(
									"year",
									parseInt(e.target.value, 10)
								)
							}
						/>
					</div>

					<div>
						<label htmlFor="headline">
							Headline ({currentLang}):
						</label>
						<input
							name="headline"
							type="text"
							value={
								selectedArticle.headline?.[currentLang] || ""
							}
							onChange={(e) =>
								updateLocalizedField("headline", e.target.value)
							}
						/>
					</div>

					<div>
						<label htmlFor="author">Author ({currentLang}):</label>
						<input
							name="author"
							type="text"
							value={selectedArticle.author?.[currentLang] || ""}
							onChange={(e) =>
								updateLocalizedField("author", e.target.value)
							}
						/>
					</div>

					<div>
						<DescriptionEditor
							key={selectedArticle?.dateAdded + ":" + currentLang}
							description={
								selectedArticle?.description?.[currentLang] ||
								""
							}
							onUpdateDescription={(value) =>
								updateLocalizedField("description", value)
							}
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
						<label htmlFor="featured">Featured:</label>
						<input
							id="featured"
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
