"use client";

import React from "react";
import style from "@/src/styles/adminSide/adminHeader.module.scss";
import { usePathname, Link } from "@/src/i18n/routing";
import { stack as Menu } from "react-burger-menu";
import { useLocale, useTranslations } from "next-intl";
import logoWhiteEN from "@/assets/images/whiteLogoEN.png";
import logoWhiteLV from "@/assets/images/whiteLogoLV.png";
import burgerStyles from "@/src/styles/misc/burgerMenu.module.scss";
import Image from "next/image";
import { signOut } from "next-auth/react";

function AdminHeader() {
	const enLocale = "en";
	const lvLocale = "lv";
	const locale = useLocale();
	const pathname = usePathname();
	const t = useTranslations("header");

	return (
		<header className={style.header}>
			<div className={style.logoDiv}>
				<Image
					src={locale === "lv" ? logoWhiteLV : logoWhiteEN}
					alt="logo"
					fill={true}
				/>
			</div>
			<Menu
				burgerButtonClassName={burgerStyles.bmBurgerButton}
				burgerBarClassName={burgerStyles.bmBurgerBars}
				crossClassName={burgerStyles.bmCross}
				menuClassName={burgerStyles.bmMenu}
				overlayClassName={burgerStyles.bmOverlay}
				itemListClassName={burgerStyles.bmItemList}
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
				<Link href="/">{t("home")}</Link>
				<Link href="/">{t("about")}</Link>
				<Link href="/">{t("events")}</Link>
				<Link href="/">{t("news")}</Link>
				<Link href="/">{t("chat")}</Link>
				<button className={style.signOutBtn} onClick={() => signOut()}>Sign out</button>
			</Menu>
		</header>
	);
}

export default AdminHeader;
