import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useUser } from "@/contexts/AuthContext"

import DashboardLayout from "@/app/(dashboard)/layout"

const mockReplace = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("@/components/Navbar", () => ({
  default: () => <div>Navbar</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DashboardLayout", () => {
  it("renders children when user is authenticated", () => {
    vi.mocked(useUser).mockReturnValue({ user: { uid: "123" } as any, loading: false });

    render(<DashboardLayout>
      <div>Protected content</div>
    </DashboardLayout>);

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("calls router.replace('/login') and renders nothing when unauthenticated", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false });

    const { container } = render(<DashboardLayout>
      <div>Protected content</div>
    </DashboardLayout>);

    expect(mockReplace).toHaveBeenCalledWith("/login");
    expect(container).toBeEmptyDOMElement();
  });

  it("shows loader element when loading", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true });

    render(<DashboardLayout>
      <div>Protected content</div>
    </DashboardLayout>);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
