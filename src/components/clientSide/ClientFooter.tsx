import React from "react";
import style from "@/src/styles/clientSide/ClientFooter.module.scss";
import Image from "next/image";
import logoWhiteEN from "@/assets/images/whiteLogoEN.png";
import logoWhiteLV from "@/assets/images/whiteLogoLV.png";
import { FaRegEnvelope } from "react-icons/fa";
import { TbPhoneRinging } from "react-icons/tb";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";

function ClientFooter() {
	const t = useTranslations("footer");
	const locale = useLocale();
	const joinLink =
		locale == "lv"
			? "https://batis.turiba.lv/absolventuklubs"
			: "https://batis.turiba.lv/absolventuklubs/club.asp";

	return (
		<footer className={style.footer}>
			<div className={style.footerContent}>
				<div className={style.logoAndFormDiv}>
					<div className={style.logoDiv}>
						<Image
							src={locale == "lv" ? logoWhiteLV : logoWhiteEN}
							alt="logo"
							fill={true}
						/>
					</div>
					<form>
						<p>{t("message1")}</p>
						{/* TODO: Change this to be a submit button */}
						<Link
							href={joinLink}
							className={style.formSubmitBtn}
							type="button"
						>
							{t("joinUs")}
						</Link>
					</form>
				</div>
				<div className={style.contentColumn}>
					<h3>{t("information")}</h3>
					<Link href="/about_us" className={style.footerLink}>
						{t("aboutUs")}
					</Link>
					<Link href="/events" className={style.footerLink}>
						{t("events")}
					</Link>
					{/* <Link href="/media" className={style.footerLink}>
						{t("media")}
					</Link> */}
					<Link href="/news" className={style.footerLink}>
						{t("news")}
					</Link>
					{/* <Link href="/privacy-policy" className={style.footerLink}>
						{t("privacyPolicy")}
					</Link> */}
				</div>
				<div className={style.contentColumn}>
					<h3>{t("forClubMembers")}</h3>
					<Link href="/chat/user" className={style.footerLink}>
						{t("memberProfile")}
					</Link>
					<Link href="/chat" className={style.footerLink}>
						{t("chat")}
					</Link>
				</div>
				<div className={style.contentColumn}>
					<h3>{t("contactUs")}</h3>
					{/* <a href="tel:+00000000000" className={style.footerLink}>
						<TbPhoneRinging /> (+000) 00 000 000
					</a>
					<a href="mailto:example@gmail.com" className={style.footerLink}>
						<FaRegEnvelope /> example@gmail.com
					</a> */}
				</div>
			</div>
			<div className={style.footerBottom}>
				<p>&copy; 2021 Business University Turiba</p>
				<div>
					<Link href="/privacy-policy" className={style.footerLink}>
						{t("privacyPolicy")}
					</Link>
					<Link href="/terms-and-conditions" className={style.footerLink}>
						{t("termsAndConditions")}
					</Link>
				</div>
			</div>
		</footer>
	);
}

export default ClientFooter;
