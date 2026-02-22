import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AuthForm from "@/components/AuthForm";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

const mockSignIn = vi.fn();

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  setDoc: vi.fn(),
  doc: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }));

vi.mock("@/lib/codename", () => ({
  generateCodename: vi.fn(() => "SilentCrimsonFox"),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EMAIL = "agent@heist.io";
const PASSWORD = "password123";

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email"), EMAIL);
  await user.type(screen.getByLabelText("Password"), PASSWORD);
  await user.click(screen.getByRole("button", { name: /log in/i }));
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AuthForm login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signInWithEmailAndPassword with correct credentials", async () => {
    mockSignIn.mockResolvedValueOnce({ user: { uid: "uid123" } });
    render(<AuthForm mode="login" />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
      expect(mockSignIn).toHaveBeenCalledWith({}, EMAIL, PASSWORD);
    });
  });

  it("shows a success message after sign-in resolves", async () => {
    mockSignIn.mockResolvedValueOnce({ user: { uid: "uid123" } });
    render(<AuthForm mode="login" />);
    await fillAndSubmit();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
  });

  it("shows an error message for auth/invalid-credential", async () => {
    const error = Object.assign(new Error("bad credentials"), {
      code: "auth/invalid-credential",
    });
    mockSignIn.mockRejectedValueOnce(error);
    render(<AuthForm mode="login" />);
    await fillAndSubmit();

    expect(
      await screen.findByText(/invalid email or password/i),
    ).toBeInTheDocument();
  });

  it("shows a fallback error message for unknown Firebase errors", async () => {
    const error = Object.assign(new Error("network error"), {
      code: "auth/network-request-failed",
    });
    mockSignIn.mockRejectedValueOnce(error);
    render(<AuthForm mode="login" />);
    await fillAndSubmit();

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
  });

  it("disables the submit button while the request is in flight", async () => {
    let resolve!: (value: unknown) => void;
    const deferred = new Promise((r) => { resolve = r; });
    mockSignIn.mockReturnValueOnce(deferred);

    render(<AuthForm mode="login" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), EMAIL);
    await user.type(screen.getByLabelText("Password"), PASSWORD);

    fireEvent.submit(
      screen.getByRole("button", { name: /log in/i }).closest("form")!,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /log in/i })).toBeDisabled();
    });

    resolve({ user: { uid: "uid123" } });
  });

  it("does not call signIn when email is empty", async () => {
    render(<AuthForm mode="login" />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("does not call signIn when password is empty", async () => {
    render(<AuthForm mode="login" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), EMAIL);
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
