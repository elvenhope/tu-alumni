"use client";

import React from "react";
import ChatHeader from "@/src/components/clientSide/chatPage/ChatHeader";
import style from "@/src/styles/clientSide/chatPage/ChatPage.module.scss";
import ChatGroups from "@/src/components/clientSide/chatPage/ChatGroups";
import ChatInterface from "@/src/components/clientSide/chatPage/ChatInterface";
import useMemberStore from "@/src/store/memberStore";
import ChatMembers from "@/src/components/clientSide/chatPage/ChatMembers";

function Page() {
	const { isDisplayed } = useMemberStore();

	return (
		<>
			<div className={style.chatPage_container}>
				<div className={style.section1}>
					<ChatHeader />
					<ChatGroups />
				</div>
				<div className={style.section2}>
					<ChatInterface />
				</div>
				{isDisplayed ? 
					<div className={style.section3}>
						<ChatMembers />
					</div> : null}
			</div>
		</>
	);
}

export default Page;
