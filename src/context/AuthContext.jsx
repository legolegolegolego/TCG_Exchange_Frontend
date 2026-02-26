import { createContext, useContext, useState, useMemo } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const getUsernameFromToken = (t) => {
    try {
      if (!t) return null;
      const parts = t.split(".");
      if (parts.length < 2) return null;
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub
    } catch (e) {
      return null;
    }
  };

  const username = useMemo(() => getUsernameFromToken(token), [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);