import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import KnowItAllLogo from "@/components/KnowItAllLogo";

describe("KnowItAllLogo", () => {
  it("renders the logo heading text", () => {
    render(<KnowItAllLogo />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Know/);
    expect(heading).toHaveTextContent(/It/);
    expect(heading).toHaveTextContent(/ALL/);
  });

  it("does not render subtitle by default", () => {
    render(<KnowItAllLogo />);

    expect(
      screen.queryByText("The AUCATZYL Trivia Challenge"),
    ).not.toBeInTheDocument();
  });

  it("renders subtitle when showSubtitle is true", () => {
    render(<KnowItAllLogo showSubtitle />);

    expect(
      screen.getByText("The AUCATZYL Trivia Challenge"),
    ).toBeInTheDocument();
  });

  it("accepts a size variant prop", () => {
    const { container } = render(<KnowItAllLogo size="large" />);

    const heading = container.querySelector("h1");
    expect(heading?.className).toMatch(/large/);
  });
});
