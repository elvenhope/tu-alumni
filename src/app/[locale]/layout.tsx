import React from "react";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

async function ClientSideLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	// const session = await getSession();

	const messages = await getMessages();

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as "en" | "lv")) {
		notFound();
	}

	return (
		<NextIntlClientProvider messages={messages} locale={locale}>
			{children}
		</NextIntlClientProvider>
	);
}

export default ClientSideLayout;
