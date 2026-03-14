"use client";
import { useUser } from "@/contexts/AuthContext";
import { useHeists } from "@/hooks";
import HeistCard from "@/components/HeistCard";
import HeistCardSkeleton from "@/components/HeistCardSkeleton";
import styles from "./heists.module.css";

function HeistList({ mode }: { mode: "active" | "assigned" }) {
  const { heists, loading, error } = useHeists(mode);

  if (loading)
    return (
      <div className={styles.grid}>
        <HeistCardSkeleton />
        <HeistCardSkeleton />
        <HeistCardSkeleton />
      </div>
    );

  if (error) return <p role="alert">Error: {error.message}</p>;
  if (heists.length === 0) return null;

  return (
    <div className={styles.grid}>
      {heists.map((heist) => (
        <HeistCard key={heist.id} heist={heist} />
      ))}
    </div>
  );
}

export default function HeistsPage() {
  const { user } = useUser();

  return (
    <div className="page-content">
      <div>
        <h2>{user?.displayName ? `${user.displayName}'s Active Heists` : "Your Active Heists"}</h2>
        <HeistList mode="active" />
      </div>
      <div>
        <h2>Heists You&apos;ve Assigned</h2>
        <HeistList mode="assigned" />
      </div>
    </div>
  );
}
