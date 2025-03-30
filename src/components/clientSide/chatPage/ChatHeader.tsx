'use client';

import React, { useEffect } from "react";
import style from "@/src/styles/clientSide/chatPage/ChatHeader.module.scss";
import Image from "next/image";
import logoBlueEN from "@/assets/images/blueLogoEN.png";
import logoBlueLV from "@/assets/images/blueLogoLV.png";
import { useLocale, useTranslations } from "next-intl";
import { IoHomeOutline } from "react-icons/io5";
import { BsEnvelope } from "react-icons/bs";
import { GoPeople } from "react-icons/go";
import { useSession } from "next-auth/react";
import { useLoading } from "@/src/components/misc/LoadingContext";
import defaultImage from "@/assets/images/defaultImage.jpg";
import { useUserStore } from "@/src/store/userStore";
import { camingoDosProCdSemiBold } from "../../misc/fonts";
import { Link } from "@/src/i18n/routing";


function ChatHeader() {
	const locale = useLocale();
	const { data: session } = useSession();
	const { setLoading } = useLoading();
	const { user, fetchUser } = useUserStore();
	const t = useTranslations("chat.chatHeader");

	useEffect(() => {
		if(!session) {
			setLoading(true);
		} else {
			fetchUser(session.user.id);
			setLoading(false);
		}
	}, [session])

	if(!user) {
		return (<>
			<h1 className={style.noUser}>{t("noUser")}</h1>
		</>);
	}
	
	
	return (
		<>
			<div className={style.container}>
				<div className={style.headerButtonsContainer}>
					<div className={style.logoDiv}>
						<Link href={`/`}>
						<Image
							src={locale === "lv" ? logoBlueLV : logoBlueEN}
							alt="logo"
							fill={true}
							style={{ objectFit: "contain" }}
						/>
						</Link>
					</div>
					<div className={style.headerButtons}>
						<IoHomeOutline
							size={"35px"}
							color="#233574"
							className={style.headerIcon}
						/>
						<BsEnvelope
							size={"35px"}
							color="#233574"
							className={style.headerIcon}
						/>
						<GoPeople
							size={"35px"}
							color="#233574"
							className={style.headerIcon}
						/>
					</div>
				</div>
				<div className={style.userProfile}>
					<div className={style.userProfileText}>
						<p
							className={
								camingoDosProCdSemiBold.className +
								" " +
								style.userName
							}
						>
							{user.firstName + " " + user.lastName}
						</p>
					</div>
					<div className={style.userProfileImage}>
						<Image
							src={user.profileImage || defaultImage}
							alt="user profile image"
							width={50}
							height={50}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default ChatHeader;
