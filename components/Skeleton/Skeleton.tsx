import styles from "./Skeleton.module.css";

export default function Skeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.header}>
        <div className={styles.avatar}></div>
        <div className={styles.headerText}>
          <div className={styles.title}></div>
          <div className={styles.subtitle}></div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
}
