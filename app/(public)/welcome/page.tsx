"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function WelcomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const codename = searchParams.get("codename") ?? "Agent";

  return (
    <div>
      <h1>Welcome to Pocket Heist</h1>
      <p>Your codename is:</p>
      <strong>{codename}</strong>
      <br />
      <button onClick={() => router.replace("/heists")}>
        Enter the Heist
      </button>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  );
}
