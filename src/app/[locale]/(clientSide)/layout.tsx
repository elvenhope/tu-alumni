import React from "react";
import ClientHeader from "@/src/components/clientSide/ClientHeader";
import ClientFooter from "@/src/components/clientSide/ClientFooter";

async function ClientSideLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<>
			<ClientHeader />
			{children}
			<ClientFooter />
		</>
	);
}

export default ClientSideLayout;
