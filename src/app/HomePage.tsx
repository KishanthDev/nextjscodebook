"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPage from "./auth/page";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("login") === "true";
        if (isLoggedIn) {
            console.log("Home: Redirecting to /dashboard (isLoggedIn=true)");
            router.push("/home");
        }
    }, [router]);

    return <AuthPage />;
}