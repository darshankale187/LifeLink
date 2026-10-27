import { createContext, useContext, useState } from "react";
import { postJson } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem("lifelink_user"));
  const [role, setRole] = useState(() => localStorage.getItem("lifelink_role"));

  const authenticate = async (path, username, password) => {
    const data = await postJson(path, { username, password });
    localStorage.setItem("lifelink_token", data.token);
    localStorage.setItem("lifelink_user", data.username);
    localStorage.setItem("lifelink_role", data.role);
    setUser(data.username);
    setRole(data.role);
  };

  const login = (username, password) => authenticate("auth/login", username, password);
  const register = (username, password) => authenticate("auth/register", username, password);

  const logout = () => {
    ["lifelink_token", "lifelink_user", "lifelink_role"].forEach((k) => localStorage.removeItem(k));
    setUser(null);
    setRole(null);
  };

  const isAdmin = role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, role, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);