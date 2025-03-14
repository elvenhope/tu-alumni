"use client";

import { useUserStore } from "@/src/store/userStore";
import React from "react";
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

export default function ChatInterface() {
	const { selectedGroup } = useUserStore();

	
	const t = useTranslations("header");
	const enLocale = "en";
	const lvLocale = "lv";
	const pathname = usePathname();

	function theMenuBtn() {
		return (
			<div className={style.menuBtnContainer}>
				<Menu
					burgerButtonClassName={burgerStyle.bmBurgerButton + " " + style.menuBtn}
					burgerBarClassName={burgerStyle.bmBurgerBars + " " + style.menuBtnBars}
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

	return (
		<>
			<div className={style.container}>
				<div className={style.header}>
					<h1 className={camingoDosProCdSemiBold.className}>
						{selectedGroup?.name}
					</h1>
					{theMenuBtn()}
				</div>
				<div className={style.content}></div>
				<div className={style.interface}>
					<div className={style.funBtn}>
						<CiCirclePlus size={40} color="#233774" />
					</div>
					<div className={style.input}>
						<input
							type="text"
							placeholder="Type a message"
							className={style.textInput}
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
					/>
				</div>
			</div>
		</>
	);
}
