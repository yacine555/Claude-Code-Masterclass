import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import Leaderboard from "@/components/Leaderboard";

describe("Leaderboard", () => {
  it("renders 8 leaderboard entries by default", () => {
    render(<Leaderboard />);

    for (let i = 1; i <= 8; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("renders player names in uppercase", () => {
    render(<Leaderboard />);

    expect(screen.getByText("OLIVIA C")).toBeInTheDocument();
    expect(screen.getByText("EDWARD Y")).toBeInTheDocument();
    expect(screen.getByText("ALEX P")).toBeInTheDocument();
    expect(screen.getByText("MARIA Y")).toBeInTheDocument();
  });

  it("renders scores for all entries", () => {
    render(<Leaderboard />);

    expect(screen.getByText("4000")).toBeInTheDocument();
    expect(screen.getByText("2000")).toBeInTheDocument();
  });

  it("accepts custom entries", () => {
    const entries = [
      { rank: 1, name: "Test Player", score: 9999 },
      { rank: 2, name: "Another Player", score: 5000 },
    ];

    render(<Leaderboard entries={entries} />);

    expect(screen.getByText("TEST PLAYER")).toBeInTheDocument();
    expect(screen.getByText("9999")).toBeInTheDocument();
  });
});
