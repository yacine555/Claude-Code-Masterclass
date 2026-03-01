"use client";
import { useUser } from "@/contexts/AuthContext";
import { useHeists } from "@/hooks";

function HeistList({ mode }: { mode: "active" | "assigned" | "expired" }) {
  const { heists, loading, error } = useHeists(mode);

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error.message}</p>;
  if (heists.length === 0) return <p>No heists found.</p>;

  return (
    <ul>
      {heists.map((heist) => (
        <li key={heist.id}>{heist.title}</li>
      ))}
    </ul>
  );
}

export default function HeistsPage() {
  const { user } = useUser();

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>{user?.displayName ? `${user.displayName}'s Active Heists` : "Your Active Heists"}</h2>
        <HeistList mode="active" />
      </div>
      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        <HeistList mode="assigned" />
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        <HeistList mode="expired" />
      </div>
    </div>
  );
}
