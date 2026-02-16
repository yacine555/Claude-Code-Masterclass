"use client";

import { useSlideNavigation } from "../useSlideNavigation";
import transition from "../slide-transition.module.css";
import styles from "./instructions.module.css";

export default function InstructionsPage() {
  const { containerRef, navigate } = useSlideNavigation(transition.slideOut);

  const handleNext = () => navigate("/board");

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${transition.slideIn}`}
      onClick={handleNext}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleNext();
      }}
      role="button"
      tabIndex={0}
      aria-label="Click to continue to game board"
    >
      <h1 className={styles.title}>Know it ALL</h1>
      <p className={styles.subtitle}>An AUCATZYL Trivia Challenge</p>
      <p className={styles.description}>
        Test your knowledge of R/R B-ALL and CAR T-cell therapy.
      </p>

      <ul className={styles.rules}>
        <li>First we&apos;ll start will a warm up round. No scoring... yet!</li>
        <li>To play, choose a square under any category</li>
        <li>If you know the answer, beat the other players to the buzzer</li>
        <li>
          Answer questions correctly to win the most points, and you&apos;ll
          earn the title of AUCATZYL Know It ALL!
        </li>
      </ul>

      <p className={styles.tagline}>
        What&apos;s <span className={styles.taglineBold}>your</span> CAR-T IQ?
      </p>
    </div>
  );
}
