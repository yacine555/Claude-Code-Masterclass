"use client";

import { useState, useCallback } from "react";
import { Lightbulb } from "lucide-react";
import ScoreBar from "@/components/ScoreBar";
import { useSlideNavigation } from "../useSlideNavigation";
import transition from "../slide-transition.module.css";
import styles from "./question.module.css";

type Phase = "question" | "choices" | "answer";

const DEMO_QUESTION = {
  text: "What proportion of adult patients with ALL have B-ALL?",
  hint: "It\u2019s the same as the percentage of the human brain that\u2019s composed of water.",
  choices: [
    { letter: "A", text: "75%" },
    { letter: "B", text: "60%" },
    { letter: "C", text: "85%" },
  ],
  correctIndex: 0,
  explanation:
    "Additional explanation: Lorem ipsum dolor sit amet consectetur. Donec elementum sagittis egestas porta convallis non.",
  citations:
    "Citations: Lorem ipsum dolor sit amet consectetur. Fames faucibus sodales etiam turpis ac nec mi dictumst id. Tellus maecenas penatibus purus egestas.",
};

const DEMO_PLAYERS = [
  { name: "Player 1", score: 400 },
  { name: "Player 2", score: 1200 },
  { name: "Player 3", score: 700 },
];

export default function QuestionPage() {
  const [phase, setPhase] = useState<Phase>("question");
  const [players] = useState(DEMO_PLAYERS);
  const { containerRef, navigate } = useSlideNavigation(transition.slideOut);

  const goNext = useCallback(() => {
    if (phase === "question") {
      setPhase("choices");
    } else if (phase === "choices") {
      setPhase("answer");
    } else {
      navigate("/board");
    }
  }, [phase, navigate]);

  const goPrev = useCallback(() => {
    if (phase === "choices") {
      setPhase("question");
    } else if (phase === "answer") {
      setPhase("choices");
    }
  }, [phase]);

  const handlePlayerClick = useCallback(
    (index: number) => {
      if (phase === "answer") {
        // Award points to player — in a real app this would update state
        navigate("/board");
      }
    },
    [phase, navigate],
  );

  const correct = DEMO_QUESTION.choices[DEMO_QUESTION.correctIndex];

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${transition.slideIn}`}
    >
      {/* Navigation zones */}
      <div className={styles.navZones}>
        <div
          className={styles.navPrev}
          onClick={goPrev}
          role="button"
          tabIndex={0}
          aria-label="Previous"
          onKeyDown={(e) => {
            if (e.key === "Enter") goPrev();
          }}
        />
        <div className={styles.navSpacer} />
        <div
          className={styles.navNext}
          onClick={goNext}
          role="button"
          tabIndex={0}
          aria-label="Next"
          onKeyDown={(e) => {
            if (e.key === "Enter") goNext();
          }}
        />
      </div>

      <div className={styles.content}>
        {/* Question text (shown in all phases) */}
        <h1 className={styles.questionText}>{DEMO_QUESTION.text}</h1>

        {/* Phase: question — show hint */}
        {phase === "question" && (
          <p className={styles.hint}>
            <Lightbulb className={styles.hintIcon} />
            {DEMO_QUESTION.hint}
          </p>
        )}

        {/* Phase: choices — show A/B/C */}
        {phase === "choices" && (
          <div className={styles.choices}>
            {DEMO_QUESTION.choices.map((choice) => (
              <div key={choice.letter} className={styles.choice}>
                <span className={styles.choiceLetter}>{choice.letter}.</span>
                <span>{choice.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Phase: answer — show correct + explanation */}
        {phase === "answer" && (
          <>
            <div className={styles.correctAnswer}>
              <span className={styles.correctLetter}>{correct.letter}.</span>
              <span className={styles.correctText}>{correct.text}</span>
            </div>

            <p className={styles.explanation}>{DEMO_QUESTION.explanation}</p>
            <p className={styles.citations}>{DEMO_QUESTION.citations}</p>
          </>
        )}
      </div>

      <ScoreBar players={players} onPlayerClick={handlePlayerClick} />
    </div>
  );
}
