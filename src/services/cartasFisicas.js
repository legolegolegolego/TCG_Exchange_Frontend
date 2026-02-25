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
export const createCartaFisica = async (cfCreateDTO) => {
	return await api.post(`/cartas-fisicas`, cfCreateDTO);
};

// Actualizar carta física
export const updateCartaFisica = async (id, cfCreateDTO) => {
	return await api.put(`/cartas-fisicas/${id}`, cfCreateDTO);
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