import api from "./api";

export const registerUser = async (username, email, password, password2) => {
  return await api.post("/auth/register", { username, email, password, password2 });
};

export const loginUser = async (identifier, password) => {
  const response = await api.post("/auth/login", { identifier, password });

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

  return token;
};

export const verifyEmail = async (token) => {
  return await api.get(`/auth/verify?token=${token}`);
};

export const resendVerification = async (email) => {
  return await api.post(`/auth/verify/resend?email=${email}`);
};

export const forgotPassword = async (email) => {
  return await api.post(`/auth/password/forgot?email=${email}`);
};

export const resetPassword = async (passwordResetDTO) => {
  return await api.post(`/auth/password/reset`, passwordResetDTO);
};

export default {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};