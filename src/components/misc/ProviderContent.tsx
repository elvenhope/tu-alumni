"use client";

import { useLoading } from "./LoadingContext";
import { camingoDosProCdRegular } from "@/src/components/misc/fonts";
import LoadingSpinner from "@/src/components/misc/LoadingSpinner";
import { ToastContainer } from "react-toastify";

interface ProviderContentProps {
    children: React.ReactNode;
}

export function ProviderContent({ children }: ProviderContentProps) {
    const { isLoading } = useLoading();

    return (
        <body
            className={`${camingoDosProCdRegular.className} ${
                isLoading ? "no-scroll" : ""
            }`}
        >
            {children}
            <ToastContainer />
            <LoadingSpinner />
        </body>
    );
}