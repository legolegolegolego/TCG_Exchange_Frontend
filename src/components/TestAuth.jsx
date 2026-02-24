import React from "react";
import { registerUser, loginUser } from "../services/auth.js";
import { jwtDecode } from "jwt-decode";

const TestAuth = () => {
  const handleRegister = async () => {
    try {
      const res = await registerUser("usuarioPrueba", "123456", "123456");
      console.log("Usuario registrado:", res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleLogin = async () => {
    try {
      const token = await loginUser("usuarioPrueba", "123456");
      console.log("Token:", token);
      console.log("Decoded:", jwtDecode(token));
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <button onClick={handleRegister}>Registrar</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default TestAuth;