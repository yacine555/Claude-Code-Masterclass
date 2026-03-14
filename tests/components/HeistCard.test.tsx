import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HeistCard from "@/components/HeistCard";
import HeistCardSkeleton from "@/components/HeistCardSkeleton";
import { Heist } from "@/types/firestore";

const mockHeist: Heist = {
  id: "abc123",
  title: "The Grand Heist",
  description: "A daring plan",
  createdBy: "user1",
  createdByCodename: "Shadow",
  assignedTo: "user2",
  assignedToCodename: "Ghost",
  deadline: new Date("2026-06-15"),
  finalStatus: null,
};

describe("HeistCard", () => {
  it("renders title as a link to /heists/[id]", () => {
    render(<HeistCard heist={mockHeist} />);

    const link = screen.getByRole("link", { name: "The Grand Heist" });
    expect(link).toHaveAttribute("href", "/heists/abc123");
  });

  it("displays codenames and deadline", () => {
    render(<HeistCard heist={mockHeist} />);

    expect(screen.getByText("@Shadow")).toBeInTheDocument();
    expect(screen.getByText("@Ghost")).toBeInTheDocument();
    // Format the same way the component does to avoid timezone issues
    const expectedDate = new Date("2026-06-15").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});

describe("HeistCardSkeleton", () => {
  it("renders without error", () => {
    const { container } = render(<HeistCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
