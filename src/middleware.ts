import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';

const publicPages = [
	'/',
	'/login',
	'/about_us',
	'/events',
	'/events/.+',
	'/news',
	'/news/.+'
	// (/secret requires auth)
];

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
	// Note that this callback is only invoked if
	// the `authorized` callback has returned `true`
	// and not for pages listed in `pages`.
	(req) => intlMiddleware(req),
	{
		callbacks: {
			authorized: ({ token }) => token != null
		},
		pages: {
			signIn: '/login'
		}
	}
);

export default async function middleware(req: NextRequest) {
	const publicPathnameRegex = RegExp(
		`^(/(${routing.locales.join('|')}))?(${publicPages
			.flatMap((p) => (p === '/' ? ['', '/'] : p))
			.join('|')})/?$`,
		'i'
	);
	const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

	const { pathname } = req.nextUrl;

	// Match locale prefixes using the routing configuration
	const localeRegex = new RegExp(`^/(${routing.locales.join('|')})(/|$)`, 'i');
	const match = pathname.match(localeRegex);

	let locale = null;
	let adjustedPathname = pathname;

	if (match) {
		locale = match[1]; // Extract the locale
		adjustedPathname = pathname.replace(localeRegex, '/'); // Remove the locale prefix
	}


	//Add new middlewares and such here
	// Use `getToken` to check for a valid session
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

	const currentTime = Date.now() / 1000; // Get the current time in seconds
	if (token && token.exp < currentTime) {
		// If token is expired, redirect to the login page
		return NextResponse.redirect(new URL('/login', req.url));
	}

	// Redirect signed-in users away from the login page
	if (token && adjustedPathname === "/login") {
		return NextResponse.redirect(new URL('/', req.url));
	}

	if (adjustedPathname.startsWith("/api/chat") && !token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (adjustedPathname.startsWith("/api/admin") && (!token || token.role !== "Admin")) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	if (isPublicPage) {
		return intlMiddleware(req);
	} else {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (authMiddleware as any)(req);
	}
}

export const config = {
	// Skip all paths that should not be internationalized
	matcher: ['/((?!api|_next|.*\\..*).*)']
};
