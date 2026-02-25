import api from "./api";

// Obtener cartas modelo con filtros y paginación
export const getCartasModelo = async (filters = {}) => {
	// filters: { numeroMin, numeroMax, nombre, tipoCarta, rareza, tipoPokemon, evolucion, page, size, sort }
	const params = {};

	const possible = ["numeroMin", "numeroMax", "nombre", "tipoCarta", "rareza", "tipoPokemon", "evolucion"];
	possible.forEach(k => {
		if (filters[k] !== undefined && filters[k] !== null && filters[k] !== "") params[k] = filters[k];
	});

	if (filters.page !== undefined) params.page = filters.page;
	if (filters.size !== undefined) params.size = filters.size;
	if (filters.sort !== undefined) params.sort = filters.sort;

	return await api.get("/cartas-modelo", { params });
};

export const getCartaModeloById = async (id) => {
	return await api.get(`/cartas-modelo/${id}`);
};

export const getUsuariosConCartaModelo = async (id) => {
	return await api.get(`/cartas-modelo/${id}/usuarios`);
};

export const createCartaModelo = async (cmDTO) => {
	return await api.post("/cartas-modelo", cmDTO);
};

export const updateCartaModelo = async (id, cmDTO) => {
	return await api.put(`/cartas-modelo/${id}`, cmDTO);
};

export const deleteCartaModelo = async (id) => {
	return await api.delete(`/cartas-modelo/${id}`);
};

export default {
	getCartasModelo,
	getCartaModeloById,
	getUsuariosConCartaModelo,
	createCartaModelo,
	updateCartaModelo,
	deleteCartaModelo,
};