"use client";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/contexts/AuthContext";
import { Heist, heistConverter, COLLECTIONS } from "@/types/firestore";

export type HeistMode = "active" | "assigned" | "expired";

export function useHeists(mode: HeistMode) {
  const { user } = useUser();
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setHeists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const ref = collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter);
    const now = new Date();

    let q;
    if (mode === "active") {
      q = query(ref, where("assignedTo", "==", user.uid), where("deadline", ">", now));
    } else if (mode === "assigned") {
      q = query(ref, where("createdBy", "==", user.uid), where("deadline", ">", now));
    } else {
      q = query(ref, where("deadline", "<=", now));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let docs = snapshot.docs.map((doc) => doc.data() as Heist);
        if (mode === "expired") {
          docs = docs.filter((h) => h.finalStatus !== null);
        }
        setHeists(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, mode]);

  return { heists, loading, error };
}
