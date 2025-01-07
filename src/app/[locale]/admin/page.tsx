"use client";

import { useSession } from "next-auth/react";

export default function AdminPage() {
	const { data: session } = useSession();

	if (!session) {
		return <p>Access Denied</p>;
	}

	if (session.user.role !== "admin") {
		return <p>Access Denied</p>;
	}

	function getToken() {
		console.log(session);
	}

	return (
		<>
			<h1>Welcome  {session.user.firstName}</h1>
		</>
	)
}
