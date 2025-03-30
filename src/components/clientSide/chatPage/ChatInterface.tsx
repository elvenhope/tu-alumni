"use client";

import { useUserStore } from "@/src/store/userStore";
import React, { useEffect, useState } from "react";
import style from "@/src/styles/clientSide/chatPage/ChatInterface.module.scss";
import { camingoDosProCdSemiBold } from "../../misc/fonts";
import { CiCirclePlus } from "react-icons/ci";
import Image from "next/image";
import emojiSelector from "@/assets/images/emojiSelector.png";
import { IoSend } from "react-icons/io5";
import { slide as Menu } from "react-burger-menu";
import burgerStyle from "@/src/styles/misc/burgerMenu.module.scss";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/routing";
import ChatHeader from "./ChatHeader";
import ChatGroups from "./ChatGroups";
import { useSocketStore } from "@/src/store/socketStore";
import { useLoading } from "@/src/components/misc/LoadingContext";
import { useThrottledMessages } from "@/src/lib/useThrottledMessages";
import { Message } from "@/src/types/types";
import defaultImage from "@/assets/images/defaultImage.jpg";

export default function ChatInterface() {
	const { selectedGroup, user } = useUserStore();
	const {
		localMessages,
		sendMessage,
		initSocket,
		updateSocket,
		socket,
		isConnected,
		clearLocalMessages,
		fetchLocalMessages,
	} = useSocketStore();
	const { setLoading } = useLoading();
	const t = useTranslations("header");
	const enLocale = "en";
	const lvLocale = "lv";
	const pathname = usePathname();
	const [message, setMessage] = useState("");

	//const host = "http://tu-alumni-party.elvenhope.partykit.dev";
	const host = "http://localhost:1999";
	// Set loading based on connection status
	useEffect(() => {
		setLoading(!isConnected);
	}, [isConnected, setLoading]);

	useEffect(() => {
		if (!selectedGroup?.id) return;

		if (!socket) {
			// Initialize the socket if none exists
			initSocket({
				host: host,
				room: selectedGroup.id,
			});
			fetchLocalMessages(selectedGroup.id);
		} else {
			clearLocalMessages();
			// Update the socket by disconnecting and reinitializing
			updateSocket({
				host: host,
				room: selectedGroup.id,
			});
			fetchLocalMessages(selectedGroup.id);
		}
	}, [selectedGroup?.id]);


	// Use our custom hook to throttle updates to the message list
	const throttledMessages = useThrottledMessages(localMessages, 300);

	function theMenuBtn() {
		return (
			<div className={style.menuBtnContainer}>
				<Menu
					burgerButtonClassName={
						burgerStyle.bmBurgerButton + " " + style.menuBtn
					}
					burgerBarClassName={
						burgerStyle.bmBurgerBars + " " + style.menuBtnBars
					}
					crossClassName={burgerStyle.bmCross}
					menuClassName={burgerStyle.bmMenu}
					overlayClassName={burgerStyle.bmOverlay}
					itemListClassName={burgerStyle.bmItemList}
					right={true}
				>
					<div className={style.languageSwitcher}>
						<Link href={pathname} locale={lvLocale}>
							LV
						</Link>
						<span style={{ color: "white" }}>|</span>
						<Link href={pathname} locale={enLocale}>
							ENG
						</Link>
					</div>
					<ChatHeader />
					<ChatGroups />
				</Menu>
			</div>
		);
	}

	const handleSend = () => {
		if (message.trim() !== "" && user && user.id && selectedGroup) {
			const newMessage: Message = {
				content: message,
				authorFirstName: user.firstName,
				authorLastName: user.lastName,
				authorId: user.id,
				authorImage: user.profileImage ?? defaultImage.src,
				targetGroupId: selectedGroup.id,
				timestamp: new Date().toISOString(),
				// (other properties as needed)
			};
			sendMessage({ type: "local", message: newMessage, user });
			setMessage("");
		}
	};

	function returnProperStyle(curMessage: Message) {
		if(curMessage.authorId == user?.id) {
			return " " + style.content_self
		} else {
			return " " + style.content_other;
		}
	}

	function messageSelfOrOtherClass(curMessage: Message) {
		if (curMessage.authorId == user?.id) {
			return " " + style.message_self;
		} else {
			return "";
		}
	}

	return (
		<>
			<div className={style.container}>
				<div className={style.header}>
					<h1 className={camingoDosProCdSemiBold.className}>
						{selectedGroup?.name}
					</h1>
					{theMenuBtn()}
				</div>
				<div className={style.content}>
					{throttledMessages.map((curMessage) => (
						<div
							className={style.message + messageSelfOrOtherClass(curMessage)}
							key={curMessage.id}
						>
							<Image
								src={curMessage.authorImage}
								width={60}
								height={60}
								alt="User Avatar"
								style={{ borderRadius: "50px" }}
							/>
							<div
								className={
									style.msgContent +
									returnProperStyle(curMessage)
								}
							>
								<p
									className={
										style.authorName +
										" " +
										camingoDosProCdSemiBold.className
									}
								>
									{curMessage.authorFirstName + " "}
									{curMessage.authorLastName}
								</p>
								<p>{curMessage.content}</p>
							</div>
						</div>
					))}
				</div>
				<div className={style.interface}>
					<div className={style.funBtn}>
						<CiCirclePlus size={40} color="#233774" />
					</div>
					<div className={style.input}>
						<input
							type="text"
							placeholder="Type a message"
							className={style.textInput}
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") handleSend();
							}}
						/>
						<Image
							src={emojiSelector}
							alt="Emoji Selector"
							width={40}
							height={40}
							className={style.funBtn}
						/>
					</div>
					<IoSend
						size={55}
						color="#233774"
						className={style.funBtn}
						onClick={handleSend}
					/>
				</div>
			</div>
		</>
	);
}
