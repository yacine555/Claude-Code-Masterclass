import styles from "./ScoreBar.module.css";

export type PlayerScore = {
  name: string;
  score: number;
};

export default function ScoreBar({
  players,
  onPlayerClick,
}: {
  players: PlayerScore[];
  onPlayerClick?: (index: number) => void;
}) {
  return (
    <div className={styles.bar}>
      {players.map((player, i) => (
        <button
          key={player.name}
          className={styles.scoreItem}
          onClick={() => onPlayerClick?.(i)}
          type="button"
        >
          <span className={styles.name}>{player.name}</span>
          <span className={styles.score}>{player.score}</span>
        </button>
      ))}
    </div>
  );
}
