"use client";

import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "../components/misc/LoadingContext";
import { ProviderContent } from "@/src/components/misc/ProviderContent";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LoadingProvider>
                <ProviderContent>{children}</ProviderContent>
            </LoadingProvider>
        </SessionProvider>
    );
}
