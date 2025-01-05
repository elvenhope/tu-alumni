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
			session.user.role = token.role;
			return session;
		},
		async jwt({ token, user }) {
			if (user) token.role = user.role; // Pass role to the token
			return token;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };