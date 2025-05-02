import { useUserStore } from "@/src/store/userStore";
import React, { JSX, useEffect } from "react";
import style from "@/src/styles/clientSide/chatPage/userPage/UserCard.module.scss";
import Image from "next/image";
import userBackgroundImg from "@/assets/images/userBackground.jpg";
import defaultImage from "@/assets/images/defaultImage.jpg";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { MdOutlinePhone } from "react-icons/md";
import { FaRegEnvelope, FaLinkedin, FaFacebookF } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { GrInstagram } from "react-icons/gr";
import { User } from "@/src/types/types";
import { Link } from "@/src/i18n/routing";

interface Props {
	user: User | null;
}

function UserCard({ user }: Props) {
	const t = useTranslations("chat.userCard");

	function renderContactEntry(icon: JSX.Element, value?: string, isLink?: boolean) {
		if (!value) return null;
		
		const content = (
			<div className={style.contactEntry}>
				{icon}
				<p>{value}</p>
			</div>
		);

		return isLink ? (
			<Link href={value} target="_blank" className={style.contactLink}>
				{content}
			</Link>
		) : content;
	}

	return (
		<div className={style.container}>
			<div className={style.header}>
				<Image
					src={userBackgroundImg}
					alt="background"
					fill={true}
					className={style.backgroundImage}
					style={{ objectFit: "cover" }}
				/>
				<div className={style.userPicture}>
					<Image
						src={user?.profileImage || defaultImage}
						alt="user"
						fill={true}
						style={{ objectFit: "cover" }}
					/>
				</div>
			</div>
			<div className={style.content}>
				<div className={style.userInfo}>
					<h1>
						{user?.firstName} {user?.lastName}
					</h1>
					<p>{user?.interests}</p>
				</div>
				<div className={style.section}>
					<h1>{t("jobExperience")}</h1>
					<p>{user?.jobExperienceDescription}</p>
				</div>
				<div className={style.section}>
					<h1>{t("contacts")}</h1>

					<div className={style.userContactInfo}>
						<div>
							{renderContactEntry(
								<MdOutlinePhone
									size={"25px"}
									color="#233574"
								/>,
								user?.phoneNumber
							)}
							{renderContactEntry(
								<FaRegEnvelope size={"25px"} color="#233574" />,
								user?.email
							)}
							{renderContactEntry(
								<IoIosGlobe size={"25px"} color="#233574" />,
								user?.website,
								true
							)}
						</div>
						<div>
							{renderContactEntry(
								<GrInstagram size={"25px"} color="#233574" />,
								user?.socialInstagram,
								true
							)}
							{renderContactEntry(
								<FaFacebookF size={"25px"} color="#233574" />,
								user?.socialFacebook,
								true
							)}
							{renderContactEntry(
								<FaLinkedin size={"25px"} color="#233574" />,
								user?.socialLinkedin,
								true
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserCard;
