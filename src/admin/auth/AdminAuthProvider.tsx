import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AdminSession, type AuthValue } from "./auth-context";

const SESSION_KEY = "shob.admin.session.v1";

/**
 * DEMO CREDENTIALS ONLY.
 *
 * This check runs in the browser, which means these strings ship inside the
 * JavaScript bundle and anyone can read them. It exists so a client can be
 * walked through the panel, not to keep anybody out. Replacing it with a real
 * login is a change to `verify` alone: POST to the API, and store the returned
 * token instead of the flag below.
 */
const DEMO_USER = "saiful";
const DEMO_PASSWORD = "abir12##";

async function verify(user: string, password: string): Promise<boolean> {
  // A short pause so the button's pending state is visible, as a network call would be.
  await new Promise((resolve) => setTimeout(resolve, 420));
  return user.trim().toLowerCase() === DEMO_USER && password === DEMO_PASSWORD;
}

function readSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      window.sessionStorage.getItem(SESSION_KEY) ?? window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Partial<AdminSession>;
    return typeof saved.user === "string" && typeof saved.since === "string"
      ? { user: saved.user, since: saved.since }
      : null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(readSession);

  const signIn = useCallback<AuthValue["signIn"]>(async (user, password, remember) => {
    if (!user.trim() || !password) return "Enter both a username and a password.";
    if (!(await verify(user, password))) return "That username and password do not match.";

    const next: AdminSession = { user: user.trim(), since: new Date().toISOString() };
    setSession(next);

    try {
      // "Remember me" is the difference between surviving a tab close and not.
      const store = remember ? window.localStorage : window.sessionStorage;
      store.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — the session still works until the tab is closed */
    }

    return null;
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.localStorage.removeItem(SESSION_KEY);
    } catch {
      /* nothing to clear */
    }
  }, []);

  const value = useMemo<AuthValue>(() => ({ session, signIn, signOut }), [session, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
