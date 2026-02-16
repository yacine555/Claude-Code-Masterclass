"use client";

import GameLayout from "@/components/GameLayout";
import GameISI from "@/components/GameISI";
import KnowItAllLogo from "@/components/KnowItAllLogo";
import Leaderboard from "@/components/Leaderboard";
import { useSlideNavigation } from "../useSlideNavigation";
import transition from "../slide-transition.module.css";
import styles from "./screensaver.module.css";

export default function ScreensaverPage() {
  const { containerRef, navigate } = useSlideNavigation(transition.slideOut);

  const handleClick = () => navigate("/intro");

  return (
    <GameLayout sidebar={<GameISI />}>
      <div
        ref={containerRef}
        className={`${styles.background} ${transition.slideIn}`}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
        role="button"
        tabIndex={0}
        aria-label="Press to continue to intro"
      >
        <div className={styles.content}>
          <KnowItAllLogo showSubtitle />
          <Leaderboard />
          <p className={styles.prompt}>Press anywhere to continue</p>
        </div>
      </div>
    </GameLayout>
  );
}
