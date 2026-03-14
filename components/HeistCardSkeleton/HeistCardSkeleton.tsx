import styles from "./HeistCardSkeleton.module.css";

export default function HeistCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.titleLine}></div>
      <div className={styles.detailLine}></div>
      <div className={styles.detailLine}></div>
      <div className={styles.detailLine}></div>
    </div>
  );
}
