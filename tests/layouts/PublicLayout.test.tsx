import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useUser } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"

import PublicLayout from "@/app/(public)/layout"

const mockReplace = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PublicLayout", () => {
  it("renders children when user is unauthenticated", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });
    vi.mocked(usePathname).mockReturnValue("/login");

    render(<PublicLayout>
      <div>Public content</div>
    </PublicLayout>);

    expect(screen.getByText("Public content")).toBeInTheDocument();
  });

  it("calls router.replace('/heists') when authenticated on /login", () => {
    vi.mocked(useUser).mockReturnValue({ user: { uid: "123" } as any, loading: false });
    vi.mocked(usePathname).mockReturnValue("/login");

    render(<PublicLayout>
      <div>Public content</div>
    </PublicLayout>);

    expect(mockReplace).toHaveBeenCalledWith("/heists");
  });

  it("does not redirect when authenticated on / path", () => {
    vi.mocked(useUser).mockReturnValue({ user: { uid: "123" } as any, loading: false });
    vi.mocked(usePathname).mockReturnValue("/");

    render(<PublicLayout>
      <div>Landing page</div>
    </PublicLayout>);

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows loader element when loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });
    vi.mocked(usePathname).mockReturnValue("/login");

    render(<PublicLayout>
      <div>Public content</div>
    </PublicLayout>);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
