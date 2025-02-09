"use client";

import { signOut, useSession } from "next-auth/react";
import style from "@/src/styles/adminSide/adminBase.module.scss";

export default function AdminPage() {
	const { data: session } = useSession();

	if (!session) {
		return <p>Access Denied</p>;	
	}

	const pagesList = [
		{ value: "/admin/homepage", label: "Homepage" },
	]

	return (
		<>
			<div className={style.content}>
				<h1>Welcome {session.user.firstName}</h1>
				<div className={style.selections}>
					{pagesList.map((page) => (
						<a
							key={page.value}
							href={page.value}
							className={style.nav_link}
						>
							{page.label}
						</a>
					))}
				</div>
			</div>
		</>
	);
}
