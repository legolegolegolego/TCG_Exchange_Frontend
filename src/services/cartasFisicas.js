import api from "./api";

// Cartas físicas: disponibles por usuario
export const getDisponiblesByUsername = async (username) => {
	return await api.get(`/cartas-fisicas/usuario/${username}`);
};

// Cartas físicas no disponibles por usuario (requiere auth)
export const getNoDisponiblesByUsername = async (username) => {
	return await api.get(`/cartas-fisicas/usuario/${username}/no-disponibles`);
};

// Obtener carta física por id
export const getCartaFisicaById = async (id) => {
	return await api.get(`/cartas-fisicas/${id}`);
};

// Crear carta física
export const createCartaFisica = (formData) => {
  return api.post("/cartas-fisicas", formData);
};

// Actualizar carta física
export const updateCartaFisica = (id, formData) => {
  return api.put(`/cartas-fisicas/${id}`, formData);
};

// Borrar carta física
export const deleteCartaFisica = async (id) => {
	return await api.delete(`/cartas-fisicas/${id}`);
};

export default {
	getDisponiblesByUsername,
	getNoDisponiblesByUsername,
	getCartaFisicaById,
	createCartaFisica,
	updateCartaFisica,
	deleteCartaFisica,
};