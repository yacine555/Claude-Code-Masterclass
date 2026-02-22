"use client";
import { useUser } from "@/contexts/AuthContext";

export default function HeistsPage() {
  const { user } = useUser();

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>{user?.displayName ? `${user.displayName}'s Active Heists` : "Your Active Heists"}</h2>
      </div>
      <div className="assigned-heists">
        <h2>Heists You've Assigned</h2>
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
      </div>
    </div>
  );
}
