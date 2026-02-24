import api from "./api";

export const registerUser = async (username, password, password2) => {
  return await api.post("/auth/register", { username, password, password2 });
};

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", response.data); // <-- Solo response.data, no response.data.token
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};