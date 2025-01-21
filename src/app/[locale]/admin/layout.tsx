import { getSession } from "next-auth/react";
import React from "react";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import AdminHeader from "@/src/components/adminSide/adminHeader";

async function ClientSideLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	const session = await getSession();

	const messages = await getMessages();

	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as "en" | "lv")) {
		notFound();
	}

	return (
		<NextIntlClientProvider messages={messages} locale={locale}>
			<AdminHeader/>
			{children}
		</NextIntlClientProvider>
	);
}

export default ClientSideLayout;
