import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useUser } from "@/contexts/AuthContext";
import type { AppUser } from "@/contexts/AuthContext";

// ─── Mocks ───────────────────────────────────────────────────────────────────

let capturedCallback: ((user: unknown) => void) | null = null;

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_, callback) => {
    capturedCallback = callback;
    // return unsubscribe stub
    return vi.fn();
  }),
  getAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({ auth: {} }));

// ─── Helper ──────────────────────────────────────────────────────────────────

function TestConsumer() {
  const { user, loading } = useUser();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.uid : "null"}</span>
      <span data-testid="email">{user?.email ?? "null"}</span>
      <span data-testid="displayName">{user?.displayName ?? "null"}</span>
    </div>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AuthProvider", () => {
  beforeEach(() => {
    capturedCallback = null;
  });

  it("renders children correctly", () => {
    render(
      <AuthProvider>
        <span>hello</span>
      </AuthProvider>
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("loading is true before listener resolves", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("loading").textContent).toBe("true");
  });

  it("loading is false and user is null when listener fires with no user", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      capturedCallback!(null);
    });

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("loading is false and user is set when listener fires with a Firebase user", () => {
    const fakeUser = { uid: "abc123", email: "test@example.com", displayName: "Alice" };

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      capturedCallback!(fakeUser);
    });

    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("abc123");
    expect(screen.getByTestId("email").textContent).toBe("test@example.com");
    expect(screen.getByTestId("displayName").textContent).toBe("Alice");
  });

  it("maps null email and displayName correctly", () => {
    const fakeUser = { uid: "xyz", email: null, displayName: null };

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    act(() => {
      capturedCallback!(fakeUser);
    });

    expect(screen.getByTestId("email").textContent).toBe("null");
    expect(screen.getByTestId("displayName").textContent).toBe("null");
  });
});

describe("useUser", () => {
  it("throws a descriptive error when called outside AuthProvider", () => {
    // Suppress the expected React error boundary console output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function BadConsumer() {
      useUser();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      "useUser must be used within an AuthProvider"
    );

    consoleSpy.mockRestore();
  });
});
