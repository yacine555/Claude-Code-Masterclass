import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeistsPage from "@/app/(dashboard)/heists/page";
import { useUser } from "@/contexts/AuthContext";
import { useHeists } from "@/hooks";

vi.mock("@/contexts/AuthContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("@/hooks", () => ({
  useHeists: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useUser).mockReturnValue({ user: { uid: "u1", displayName: "Agent" } as any, loading: false });
  vi.clearAllMocks();
});

describe("HeistsPage", () => {
  it("only renders active and assigned sections (no expired)", () => {
    vi.mocked(useHeists).mockReturnValue({ heists: [], loading: false, error: null });

    render(<HeistsPage />);

    expect(screen.getByText("Agent's Active Heists")).toBeInTheDocument();
    expect(screen.getByText("Heists You've Assigned")).toBeInTheDocument();
    expect(screen.queryByText(/expired/i)).not.toBeInTheDocument();
  });

  it("shows skeleton grid while loading", () => {
    vi.mocked(useHeists).mockReturnValue({ heists: [], loading: true, error: null });

    const { container } = render(<HeistsPage />);

    // Each section renders 3 skeletons = 6 total
    const skeletons = container.querySelectorAll("[class*='card']");
    expect(skeletons.length).toBe(6);
  });

  it("renders heist cards when data is loaded", () => {
    vi.mocked(useHeists).mockReturnValue({
      heists: [
        {
          id: "h1",
          title: "Test Heist",
          description: "",
          createdBy: "u1",
          createdByCodename: "Alpha",
          assignedTo: "u2",
          assignedToCodename: "Beta",
          deadline: new Date("2026-07-01"),
          finalStatus: null,
        },
      ],
      loading: false,
      error: null,
    });

    render(<HeistsPage />);

    expect(screen.getAllByRole("link", { name: "Test Heist" })).toHaveLength(2); // once per section
  });
});
