import styles from "./Leaderboard.module.css";

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
};

const DEFAULT_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: "OLIVIA C", score: 4000 },
  { rank: 2, name: "EDWARD Y", score: 3200 },
  { rank: 3, name: "CHRISTOPHER M", score: 3000 },
  { rank: 4, name: "JENNIFER Z", score: 2800 },
  { rank: 5, name: "ALEX P", score: 2500 },
  { rank: 6, name: "KELSI M", score: 2400 },
  { rank: 7, name: "RENEE B", score: 2300 },
  { rank: 8, name: "MARIA Y", score: 2000 },
];

export default function Leaderboard({
  entries = DEFAULT_ENTRIES,
}: {
  entries?: LeaderboardEntry[];
}) {
  const left = entries.slice(0, 4);
  const right = entries.slice(4, 8);

  return (
    <div className={styles.board}>
      <div className={styles.column}>
        {left.map((entry) => (
          <div
            key={entry.rank}
            className={`${styles.slot} ${entry.rank === 1 ? styles.gold : ""}`}
          >
            <span className={styles.rank}>{entry.rank}</span>
            <span className={styles.name}>{entry.name.toUpperCase()}</span>
            <span className={styles.score}>{entry.score}</span>
          </div>
        ))}
      </div>
      <div className={styles.column}>
        {right.map((entry) => (
          <div key={entry.rank} className={styles.slot}>
            <span className={styles.rank}>{entry.rank}</span>
            <span className={styles.name}>{entry.name.toUpperCase()}</span>
            <span className={styles.score}>{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
