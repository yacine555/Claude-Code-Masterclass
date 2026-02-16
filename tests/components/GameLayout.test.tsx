import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import GameLayout from "@/components/GameLayout";

describe("GameLayout", () => {
  it("renders main content and sidebar", () => {
    render(
      <GameLayout sidebar={<div>Sidebar content</div>}>
        <div>Main content</div>
      </GameLayout>,
    );

    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
  });

  it("renders the sidebar as an aside element", () => {
    render(
      <GameLayout sidebar={<div>ISI</div>}>
        <div>Game</div>
      </GameLayout>,
    );

    const aside = screen.getByRole("complementary");
    expect(aside).toBeInTheDocument();
    expect(aside).toHaveTextContent("ISI");
  });
});
