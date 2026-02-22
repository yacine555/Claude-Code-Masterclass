import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "@/components/AuthForm/AuthForm";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const mockCreateUser = vi.fn();
const mockUpdateProfile = vi.fn();

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

const mockSetDoc = vi.fn();
const mockDoc = vi.fn();

vi.mock("firebase/firestore", () => ({
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
  db: {},
}));

vi.mock("@/lib/codename", () => ({
  generateCodename: vi.fn(() => "SilentCrimsonFox"),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EMAIL = "test@example.com";
const PASSWORD = "password123";

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email"), EMAIL);
  await user.type(screen.getByLabelText("Password"), PASSWORD);
  await user.click(screen.getByRole("button", { name: /sign up/i }));
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AuthForm signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDoc.mockReturnValue("users/uid123");
    mockSetDoc.mockResolvedValue(undefined);
    mockUpdateProfile.mockResolvedValue(undefined);
  });

  it("calls createUserWithEmailAndPassword with the correct email and password", async () => {
    mockCreateUser.mockResolvedValueOnce({
      user: { uid: "uid123" },
    });

    render(<AuthForm mode="signup" />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        {},
        EMAIL,
        PASSWORD
      );
    });
  });

  it("calls updateProfile with a non-empty displayName on success", async () => {
    mockCreateUser.mockResolvedValueOnce({
      user: { uid: "uid123" },
    });

    render(<AuthForm mode="signup" />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        { uid: "uid123" },
        expect.objectContaining({ displayName: expect.any(String) })
      );
      expect(
        mockUpdateProfile.mock.calls[0][1].displayName.length
      ).toBeGreaterThan(0);
    });
  });

  it("calls setDoc with id and codename but no email field", async () => {
    mockCreateUser.mockResolvedValueOnce({
      user: { uid: "uid123" },
    });

    render(<AuthForm mode="signup" />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalled();
      const docData = mockSetDoc.mock.calls[0][1];
      expect(docData).toHaveProperty("id", "uid123");
      expect(docData).toHaveProperty("codename", "SilentCrimsonFox");
      expect(docData).not.toHaveProperty("email");
    });
  });

  it("disables the submit button while the async request is pending", async () => {
    let resolve!: (value: unknown) => void;
    const deferred = new Promise((r) => {
      resolve = r;
    });
    mockCreateUser.mockReturnValueOnce(deferred);

    render(<AuthForm mode="signup" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), EMAIL);
    await user.type(screen.getByLabelText("Password"), PASSWORD);

    fireEvent.submit(screen.getByRole("button", { name: /sign up/i }).closest("form")!);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /sign up/i })
      ).toBeDisabled();
    });

    resolve({ user: { uid: "uid123" } });
  });

  it("renders a visible error message for auth/email-already-in-use", async () => {
    const error = Object.assign(new Error("already in use"), {
      code: "auth/email-already-in-use",
    });
    mockCreateUser.mockRejectedValueOnce(error);

    render(<AuthForm mode="signup" />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(
        screen.getByRole("alert", { name: undefined })
      );
      expect(
        screen.getByText("This email is already registered.")
      ).toBeInTheDocument();
    });
  });

  it("renders a fallback error message for generic Firebase errors", async () => {
    const error = Object.assign(new Error("network error"), {
      code: "auth/network-request-failed",
    });
    mockCreateUser.mockRejectedValueOnce(error);

    render(<AuthForm mode="signup" />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
