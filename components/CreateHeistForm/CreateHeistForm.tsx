"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/contexts/AuthContext";
import { COLLECTIONS, UserDoc, userConverter } from "@/types/firestore";
import type { CreateHeistInput } from "@/types/firestore";
import styles from "./CreateHeistForm.module.css";

export default function CreateHeistForm() {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedToCodename, setAssignedToCodename] = useState("");
  const [titleError, setTitleError] = useState("");
  const [assignedToError, setAssignedToError] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState<UserDoc[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersRef = collection(db, COLLECTIONS.USERS).withConverter(userConverter);
        const snapshot = await getDocs(usersRef);
        const allUsers = snapshot.docs.map((doc) => doc.data());
        setUsers(allUsers.filter((u) => u.id !== user?.uid));
      } catch {
        setFormError("Failed to load users.");
      } finally {
        setUsersLoading(false);
      }
    }
    fetchUsers();
  }, [user?.uid]);

  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setTitleError("Title is required");
      return false;
    }
    setTitleError("");
    return true;
  };

  const validateAssignedTo = (value: string): boolean => {
    if (!value) {
      setAssignedToError("Assigned user is required");
      return false;
    }
    setAssignedToError("");
    return true;
  };

  const handleAssignedToChange = (uid: string) => {
    setAssignedTo(uid);
    const selected = users.find((u) => u.id === uid);
    setAssignedToCodename(selected?.codename ?? "");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const titleValid = validateTitle(title);
    const assignedValid = validateAssignedTo(assignedTo);

    if (!titleValid || !assignedValid) return;

    setIsLoading(true);
    setFormError("");

    try {
      const heistData: CreateHeistInput = {
        title: title.trim(),
        description: description.trim(),
        createdBy: user!.uid,
        createdByCodename: user!.displayName ?? "Unknown",
        assignedTo,
        assignedToCodename,
        deadline: Timestamp.fromDate(new Date("2030-12-31")),
        finalStatus: null,
      };

      await addDoc(collection(db, COLLECTIONS.HEISTS), heistData);
      router.replace("/heists");
    } catch {
      setFormError("Failed to create heist. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => validateTitle(title)}
          aria-invalid={!!titleError}
          aria-describedby={titleError ? "title-error" : undefined}
        />
        {titleError && (
          <span id="title-error" role="alert">
            {titleError}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="assignedTo">Assign To</label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => handleAssignedToChange(e.target.value)}
          onBlur={() => validateAssignedTo(assignedTo)}
          aria-invalid={!!assignedToError}
          aria-describedby={assignedToError ? "assignedTo-error" : undefined}
          disabled={usersLoading}
        >
          <option value="">
            {usersLoading ? "Loading users..." : "Select a user"}
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.codename}
            </option>
          ))}
        </select>
        {assignedToError && (
          <span id="assignedTo-error" role="alert">
            {assignedToError}
          </span>
        )}
      </div>

      {formError && <span role="alert">{formError}</span>}

      <button type="submit" className={styles.submitButton} disabled={isLoading || usersLoading}>
        {isLoading ? "Creating..." : "Create Heist"}
      </button>
    </form>
  );
}
