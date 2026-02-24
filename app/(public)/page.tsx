"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/AuthContext";
import Link from "next/link";
import { Bebas_Neue, DM_Mono } from "next/font/google";
import styles from "./splash.module.css";

const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] });
const dmMono = DM_Mono({ weight: ["400"], subsets: ["latin"] });

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.replace("/heists");
  }, [user, loading, router]);

  if (loading) return <p role="status" aria-live="polite">Loading…</p>;

  return (
    <div className={styles.splash}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>
        <span className={`${styles.badge} ${dmMono.className}`}>
          ◈ Classified Briefing ◈
        </span>

        <h1 className={`${styles.title} ${bebasNeue.className}`}>
          Pocket<br />Heist
        </h1>

        <p className={styles.tagline}>
          Every great score starts with the right crew.<br />
          Build yours.
        </p>

        <div className={styles.actions}>
          <Link href="/signup" className="btn">
            Join the Crew
          </Link>
          <p className={styles.loginLink}>
            Already have access?{" "}
            <Link href="/login">Log in</Link>
          </p>
        </div>
      </div>

      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerBR} aria-hidden="true" />
    </div>
  );
}
