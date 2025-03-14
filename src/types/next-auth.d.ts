import NextAuth from "next-auth"

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		id: string,
		_id: string,
		role: string,
		exp: number,
	}
}

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface User {
		id: string,
		_id: string,
		role: string,
	}
	interface Session {
		user: {
			/** The user's postal address. */
			id: string,
			_id: string,
			role: string,
		}
	}
	interface Account {
		rememberMe: boolean;
	}
}