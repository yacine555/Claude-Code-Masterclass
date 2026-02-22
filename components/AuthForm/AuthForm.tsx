"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AuthForm.module.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { generateCodename } from "@/lib/codename";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateEmailField = () => {
    validateEmail(email);
  };

  const validatePasswordField = () => {
    validatePassword(password);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate both fields
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    // Prevent invalid submission
    if (!emailValid || !passwordValid) {
      return;
    }

    if (mode === "signup") {
      setIsLoading(true);
      setFormError("");
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const codename = generateCodename();

        try {
          await updateProfile(userCredential.user, { displayName: codename });
        } catch {
          // silently ignore
        }

        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            id: userCredential.user.uid,
            codename,
          });
        } catch {
          // silently ignore
        }

        router.replace(`/welcome?codename=${codename}`);
      } catch (err: unknown) {
        const code = (err as { code?: string }).code;
        if (code === "auth/email-already-in-use") {
          setFormError("This email is already registered.");
        } else {
          setFormError("Something went wrong. Please try again.");
        }
        setIsLoading(false);
      }
    } else {
      console.log({ email, password, mode });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmailField}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
        />
        {emailError && (
          <span id="email-error" role="alert">
            {emailError}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePasswordField}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={styles.toggleButton}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordError && (
          <span id="password-error" role="alert">
            {passwordError}
          </span>
        )}
      </div>

      {formError && (
        <span role="alert">{formError}</span>
      )}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>

      <p className={styles.navLink}>
        {mode === "login" ? (
          <>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}
