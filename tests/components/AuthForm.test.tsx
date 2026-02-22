import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import AuthForm from "@/components/AuthForm";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "uid123" } }),
  updateProfile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("firebase/firestore", () => ({
  setDoc: vi.fn().mockResolvedValue(undefined),
  doc: vi.fn().mockReturnValue("users/uid123"),
}));

vi.mock("@/lib/firebase", () => ({ auth: {}, db: {} }));

vi.mock("@/lib/codename", () => ({
  generateCodename: vi.fn(() => "SilentCrimsonFox"),
}));

// ─────────────────────────────────────────────────────────────────────────────

describe("AuthForm", () => {
  describe("Rendering", () => {
    it("renders all required fields for login mode", () => {
      render(<AuthForm mode="login" />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /log in/i }),
      ).toBeInTheDocument();
    });

    it("renders all required fields for signup mode", () => {
      render(<AuthForm mode="signup" />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up/i }),
      ).toBeInTheDocument();
    });

    it("shows correct submit button text for login mode", () => {
      render(<AuthForm mode="login" />);

      expect(
        screen.getByRole("button", { name: /log in/i }),
      ).toBeInTheDocument();
    });

    it("shows correct submit button text for signup mode", () => {
      render(<AuthForm mode="signup" />);

      expect(
        screen.getByRole("button", { name: /sign up/i }),
      ).toBeInTheDocument();
    });

    it("associates labels with inputs via htmlFor/id", () => {
      render(<AuthForm mode="login" />);

      const emailLabel = screen.getByText("Email");
      const passwordLabel = screen.getByText("Password");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      expect(emailLabel).toHaveAttribute("for", "email");
      expect(emailInput).toHaveAttribute("id", "email");
      expect(passwordLabel).toHaveAttribute("for", "password");
      expect(passwordInput).toHaveAttribute("id", "password");
    });
  });

  describe("Password Toggle", () => {
    it("has password input type by default", () => {
      render(<AuthForm mode="login" />);

      const passwordInput = screen.getByLabelText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("changes input type to text when toggle is clicked", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const passwordInput = screen.getByLabelText("Password");
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      await user.click(toggleButton);

      expect(passwordInput).toHaveAttribute("type", "text");
    });

    it("changes back to password type when toggle is clicked again", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const passwordInput = screen.getByLabelText("Password");
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute("type", "text");

      const hideButton = screen.getByRole("button", { name: /hide password/i });
      await user.click(hideButton);

      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("has accessible aria-label on toggle button", () => {
      render(<AuthForm mode="login" />);

      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });
      expect(toggleButton).toHaveAttribute("aria-label", "Show password");
    });
  });

  describe("Input", () => {
    it("allows email field to accept user input", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("allows password field to accept user input", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });
  });

  describe("Validation", () => {
    it("shows error for invalid email format on blur", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "invalidemail");
      await user.tab();

      expect(
        screen.getByText(/please enter a valid email address/i),
      ).toBeInTheDocument();
    });

    it("shows error for password less than 8 characters on blur", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "short");
      await user.tab();

      expect(
        screen.getByText(/password must be at least 8 characters/i),
      ).toBeInTheDocument();
    });

    it("shows error when email is empty on submit", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const submitButton = screen.getByRole("button", { name: /log in/i });
      await user.click(submitButton);

      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    it("shows error when password is empty on submit", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const submitButton = screen.getByRole("button", { name: /log in/i });
      await user.click(submitButton);

      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it("prevents submission when email is invalid", async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, "log");
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(emailInput, "invalidemail");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(
        screen.getByText(/please enter a valid email address/i),
      ).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("prevents submission when password is too short", async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, "log");
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "short");
      await user.click(submitButton);

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(
        screen.getByText(/password must be at least 8 characters/i),
      ).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("clears errors when valid input is provided", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      // Trigger errors
      await user.type(emailInput, "invalidemail");
      await user.tab();
      expect(
        screen.getByText(/please enter a valid email address/i),
      ).toBeInTheDocument();

      await user.type(passwordInput, "short");
      await user.tab();
      expect(
        screen.getByText(/password must be at least 8 characters/i),
      ).toBeInTheDocument();

      // Fix email
      await user.clear(emailInput);
      await user.type(emailInput, "test@example.com");
      await user.tab();
      expect(
        screen.queryByText(/please enter a valid email address/i),
      ).not.toBeInTheDocument();

      // Fix password
      await user.clear(passwordInput);
      await user.type(passwordInput, "password123");
      await user.tab();
      expect(
        screen.queryByText(/password must be at least 8 characters/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    it("logs email and password to console on valid submission", async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, "log");
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(consoleSpy).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        mode: "login",
      });

      consoleSpy.mockRestore();
    });

    it("does not log to console for signup (uses Firebase instead)", async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, "log");
      render(<AuthForm mode="signup" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: /sign up/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("does not log when validation fails", async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, "log");
      render(<AuthForm mode="login" />);

      const submitButton = screen.getByRole("button", { name: /log in/i });
      await user.click(submitButton);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Navigation", () => {
    it("renders sign up link for login mode", () => {
      render(<AuthForm mode="login" />);

      const signupLink = screen.getByRole("link", { name: /sign up/i });
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute("href", "/signup");
    });

    it("renders log in link for signup mode", () => {
      render(<AuthForm mode="signup" />);

      const loginLink = screen.getByRole("link", { name: /log in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("displays correct navigation text for login mode", () => {
      render(<AuthForm mode="login" />);

      expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    });

    it("displays correct navigation text for signup mode", () => {
      render(<AuthForm mode="signup" />);

      expect(
        screen.getByText(/already have an account\?/i),
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role=alert on error messages", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const submitButton = screen.getByRole("button", { name: /log in/i });
      await user.click(submitButton);

      const emailError = screen.getByText(/email is required/i);
      const passwordError = screen.getByText(/password is required/i);

      expect(emailError).toHaveAttribute("role", "alert");
      expect(passwordError).toHaveAttribute("role", "alert");
    });

    it("sets aria-invalid on inputs with errors", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      expect(emailInput).toHaveAttribute("aria-invalid", "false");
      expect(passwordInput).toHaveAttribute("aria-invalid", "false");

      await user.type(emailInput, "invalidemail");
      await user.tab();
      expect(emailInput).toHaveAttribute("aria-invalid", "true");

      await user.type(passwordInput, "short");
      await user.tab();
      expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    });

    it("links inputs to error messages with aria-describedby", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      await user.type(emailInput, "invalidemail");
      await user.tab();
      expect(emailInput).toHaveAttribute("aria-describedby", "email-error");

      await user.type(passwordInput, "short");
      await user.tab();
      expect(passwordInput).toHaveAttribute(
        "aria-describedby",
        "password-error",
      );
    });

    it("allows tab navigation through form fields", async () => {
      const user = userEvent.setup();
      render(<AuthForm mode="login" />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const toggleButton = screen.getByRole("button", {
        name: /show password/i,
      });
      const submitButton = screen.getByRole("button", { name: /log in/i });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(toggleButton).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});
