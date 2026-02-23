"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && user && pathname !== "/") {
      router.replace("/heists");
    }
  }, [user, loading, router, pathname]);

  if (loading) return <p role="status" aria-live="polite">Loading…</p>;

  return (
    <main className="public">
      {children}
    </main>
  );
}
