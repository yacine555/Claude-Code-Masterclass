"use client";

import { useState, useCallback } from "react";
import ScoreBar from "@/components/ScoreBar";
import { useSlideNavigation } from "../useSlideNavigation";
import transition from "../slide-transition.module.css";
import styles from "./board.module.css";

const CATEGORIES = [
  "Alphabet Soup",
  "Safety First",
  "Trivial Connections",
  "Dude, That's a Nice 'CAR'",
];

const POINT_VALUES = [100, 200, 300, 400];

const DEMO_PLAYERS = [
  { name: "Player 1", score: 0 },
  { name: "Player 2", score: 0 },
  { name: "Player 3", score: 0 },
];

export default function BoardPage() {
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [showPopup, setShowPopup] = useState(false);
  const [players] = useState(DEMO_PLAYERS);
  const { containerRef, navigate } = useSlideNavigation(transition.slideOut);

  const handleCardClick = useCallback(
    (categoryIdx: number, pointIdx: number) => {
      const key = `${categoryIdx}-${pointIdx}`;
      if (answered.has(key)) return;
      navigate("/question");
    },
    [answered, navigate],
  );

  const handleKeepPlayingYes = () => {
    setShowPopup(false);
  };

  const handleKeepPlayingNo = () => {
    navigate("/closer");
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${transition.slideIn}`}
    >
      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <div key={cat} className={styles.categoryHeader}>
            {cat}
          </div>
        ))}

        {POINT_VALUES.map((points, pointIdx) =>
          CATEGORIES.map((_, categoryIdx) => {
            const key = `${categoryIdx}-${pointIdx}`;
            const isAnswered = answered.has(key);
            return (
              <button
                key={key}
                className={`${styles.card} ${isAnswered ? styles.cardAnswered : ""}`}
                onClick={() => handleCardClick(categoryIdx, pointIdx)}
                disabled={isAnswered}
              >
                {!isAnswered && points}
              </button>
            );
          }),
        )}
      </div>

      <ScoreBar players={players} />

      {showPopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <div className={styles.popupScores}>
              {players.map((p) => (
                <div key={p.name} className={styles.popupScoreItem}>
                  <span>{p.name}</span>
                  <span className={styles.popupScoreValue}>{p.score}</span>
                </div>
              ))}
            </div>

            <div className={styles.popupDivider}>
              <span className={styles.popupDividerText}>current standings</span>
            </div>

            <h2 className={styles.popupQuestion}>Keep playing?</h2>

            <div className={styles.popupButtons}>
              <button
                className={styles.popupButton}
                onClick={handleKeepPlayingYes}
              >
                <span className={styles.popupButtonTitle}>Yes</span>
                <span className={styles.popupButtonSub}>4 more questions</span>
              </button>
              <button
                className={styles.popupButton}
                onClick={handleKeepPlayingNo}
              >
                <span className={styles.popupButtonTitle}>No</span>
                <span className={styles.popupButtonSub}>we&apos;re done!</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
