import api from "./api";

// Obtener dirección por username
export const getDireccionByUsername = async (username) => {
	return await api.get(`/direccion/${username}`);
};

// Crear dirección
export const createDireccion = async (direccionCreateDTO) => {
	return await api.post(`/direccion`, direccionCreateDTO);
};

// Actualizar dirección
export const updateDireccion = async (direccionCreateDTO) => {
	return await api.put(`/direccion`, direccionCreateDTO);
};

export default {
	getDireccionByUsername,
	createDireccion,
	updateDireccion,
};