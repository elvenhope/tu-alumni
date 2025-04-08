"use client";

import React, { useEffect } from "react";
import style from "@/src/styles/adminSide/adminHeader.module.scss";
import baseStyle from "@/src/styles/adminSide/adminBase.module.scss";
import { usePathname, Link } from "@/src/i18n/routing";
import { stack as Menu } from "react-burger-menu";
import { useLocale, useTranslations } from "next-intl";
import logoWhiteEN from "@/assets/images/whiteLogoEN.png";
import logoWhiteLV from "@/assets/images/whiteLogoLV.png";
import burgerStyles from "@/src/styles/misc/burgerMenu.module.scss";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useUserStore } from "@/src/store/userStore";

function AdminHeader() {
	const enLocale = "en";
	const lvLocale = "lv";
	const locale = useLocale();
	const pathname = usePathname();
	const t = useTranslations("header");

	const { data: session } = useSession();
	const { user, fetchUser } = useUserStore();

	useEffect(() => {
		if (session?.user?.id && !user) {
			fetchUser(session.user.id);
		}
	}, [session?.user?.id, user, fetchUser]);

	const pagesList = [
		{ value: "/admin/homepage", label: "Homepage" },
		{ value: "/admin/articles", label: "Articles" },
		{ value: "/admin/about_us", label: "About Us" },
		{ value: "/admin/events", label: "Events" },
		{ value: "/admin/users", label: "Users" },
		{ value: "/admin/groups", label: "Groups" },
	];

	return (
		<>
			<header className={style.header}>
				<Link href="/admin">
					<div className={style.logoDiv}>
						<Image
							src={locale === "lv" ? logoWhiteLV : logoWhiteEN}
							alt="logo"
							fill={true}
						/>
					</div>
				</Link>
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
					<Link href="/about_us">{t("about")}</Link>
					<Link href="/events">{t("events")}</Link>
					<Link href="/news">{t("news")}</Link>
					<Link href="/chat">{t("chat")}</Link>
					<button
						className={style.signOutBtn}
						onClick={() => signOut()}
					>
						Sign out
					</button>
				</Menu>
			</header>
			<div className={baseStyle.content}>
				<h1>Welcome {user?.firstName || "Loading..."}</h1>
				<div className={baseStyle.selections}>
					{pagesList.map((page) => (
						<a
							key={page.value}
							href={page.value}
							className={baseStyle.nav_link}
						>
							{page.label}
						</a>
					))}
				</div>
			</div>
		</>
	);
}

export default AdminHeader;
