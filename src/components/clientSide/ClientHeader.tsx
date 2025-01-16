"use client";

import React from "react";
import style from "@/styles/clientSide/ClientHeader.module.scss";
import Image from "next/image";
import logoWhiteEN from "@/assets/images/whiteLogoEN.png";
import logoWhiteLV from "@/assets/images/whiteLogoLV.png";
import { camingoDosProCdSemiBold } from "@/src/components/fonts";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, Link } from "@/src/i18n/routing";
import { stack as Menu } from "react-burger-menu";

function ClientHeader() {
	const t = useTranslations("header");
	const enLocale = "en";
	const lvLocale = "lv";
	const locale = useLocale();
	const pathname = usePathname();

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
					burgerButtonClassName={style.bmBurgerButton}
					burgerBarClassName={style.bmBurgerBars}
					crossClassName={style.bmCross}
					menuClassName={style.bmMenu}
					overlayClassName={style.bmOverlay}
					itemListClassName={style.bmItemList}
					right={true}
				>
					<div className={style.languageSwitcher}>
						<Link href={pathname} locale={lvLocale}>
							LV
						</Link>
						<span style={{color: "white"}}>|</span>
						<Link href={pathname} locale={enLocale}>
							ENG
						</Link>
					</div>
					<Link href="/">{t("home")}</Link>
					<Link href="/">{t("about")}</Link>
					<Link href="/">{t("events")}</Link>
					<Link href="/">{t("news")}</Link>
					<Link href="/">{t("chat")}</Link>
					<Link href="/login">{t("log-in")}</Link>
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
					<Link href="/">{t("about")}</Link>
					<Link href="/">{t("events")}</Link>
					<Link href="/">{t("news")}</Link>
					<Link href="/">{t("chat")}</Link>
					<Link href="/login">{t("log-in")}</Link>
				</div>
			</div>
		</header>
	);
}

export default ClientHeader;
