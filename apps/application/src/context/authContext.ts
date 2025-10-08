import { createContext, useContext } from "react";
import type { AuthContextType } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
