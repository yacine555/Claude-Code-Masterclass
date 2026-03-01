import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useHeists } from "@/hooks";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockUser = { uid: "user-1", email: "me@test.com", displayName: "TestUser" };
vi.mock("@/contexts/AuthContext", () => ({
  useUser: () => ({ user: mockUser, loading: false }),
}));

vi.mock("@/lib/firebase", () => ({ db: {} }));

const mockUnsubscribe = vi.fn();
let snapshotCallback: (snapshot: unknown) => void;
let errorCallback: (err: Error) => void;

const mockOnSnapshot = vi.fn().mockImplementation((_q, onNext, onError) => {
  snapshotCallback = onNext;
  errorCallback = onError;
  return mockUnsubscribe;
});

const mockQuery = vi.fn().mockReturnValue("mock-query");
const mockWhere = vi.fn().mockImplementation((field, op, value) => ({ field, op, value }));
const mockCollection = vi.fn().mockReturnValue({
  withConverter: vi.fn().mockReturnValue("converted-ref"),
});

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSnapshot(heists: Array<{ id: string; [key: string]: unknown }>) {
  return {
    docs: heists.map((h) => ({
      data: () => h,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useHeists", () => {
  it("returns loading true before snapshot fires", () => {
    const { result } = renderHook(() => useHeists("active"));

    expect(result.current.loading).toBe(true);
    expect(result.current.heists).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("returns heists after snapshot fires", () => {
    const { result } = renderHook(() => useHeists("active"));

    act(() => {
      snapshotCallback(makeSnapshot([
        { id: "h1", title: "Heist One", finalStatus: null },
      ]));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.heists).toHaveLength(1);
    expect(result.current.heists[0].title).toBe("Heist One");
  });

  it("active mode queries assignedTo + deadline > now", () => {
    renderHook(() => useHeists("active"));

    expect(mockWhere).toHaveBeenCalledWith("assignedTo", "==", "user-1");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", expect.any(Date));
  });

  it("assigned mode queries createdBy + deadline > now", () => {
    renderHook(() => useHeists("assigned"));

    expect(mockWhere).toHaveBeenCalledWith("createdBy", "==", "user-1");
    expect(mockWhere).toHaveBeenCalledWith("deadline", ">", expect.any(Date));
  });

  it("expired mode filters out null finalStatus client-side", () => {
    const { result } = renderHook(() => useHeists("expired"));

    act(() => {
      snapshotCallback(makeSnapshot([
        { id: "h1", title: "Done", finalStatus: "success" },
        { id: "h2", title: "Pending", finalStatus: null },
      ]));
    });

    expect(result.current.heists).toHaveLength(1);
    expect(result.current.heists[0].title).toBe("Done");
  });

  it("calls unsubscribe on unmount", () => {
    const { unmount } = renderHook(() => useHeists("active"));

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("sets error state on snapshot error", () => {
    const { result } = renderHook(() => useHeists("active"));

    act(() => {
      errorCallback(new Error("permission-denied"));
    });

    expect(result.current.error?.message).toBe("permission-denied");
    expect(result.current.loading).toBe(false);
  });
});
