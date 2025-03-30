'use client';

import React, { useEffect } from "react";
import style from "@/src/styles/clientSide/chatPage/ChatMembers.module.scss";
import { useUserStore } from "@/src/store/userStore";
import { camingoDosProCdSemiBold } from "../../misc/fonts";
import { useTranslations } from "next-intl";
import Image from "next/image";
import defaultImage from "@/assets/images/defaultImage.jpg";

function ChatMembers() {
	const { selectedGroup, user } = useUserStore();
	const t = useTranslations("chat.chatMembers");

	return (
		<div className={style.container}>
			<div className={style.header}>
				<div className={style.headerTitle}>
					<h2 className={camingoDosProCdSemiBold.className}>
						{selectedGroup?.name}
					</h2>
				</div>
			</div>
			<div className={style.headerDescription}>
				<p>{selectedGroup?.description}</p>
			</div>
			<div className={style.roleTitle}>
				<h1>{t("admins")}</h1>
			</div>
			<div className={style.membersList}>
				{selectedGroup?.users.map((member) => {
					if (member.role === "Admin") {
						return (
							<div key={member.id} className={style.member}>
								<div className={style.memberAvatar}>
									<Image
										src={
											member.profileImage ?? defaultImage
										}
										alt="avatar"
										width={50}
										height={50}
										className={style.avatar}
									/>
								</div>
								<div className={style.memberName}>
									<p>
										{member.firstName} {member.lastName}
									</p>
								</div>
							</div>
						);
					}
					return null;
				})}
			</div>
			<div className={style.roleTitle}>
				<h1>{t("members")}</h1>
			</div>
			<div className={style.membersList}>
				{selectedGroup?.users.map((member) => {
					if (member.role === "User") {
						return (
							<div key={member.id} className={style.member}>
								<div className={style.memberAvatar}>
									<Image
										src={
											member.profileImage ?? defaultImage
										}
										alt="avatar"
										width={50}
										height={50}
										className={style.avatar}
									/>
								</div>
								<div className={style.memberName}>
									<p>
										{member.firstName} {member.lastName}
									</p>
								</div>
							</div>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
}

export default ChatMembers;
