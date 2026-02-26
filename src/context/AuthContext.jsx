import { createContext, useContext, useState, useMemo } from "react";
import { getToken, setToken, removeToken, getCurrentUser } from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());

  const login = (newToken) => {
    setToken(newToken);        // utils
    setTokenState(newToken);   // estado React
  };

  const logout = () => {
    removeToken();             // utils
    setTokenState(null);
  };

  const user = useMemo(() => getCurrentUser(), [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);