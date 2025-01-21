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
					<p>{t("aboutUs")}</p>
					<p>{t("events")}</p>
					<p>{t("media")}</p>
					<p>{t("news")}</p>
					<p>{t("privacyPolicy")}</p>
				</div>
				<div className={style.contentColumn}>
					<h3>{t("forClubMembers")}</h3>
					<p>{t("memberProfile")}</p>
					<p>{t("chat")}</p>
					<p>{t("giftAndDiscounts")}</p>
				</div>
				<div className={style.contentColumn}>
					<h3>{t("contactUs")}</h3>
					<p>
						<TbPhoneRinging /> (+000) 00 000 000
					</p>
					<p>
						<FaRegEnvelope /> example@gmail.com
					</p>
				</div>
			</div>
			<div className={style.footerBottom}>
				<p>&copy; 2021 Business University Turiba</p>
				<div>
					<p>{t("privacyPolicy")}</p>
					<p>{t("termsAndConditions")}</p>
				</div>
			</div>
		</footer>
	);
}

export default ClientFooter;
