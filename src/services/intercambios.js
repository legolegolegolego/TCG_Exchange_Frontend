import api from "./api";

// Obtener intercambios de un usuario (opcional filtro por estado)
export const getIntercambiosByUsuario = async (username, estado) => {
	const params = {};
	if (estado !== undefined && estado !== null && estado !== "") params.estado = estado;
	return await api.get(`/intercambios/usuario/${username}`, { params });
};

// Obtener intercambio por id
export const getIntercambioById = async (id) => {
	return await api.get(`/intercambios/${id}`);
};

// Crear nuevo intercambio
export const createIntercambio = async (intercambioCreateDTO) => {
	return await api.post(`/intercambios`, intercambioCreateDTO);
};

// Aceptar intercambio
export const aceptarIntercambio = async (id) => {
	return await api.put(`/intercambios/${id}/aceptar`);
};

// Rechazar intercambio
export const rechazarIntercambio = async (id) => {
	return await api.put(`/intercambios/${id}/rechazar`);
};

export default {
	getIntercambiosByUsuario,
	getIntercambioById,
	createIntercambio,
	aceptarIntercambio,
	rechazarIntercambio,
};