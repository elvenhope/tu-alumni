'use client';

import React from "react";
import style from "@/styles/clientSide/ClientHeader.module.scss";
import Image from "next/image";
import logoWhite from "@/assets/images/logoWhite.svg";
import { camingoDosProCdSemiBold } from "@/src/components/fonts";
import { useTranslations } from "next-intl";
import { usePathname, Link } from "@/src/i18n/routing";


function ClientHeader() {
	const t = useTranslations("header");
	const enLocale = "en";
	const lvLocale = "lv";
	const pathname = usePathname();


	return (
		<header className={style.header}>
			<div className={style.logoDiv}>
				<Image src={logoWhite} alt="logo" fill={true} />
			</div>
			<div
				className={
					style.navContainer + " " + camingoDosProCdSemiBold.className
				}
			>
				<div className={style.languageSwitcher}>
					<Link
						href={pathname}
						locale={lvLocale}
					>
						LV
					</Link>
					<span>|</span>
					<Link
						href={pathname}
						locale={enLocale}
					>
						ENG
					</Link>
				</div>
				<div className={style.navLinks}>
					<Link href="/">{t("home")}</Link>
					<Link href="/">{t("about")}</Link>
					<Link href="/">{t("events")}</Link>
					<Link href="/">{t("news")}</Link>
					<Link href="/">{t("chat")}</Link>
					<Link href="/">{t("log-in")}</Link>
				</div>
			</div>
		</header>
	);
}

export default ClientHeader;
