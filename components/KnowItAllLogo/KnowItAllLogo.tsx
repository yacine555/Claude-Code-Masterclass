import styles from "./KnowItAllLogo.module.css";

type LogoSize = "default" | "large";

export default function KnowItAllLogo({
  size = "default",
  showSubtitle = false,
}: {
  size?: LogoSize;
  showSubtitle?: boolean;
}) {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} ${size === "large" ? styles.large : ""}`}>
        <span className={styles.gradientText}>Know</span>{" "}
        <span className={styles.gradientText}>It</span>
        <br />
        <span className={styles.gradientTextAlt}>ALL</span>
      </h1>
      {showSubtitle && (
        <p className={styles.subtitle}>The AUCATZYL Trivia Challenge</p>
      )}
    </div>
  );
}
