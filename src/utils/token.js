import {jwtDecode} from "jwt-decode";

const TOKEN_KEY = "token";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getDecodedToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = () => {
  const decoded = getDecodedToken();
  if (!decoded?.exp) return true;

  const now = Date.now() / 1000;
  return decoded.exp < now;
};

export const getCurrentUser = () => {
  const decoded = getDecodedToken();
  if (!decoded) return null;

  return {
    id: decoded.id,
    username: decoded.sub,
    roles: decoded.roles || []
  };
};