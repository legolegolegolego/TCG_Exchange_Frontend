import api from "./api";


// Obtener todos los usuarios
export const getAllUsers = async () => {
	return await api.get("/usuarios");
};

// Obtener usuario por username (necesario si el JWT no contiene id)
export const getByUsername = async (username) => {
	return await api.get(`/usuarios/username/${encodeURIComponent(username)}`);
};

// Cambiar nombre de usuario: requiere id en la ruta y DTO { nuevoUsername }
export const changeUsername = async (id, nuevoUsername) => {
	return await api.put(`/usuarios/${id}/username`, { nuevoUsername });
};

// Cambiar contraseña: requiere id en la ruta y PasswordUpdateDTO
export const changePassword = async (id, passwordDto) => {
	return await api.put(`/usuarios/${id}/password`, passwordDto);
};


// Eliminar usuario
export const deleteUser = async (id) => {
	return await api.delete(`/usuarios/${id}`);
};