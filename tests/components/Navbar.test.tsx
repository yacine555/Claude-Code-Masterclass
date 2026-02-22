import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useUser } from "@/contexts/AuthContext"

// component imports
import Navbar from "@/components/Navbar"

const mockSignOut = vi.fn();

vi.mock("firebase/auth", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

vi.mock("@/lib/firebase", () => ({ auth: {} }));

vi.mock("@/contexts/AuthContext", () => ({
  useUser: vi.fn(),
}));

beforeEach(() => {
  vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
  vi.clearAllMocks();
});

describe("Navbar", () => {
  it("renders the main heading", () => {
    render(<Navbar />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create Heist link", () => {
    render(<Navbar />)

    const createLink = screen.getByRole("link", { name: /create new heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("renders the Logout button when user is logged in", () => {
    vi.mocked(useUser).mockReturnValue({ user: { uid: "123" } as any, loading: false });
    render(<Navbar />)

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  it("does not render the Logout button when user is null", () => {
    render(<Navbar />)

    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument()
  })

  it("does not render the Logout button while loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: { uid: "123" } as any, loading: true });
    render(<Navbar />)

    expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument()
  })

  it("calls signOut when Logout button is clicked", async () => {
    vi.mocked(useUser).mockReturnValue({ user: { uid: "123" } as any, loading: false });
    mockSignOut.mockResolvedValue(undefined);
    render(<Navbar />)

    await userEvent.click(screen.getByRole("button", { name: /logout/i }))

    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })
})
