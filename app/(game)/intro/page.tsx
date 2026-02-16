"use client";

import { useState, useRef, useCallback } from "react";
import { Settings } from "lucide-react";
import GameLayout from "@/components/GameLayout";
import GameISI from "@/components/GameISI";
import KnowItAllLogo from "@/components/KnowItAllLogo";
import { useSlideNavigation } from "../useSlideNavigation";
import transition from "../slide-transition.module.css";
import styles from "./intro.module.css";

const BOARDS = ["Board 1", "Board 2", "Board 3"] as const;

export default function IntroPage() {
  const [selectedBoard, setSelectedBoard] = useState(0);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const boardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { containerRef, navigate } = useSlideNavigation(transition.slideOut);

  const handleBoardSelect = useCallback((index: number) => {
    setSelectedBoard(index);
  }, []);

  const handleStartGame = useCallback(() => {
    navigate("/instructions");
  }, [navigate]);

  return (
    <GameLayout sidebar={<GameISI />}>
      <div
        ref={containerRef}
        className={`${styles.background} ${transition.slideIn}`}
      >
        <div className={styles.content}>
          <KnowItAllLogo showSubtitle />

          <div className={styles.divider} />

          <div className={styles.formSection}>
            <label className={styles.formLabel}>Enter Players Name</label>
            <div className={styles.inputRow}>
              <input
                type="text"
                className={styles.input}
                placeholder="Player 1"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                aria-label="Player 1 name"
              />
              <input
                type="text"
                className={styles.input}
                placeholder="Player 2"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                aria-label="Player 2 name"
              />
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.boardSelector}>
              <div
                className={styles.boardSelectorBg}
                style={{
                  left: boardRefs.current[selectedBoard]?.offsetLeft ?? 20,
                  width: boardRefs.current[selectedBoard]?.offsetWidth ?? 147,
                }}
              />
              {BOARDS.map((board, index) => (
                <button
                  key={board}
                  ref={(el) => {
                    boardRefs.current[index] = el;
                  }}
                  className={`${styles.boardOption} ${index === selectedBoard ? styles.active : ""}`}
                  onClick={() => handleBoardSelect(index)}
                  aria-pressed={index === selectedBoard}
                >
                  {board}
                </button>
              ))}
            </div>

            <button className={styles.startButton} onClick={handleStartGame}>
              Start the Game
            </button>
          </div>
        </div>

        <div className={styles.settings} aria-label="Settings">
          <Settings className={styles.settingsIcon} />
        </div>
      </div>
    </GameLayout>
  );
}
