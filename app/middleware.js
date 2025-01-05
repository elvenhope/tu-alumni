import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	const { pathname } = request.nextUrl;

	// Protect the admin route
	if (pathname.startsWith("/admin")) {
		if (!token || token.role !== "admin") {
			return NextResponse.redirect(
				new URL("/api/auth/signin", request.url)
			);
		}
	}

	// Protect user pages
	if (pathname.startsWith("/user")) {
		if (!token) {
			return NextResponse.redirect(
				new URL("/api/auth/signin", request.url)
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/user/:path*"],
};
