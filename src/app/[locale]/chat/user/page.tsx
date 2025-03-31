"use client";

import React, { useEffect } from "react";
import style from "@/src/styles/clientSide/chatPage/userPage/UserPage.module.scss";
import UserCard from "@/src/components/clientSide/chatPage/userPage/UserCard";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/src/store/userStore";
import { Link } from "@/src/i18n/routing";

function Page() {

	const { data: session } = useSession();
	const { user, fetchUser } = useUserStore();

	useEffect(() => {
		if (!user && session?.user) {
			fetchUser(session.user.id);
		}
	}, [session, user]);

	return (
		<div className={style.container}>
			<div className={style.header}>
				<Link href="/chat/user/edit" className={style.editButton}>
					Edit
				</Link>
			</div>
			<div className={style.mainContent}>
				<UserCard user={user}/>
			</div>
		</div>
	);
}

export default Page;
