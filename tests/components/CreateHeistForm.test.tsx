import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CreateHeistForm from "@/components/CreateHeistForm";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockUser = { uid: "current-uid", email: "me@test.com", displayName: "MyCodname" };
vi.mock("@/contexts/AuthContext", () => ({
  useUser: () => ({ user: mockUser, loading: false }),
}));

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }));

const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();
const mockCollection = vi.fn().mockReturnValue({
  withConverter: vi.fn().mockReturnValue("converted-ref"),
});

vi.mock("firebase/firestore", () => ({
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  collection: (...args: unknown[]) => mockCollection(...args),
  serverTimestamp: () => "mock-server-timestamp",
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeDocs(users: { id: string; codename: string }[]) {
  return {
    docs: users.map((u) => ({
      id: u.id,
      data: () => u,
    })),
  };
}

const otherUsers = [
  { id: "uid-alice", codename: "SilentFox" },
  { id: "uid-bob", codename: "GhostPanther" },
];

// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  mockGetDocs.mockResolvedValue(makeDocs([
    { id: "current-uid", codename: "MyCodname" },
    ...otherUsers,
  ]));
  mockAddDoc.mockResolvedValue({ id: "new-heist-id" });
});

describe("CreateHeistForm", () => {
  describe("Rendering", () => {
    it("renders all form fields", async () => {
      render(<CreateHeistForm />);

      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(screen.getByLabelText("Assign To")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create heist/i })).toBeInTheDocument();
    });

    it("populates dropdown with users excluding current user", async () => {
      render(<CreateHeistForm />);

      // Wait for users to load
      expect(await screen.findByText("SilentFox")).toBeInTheDocument();
      expect(screen.getByText("GhostPanther")).toBeInTheDocument();
      expect(screen.queryByText("MyCodname")).not.toBeInTheDocument();
    });
  });

  describe("Validation", () => {
    it("shows error when title is empty on submit", async () => {
      const user = userEvent.setup();
      render(<CreateHeistForm />);

      await screen.findByText("SilentFox");
      await user.click(screen.getByRole("button", { name: /create heist/i }));

      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    it("shows error when no user is selected on submit", async () => {
      const user = userEvent.setup();
      render(<CreateHeistForm />);

      await screen.findByText("SilentFox");
      await user.type(screen.getByLabelText("Title"), "Bank Job");
      await user.click(screen.getByRole("button", { name: /create heist/i }));

      expect(screen.getByText(/assigned user is required/i)).toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    it("calls addDoc with correct shape on valid submit", async () => {
      const user = userEvent.setup();
      render(<CreateHeistForm />);

      await screen.findByText("SilentFox");

      await user.type(screen.getByLabelText("Title"), "Bank Job");
      await user.type(screen.getByLabelText("Description"), "Steal the vault");
      await user.selectOptions(screen.getByLabelText("Assign To"), "uid-alice");
      await user.click(screen.getByRole("button", { name: /create heist/i }));

      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: "Bank Job",
          description: "Steal the vault",
          createdBy: "current-uid",
          createdByCodename: "MyCodname",
          assignedTo: "uid-alice",
          assignedToCodename: "SilentFox",
          deadline: "mock-server-timestamp",
          finalStatus: null,
        }),
      );
    });

    it("redirects to /heists after successful submit", async () => {
      const user = userEvent.setup();
      render(<CreateHeistForm />);

      await screen.findByText("SilentFox");

      await user.type(screen.getByLabelText("Title"), "Bank Job");
      await user.selectOptions(screen.getByLabelText("Assign To"), "uid-alice");
      await user.click(screen.getByRole("button", { name: /create heist/i }));

      expect(mockReplace).toHaveBeenCalledWith("/heists");
    });

    it("shows error on Firestore write failure", async () => {
      mockAddDoc.mockRejectedValueOnce(new Error("Firestore error"));
      const user = userEvent.setup();
      render(<CreateHeistForm />);

      await screen.findByText("SilentFox");

      await user.type(screen.getByLabelText("Title"), "Bank Job");
      await user.selectOptions(screen.getByLabelText("Assign To"), "uid-alice");
      await user.click(screen.getByRole("button", { name: /create heist/i }));

      expect(await screen.findByText(/failed to create heist/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("sets aria-invalid on title when validation fails", async () => {
      const user = userEvent.setup();
      render(<CreateHeistForm />);

      await screen.findByText("SilentFox");
      await user.click(screen.getByRole("button", { name: /create heist/i }));

      expect(screen.getByLabelText("Title")).toHaveAttribute("aria-invalid", "true");
    });

    it("has role=alert on error messages", async () => {
      const user = userEvent.setup();
      render(<CreateHeistForm />);

      await screen.findByText("SilentFox");
      await user.click(screen.getByRole("button", { name: /create heist/i }));

      const titleError = screen.getByText(/title is required/i);
      const assignedError = screen.getByText(/assigned user is required/i);

      expect(titleError).toHaveAttribute("role", "alert");
      expect(assignedError).toHaveAttribute("role", "alert");
    });
  });
});
