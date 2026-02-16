import styles from "./GameLayout.module.css";

export default function GameLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.main}>{children}</div>
      <aside className={styles.sidebar}>{sidebar}</aside>
    </div>
  );
}
