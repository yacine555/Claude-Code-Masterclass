"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/AuthContext";
// components
import Navbar from "@/components/Navbar";

export default function HeistsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p role="status" aria-live="polite">Loading…</p>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
