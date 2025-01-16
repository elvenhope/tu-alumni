import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "email", type: "email", placeholder: "jsmith@email.com" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials, req) {
				// Replace this with your DB call
				// const user = await fetchUserFromDatabase(credentials);
				const user = {
					"id": "12345",
					"firstName": "John",
					"lastnName": "Doe",
					"password": "123",
					"role": "admin",
					"phoneNumber": "+1234567890",
					"graduatedMajor": "Computer Science",
					"graduatedYear": "2022",
					"email": "john.doe@example.com",
					"location": "New York, NY",
					"jobExperienceDescription": "Software Developer at XYZ Corp",
					"website": "https://johndoe.com",
					"socialFacebook": "https://facebook.com/johndoe",
					"socialInstagram": "https://instagram.com/johndoe",
					"socialLinkedin": "https://linkedin.com/in/johndoe",
					"interests": "Coding, Music, Hiking",
					"whoAmI": "A passionate developer",
					"whatIWantToAchieve": "To become a full-stack developer",
					"whatICanOfferYou": "Expertise in web development",
					"whereCanYouFindMe": "Online or at tech meetups",
					"hashtags": ["#developer", "#tech", "#coding"]
				}
				
				if (user) {
					return user;
				} else {
					return null;
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			// Include the user's role in the session
			if(token) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.expires = new Date(token.exp * 1000).toISOString();
			}
			
			return session;
		},
		async jwt({ token, user, account }) {
			if (user && account) {
				token.id = user.id; // Pass id to the token
				token.role = user.role; // Pass role to the token
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
});

export { handler as GET, handler as POST };