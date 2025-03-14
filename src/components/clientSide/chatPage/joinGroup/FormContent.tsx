"use client";

import React, { useEffect, useState } from "react";
import styles from "@/src/styles/clientSide/chatPage/joinGroup/FormContent.module.scss"; // Import CSS module
import { Group } from "@/src/types/types";
import Image from "next/image";
import defaultUserImage from "@/assets/images/defaultImage.jpg";
import defaultGroupImage from "@/assets/images/defaultgroup.png";

interface props {
	onSubmit: (arg0: string) => void;
}

export default function FormContent({ onSubmit }: props) {
	const [groups, setGroups] = useState<Group[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [search, setSearch] = useState("");
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	useEffect(() => {
		fetchGroups();
		fetchTags();
	}, []);

	const fetchGroups = async () => {
		try {
			const res = await fetch("/api/chat/groups");
			const data = await res.json();
			setGroups(data.groups);
		} catch (error) {
			console.error("Error fetching groups:", error);
		}
	};

	const fetchTags = async () => {
		try {
			const res = await fetch("/api/chat/tags");
			const data = await res.json();
			setTags(data.tags);
		} catch (error) {
			console.error("Error fetching tags:", error);
		}
	};

	const handleTagSelection = (tag: string) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		);
	};

	const filteredGroups = groups.filter((group) => {
		const matchesSearch = group.name
			.toLowerCase()
			.includes(search.toLowerCase());
		const matchesTags =
			selectedTags.length === 0 ||
			selectedTags.some((tag) => group.tags.includes(tag));
		return matchesSearch && matchesTags;
	});

	return (
		<div className={styles.container}>
			{/* Search Bar */}
			<input
				type="text"
				placeholder="Search by group name..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className={styles.searchBar}
			/>

			{/* Tag Filter */}
			<div className={styles.tagContainer}>
				{tags.map((tag) => (
					<button
						key={tag}
						onClick={() => handleTagSelection(tag)}
						className={`${styles.tagButton} ${
							selectedTags.includes(tag) ? styles.active : ""
						}`}
					>
						{tag}
					</button>
				))}
			</div>

			{/* Group List */}
			<div className={styles.groupList}>
				{filteredGroups.map((group) => (
					<div key={group.id} className={styles.groupItem}>
						{/* Group Picture */}
						<Image
							src={group.image || defaultGroupImage}
							alt={group.name}
							className={styles.groupPicture}
							width={50}
							height={50}
						/>

						{/* Group Details */}
						<div className={styles.groupDetails}>
							<h3 className={styles.groupTitle}>{group.name}</h3>
							<p className={styles.groupDescription}>
								{group.description}
							</p>

							{/* Member Avatars */}
							<div className={styles.memberAvatars}>
								{group.users
									.slice(0, 5)
									.map((member, index) => (
										<Image
											key={index}
											src={
												member.profileImage ||
												defaultUserImage
											}
											alt="Member"
											className={styles.memberAvatar}
											width={25}
											height={25}
										/>
									))}
							</div>
						</div>

						{/* Join Button */}
						<button className={styles.joinButton} onClick={() => {onSubmit(group.id)}}>Join</button>
					</div>
				))}
			</div>
		</div>
	);
}
