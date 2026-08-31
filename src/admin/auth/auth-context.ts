import { createContext, useContext } from "react";

export interface AdminSession {
  user: string;
  since: string;
}

export interface AuthValue {
  session: AdminSession | null;
  /** Resolves to an error message, or null when the credentials were accepted. */
  signIn: (user: string, password: string, remember: boolean) => Promise<string | null>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function useAdminAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
}
