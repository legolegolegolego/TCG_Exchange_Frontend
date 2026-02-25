import api from "./api";

export const registerUser = async (username, password, password2) => {
  return await api.post("/auth/register", { username, password, password2 });
};

export const loginUser = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });

  let token;
  const data = response.data;

  if (typeof data === "string") {
    token = data;
  } else if (data && typeof data === "object") {
    token = data.token || data.accessToken || data.access_token || data?.data?.token;
  }

  if (!token) {
    throw new Error("Token no encontrado en la respuesta del servidor");
  }

  localStorage.setItem("token", token);
  return token;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};