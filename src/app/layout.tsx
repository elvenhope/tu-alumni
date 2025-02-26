import type { Metadata } from "next";
import "@/src/app/globals.css";
import Providers from "@/src/app/providers";

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
			<Providers>
				{children}
			</Providers>
		</html>
	);
}
