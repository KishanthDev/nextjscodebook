"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("login") === "true";
        if (isLoggedIn) {
            console.log("Home: Redirecting to /dashboard (isLoggedIn=true)");
            router.push("/home");
        }
    }, [router]);

    return router.push("/auth");
}