"use client";

import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/chatPage/ChatGroups.module.scss";
import {
	camingoDosProCdRegular,
	camingoDosProCdSemiBold,
} from "../../misc/fonts";
import { useTranslations } from "next-intl";
import CreateGroupModal from "@/src/components/clientSide/chatPage/createGroup/CreateGroupModal";
import { Group } from "@/src/types/types";
import defaultGroupImage from "@/assets/images/defaultgroup.png";
import Image from "next/image";
import { useUserStore } from "@/src/store/userStore";
import JoinGroupModal from "./joinGroup/JoinGroupModal";

function ChatGroups() {
	const t = useTranslations("chat.chatGroups");

	const [createChatModalIsOpen, setCreateChatModalIsOpen] = useState(false);
	const [joinChatModalIsOpen, setJoinChatModalIsOpen] = useState(false);
	const [groups, setGroups] = useState<Group[]>([]);

	const { selectedGroup, setSelectedGroup } = useUserStore();

	async function handleCreateGroup(values: {
		name: string;
		description: string;
		tags: string[];
	}) {
		setCreateChatModalIsOpen(false);

		const { name, description, tags } = values;

		try {
			const response = await fetch("/api/chat/groups/user", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, description, tags }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create group");
			}

			fetchGroups();
		} catch (error) {
			console.error("Error creating group:", error);
		}
	}

	async function fetchGroups() {
		try {
			const response = await fetch("/api/chat/groups/user");
			const data = await response.json();

			if (response.ok) {
				setGroups(data.groups);
				setSelectedGroup(data.groups[0]);
			} else {
				throw new Error(data.error || "Failed to fetch groups");
			}
		} catch (error) {
			console.error("Error fetching groups:", error);
		}
	}

	// Call fetchGroups when the component mounts
	useEffect(() => {
		fetchGroups();
	}, []);

	return (
		<>
			<div className={style.container}>
				<h1
					className={
						camingoDosProCdSemiBold.className +
						" " +
						style.headingText
					}
				>
					{t("groups")}
				</h1>
				<div className={style.groupButtons}>
					<button
						type="button"
						className={`${style.groupButton} ${camingoDosProCdRegular.className}`}
					>
						{t("groups")}
					</button>
					<button
						className={
							style.groupButton +
							" " +
							camingoDosProCdRegular.className
						}
						onClick={() => setCreateChatModalIsOpen(true)}
					>
						{t("createGroup")}
					</button>
					<button
						className={
							style.groupButton +
							" " +
							camingoDosProCdRegular.className
						}
						onClick={() => setJoinChatModalIsOpen(true)}
					>
						{t("joinGroup")}
					</button>
					<button
						className={
							style.groupButton +
							" " +
							camingoDosProCdRegular.className
						}
					>
						{t("memberList")}
					</button>
				</div>
				<div className={style.groupList}>
					{groups.length === 0 ? (
						<p className={style.noGroupsFound}>{t("noGroupsFound")}</p>
					) : (
						groups.map((group) => (
							<div key={group.id} className={style.groupItem} onClick={() => setSelectedGroup(group)}>
								<div className={style.groupProfile}>
									<Image
										src={group.image || defaultGroupImage}
										alt={group.name}
										className={style.groupImage}
										height={77}
									/>
								</div>
								<div className={style.groupDetails}>
									<h3 className={style.groupName + " " + camingoDosProCdSemiBold.className}>
										{group.name}
									</h3>
									<h4 className={style.groupDescription + " " + camingoDosProCdSemiBold.className}>
										{group.description}
									</h4>
								</div>
							</div>
						))
					)}
				</div>
			</div>
			<CreateGroupModal
				isOpen={createChatModalIsOpen}
				onClose={() => setCreateChatModalIsOpen(false)}
				onCreateGroup={handleCreateGroup}
			/>
			<JoinGroupModal isOpen={joinChatModalIsOpen} onClose={() => setJoinChatModalIsOpen(false)} onJoinGroup={() => {console.log("Hello!")}}/>
		</>
	);
}

export default ChatGroups;
