import Link from "next/link";
import { Heist } from "@/types/firestore";
import styles from "./HeistCard.module.css";

export default function HeistCard({ heist }: { heist: Heist }) {
  const deadline = heist.deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={styles.card}>
      <Link href={`/heists/${heist.id}`} className={styles.title}>
        {heist.title}
      </Link>
      <p className={styles.detail}>
        <span className={styles.label}>To:</span> <span className={styles.codename}>@{heist.assignedToCodename}</span>
      </p>
      <p className={styles.detail}>
        <span className={styles.label}>By:</span> <span className={styles.codename}>@{heist.createdByCodename}</span>
      </p>
      <p className={styles.detail}>
        <span className={styles.label}>Deadline</span> {deadline}
      </p>
    </div>
  );
}
