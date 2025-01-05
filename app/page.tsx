'use client'

import React from "react";
import { signIn, signOut } from "next-auth/react";

export default function page() {
	return (
		<>
			<button onClick={() => signIn()}>Sign in</button>
			<button onClick={() => signOut()}>Sign out</button>
		</>
	);
}
