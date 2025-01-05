import NextAuth from "next-auth"

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		role: string
	}
}

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface User {
		id: string,
		firstName: string,
		lastnName: string,
		password: string,
		role: string,
		phoneNumber: string,
		graduatedMajor: string,
		graduatedYear: string,
		email: string,
		location: string,
		jobExperienceDescription: string,
		website: string,
		socialFacebook: string,
		socialInstagram: string,
		socialLinkedin: string,
		interests: string,
		whoAmI: string,
		whatIWantToAchieve: string,
		whatICanOfferYou: string,
		whereCanYouFindMe: string,
		hashtags: Array<string>,
	}
	interface Session {
		user: {
			/** The user's postal address. */
			id: string,
			firstName: string,
			lastnName: string,
			password: string,
			role: string,
			phoneNumber: string,
			graduatedMajor: string,
			graduatedYear: string,
			email: string,
			location: string,
			jobExperienceDescription: string,
			website: string,
			socialFacebook: string,
			socialInstagram: string,
			socialLinkedin: string,
			interests: string,
			whoAmI: string,
			whatIWantToAchieve: string,
			whatICanOfferYou: string,
			whereCanYouFindMe: string,
			hashtags: Array<string>,
		}
	}
}