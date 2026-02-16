"use client";

import { useSlideNavigation } from "../useSlideNavigation";
import transition from "../slide-transition.module.css";
import styles from "./closer.module.css";

const DEMO_PLAYERS = [
  { name: "Player 1", score: 400 },
  { name: "Player 2", score: 1200 },
  { name: "Player 3", score: 700 },
];

export default function CloserPage() {
  const { containerRef, navigate } = useSlideNavigation(transition.slideOut);

  const winner = [...DEMO_PLAYERS].sort((a, b) => b.score - a.score)[0];

  const handleClick = () => navigate("/final-leaderboard");

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
      aria-label="Click to see leaderboard"
    >
      <h1 className={styles.thankYou}>Thank you for playing.</h1>
      <p className={styles.winnerName}>{winner.name}</p>
      <p className={styles.winnerLabel}>You are the winner!</p>

      <div className={styles.scores}>
        {DEMO_PLAYERS.map((p) => (
          <div key={p.name} className={styles.scoreEntry}>
            <span className={styles.scoreName}>{p.name}</span>
            <span className={styles.scoreValue}>{p.score}</span>
          </div>
        ))}
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
