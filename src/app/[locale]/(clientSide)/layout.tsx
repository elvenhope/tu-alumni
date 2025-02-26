import { getSession } from "next-auth/react";
import React from "react";
import ClientHeader from "@/src/components/clientSide/ClientHeader";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ClientFooter from "@/src/components/clientSide/ClientFooter";
import LoadingSpinner from "@/src/components/misc/LoadingSpinner";
import { LoadingProvider } from "@/src/components/misc/LoadingContext";

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
			<ClientHeader />
			{children}
			<ClientFooter />
		</NextIntlClientProvider>
	);
}

export default ClientSideLayout;
