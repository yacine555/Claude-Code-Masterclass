"use client";

import { useSlideNavigation } from "../useSlideNavigation";
import transition from "../slide-transition.module.css";
import styles from "./leaderboard.module.css";

const LEADERBOARD = [
  { name: "Name 1", score: 1800 },
  { name: "Name 2", score: 1500 },
  { name: "Name 3", score: 1200 },
  { name: "Name 4", score: 1100 },
  { name: "Name 5", score: 1100 },
  { name: "Name 6", score: 900 },
  { name: "Name 7", score: 800 },
  { name: "Name 8", score: 800 },
];

export default function FinalLeaderboardPage() {
  const { containerRef, navigate } = useSlideNavigation(transition.slideOut);

  const handleClick = () => navigate("/screensaver");

  const leftColumn = LEADERBOARD.slice(0, 4);
  const rightColumn = LEADERBOARD.slice(4, 8);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${transition.slideIn}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      role="button"
      tabIndex={0}
      aria-label="Click to return to screensaver"
    >
      <div className={styles.header}>
        <span className={styles.headerTitle}>Know it ALL</span>
        <span className={styles.headerSub}>Leaderboard</span>
      </div>

      <div className={styles.columns}>
        <div>
          {leftColumn.map((entry) => (
            <div key={entry.name} className={styles.entry}>
              <span className={styles.entryName}>{entry.name}</span>
              <span className={styles.entryScore}>{entry.score}</span>
            </div>
          ))}
        </div>
        <div>
          {rightColumn.map((entry) => (
            <div key={entry.name} className={styles.entry}>
              <span className={styles.entryName}>{entry.name}</span>
              <span className={styles.entryScore}>{entry.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>
          Visit AUCATZYLhcp.com for more information or scan the QR code.
        </p>
        <div className={styles.qrBox}>
          QR
          <br />
          code
        </div>
      </div>
    </div>
  );
}
