"use client";

import React, { useEffect } from "react";
import style from "@/src/styles/clientSide/ClientHeader.module.scss";
import burgerStyle from "@/src/styles/misc/burgerMenu.module.scss";
import Image from "next/image";
import logoWhiteEN from "@/assets/images/whiteLogoEN.png";
import logoWhiteLV from "@/assets/images/whiteLogoLV.png";
import { camingoDosProCdSemiBold } from "@/src/components/misc/fonts";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/src/i18n/routing";
import { stack as Menu } from "react-burger-menu";
import { useSession } from "next-auth/react";

function ClientHeader() {
	const t = useTranslations("header");
	const enLocale = "en";
	const lvLocale = "lv";
	const locale = useLocale();
	const pathname = usePathname();
	const { data: session, status } = useSession();
	const showChat = status === "authenticated";

	return (
		<header className={style.header}>
			<div className={style.logoDiv}>
				<Image
					src={locale === "lv" ? logoWhiteLV : logoWhiteEN}
					alt="logo"
					fill={true}
				/>
			</div>
			<div className={style.mobileDiv}>
				<Menu
					burgerButtonClassName={burgerStyle.bmBurgerButton}
					burgerBarClassName={burgerStyle.bmBurgerBars}
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
					<Link href="/">{t("home")}</Link>
					<Link href="/about_us">{t("about")}</Link>
					<Link href="/events">{t("events")}</Link>
					<Link href="/">{t("news")}</Link>
					{showChat ? <Link href="/">{t("chat")}</Link> : null}
					{!showChat ? (
						<Link href="/login">{t("log-in")}</Link>
					) : null}
				</Menu>
			</div>
			<div
				className={
					style.navContainer + " " + camingoDosProCdSemiBold.className
				}
			>
				<div className={style.languageSwitcher}>
					<Link href={pathname} locale={lvLocale}>
						LV
					</Link>
					<span>|</span>
					<Link href={pathname} locale={enLocale}>
						ENG
					</Link>
				</div>
				<div className={style.navLinks}>
					<Link href="/">{t("home")}</Link>
					<Link href="/about_us">{t("about")}</Link>
					<Link href="/events">{t("events")}</Link>
					<Link href="/">{t("news")}</Link>
					{showChat ? <Link href="/">{t("chat")}</Link> : <></>}
					{!showChat ? <Link href="/login">{t("log-in")}</Link> : null}
				</div>
			</div>
		</header>
	);
}

export default ClientHeader;
