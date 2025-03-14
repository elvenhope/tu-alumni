import type {
	GetServerSidePropsContext,
	NextApiRequest,
	NextApiResponse,
} from "next"
import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDB from "@/src/lib/connectToDB";
import User from "@/src/models/userModel";


export const config = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "email", type: "email", placeholder: "jsmith@email.com" },
				password: { label: "Password", type: "password" },
				rememberMe: { label: "Remember Me", type: "checkbox" },
			},
			async authorize(credentials, req) {
				if (!credentials) {
					return null;
				}
				const { email, password } = credentials;

				await connectToDB();
				
				const user = await User.findOne({ email }).exec();
				if (user) {
					const compareHash = await bcrypt.compare(password, user.password);

					if (email == user.email && compareHash) {
						return user;
					} else {
						return null;
					}
				} else {
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ session, token }) {
			// Include the user's role in the session
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user._id = token._id;
				session.expires = new Date(token.exp * 1000).toISOString();
			}

			return session;
		},
		async jwt({ token, user, account }) {
			if (user && account) {
				token.id = user.id; // Pass id to the token
				token.role = user.role; // Pass role to the token
				token._id = user._id; // Pass _id to the token
				// Set session duration based on "rememberMe" flag
				token.rememberMe = account.rememberMe;
				token.exp = account.rememberMe
					? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 days
					: Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1 day
			}
			return token;
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions

// Use it in server contexts
export function auth(
	...args:
		| [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
		| [NextApiRequest, NextApiResponse]
		| []
) {
	return getServerSession(...args, config)
}