import type { Metadata } from "next";
import "@/src/app/globals.css";
import { camingoDosProCdRegular } from "@/src/components/misc/fonts";
import Providers from "@/src/app/providers";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
	title: "TU Alumni",
	description: "Turiba Alumni Club",
};

export default async function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	

	return (
		<html lang={locale}>
			<body className={`${camingoDosProCdRegular.className}`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
