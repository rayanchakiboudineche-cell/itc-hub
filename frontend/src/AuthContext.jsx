import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("/api/auth/me").then(setUser).catch(() => setUser(null));
  }, []);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    sessionStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}