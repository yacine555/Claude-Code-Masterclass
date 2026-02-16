import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import GameISI from "@/components/GameISI";

describe("GameISI", () => {
  it("renders the brand name", () => {
    render(<GameISI />);

    expect(screen.getByText("AUCATZYL")).toBeInTheDocument();
  });

  it("renders the Indication section", () => {
    render(<GameISI />);

    expect(screen.getByText("Indication")).toBeInTheDocument();
    expect(
      screen.getByText(/AUCATZYL® is a CD19-directed/),
    ).toBeInTheDocument();
  });

  it("renders the Important Safety Information section", () => {
    render(<GameISI />);

    expect(
      screen.getByText("Important Safety Information"),
    ).toBeInTheDocument();
  });

  it("renders the black box warning", () => {
    render(<GameISI />);

    expect(
      screen.getByText(/WARNING: CYTOKINE RELEASE SYNDROME/),
    ).toBeInTheDocument();
  });

  it("renders the Warnings and Precautions section", () => {
    render(<GameISI />);

    expect(screen.getByText("Warnings and Precautions")).toBeInTheDocument();
    expect(screen.getByText(/CRS was reported in 75%/)).toBeInTheDocument();
  });
});
