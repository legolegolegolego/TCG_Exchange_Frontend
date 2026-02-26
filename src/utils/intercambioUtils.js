import api from "../services/api";

/**
 * Enriquecer una carta física con su modelo.
 * @param {number} idCartaFisica
 * @param {Object} modeloCache
 * @returns carta completa
 */
export const fetchCartaCompleta = async (idCartaFisica, modeloCache = {}) => {
  if (!idCartaFisica) return null;

  const cfRes = await api.get(`/cartas-fisicas/${idCartaFisica}`);
  const cf = cfRes.data;

  let cm;
  if (modeloCache[cf.idCartaModelo]) {
    cm = modeloCache[cf.idCartaModelo];
  } else {
    const cmRes = await api.get(`/cartas-modelo/${cf.idCartaModelo}`);
    cm = cmRes.data;
    modeloCache[cf.idCartaModelo] = cm;
  }

  return {
    ...cf,
    nombre: cm?.nombre || "Desconocido",
    numero: cm?.numero || "?",
    tipoCarta: cm?.tipoCarta,
    rareza: cm?.rareza,
    tipoPokemon: cm?.tipoPokemon,
    evolucion: cm?.evolucion,
    imagenUrl: cf?.imagenUrl || cm?.imagenUrl || "/placeholder.png",
  };
};

/**
 * Enriquecer un intercambio o lista de intercambios.
 * @param {Object|Array} intercambios
 */
export const enriquecerIntercambios = async (intercambios) => {
  const lista = Array.isArray(intercambios) ? intercambios : [intercambios];
  const modeloCache = {};

  const intercambiosCompletos = await Promise.all(
    lista.map(async (i) => ({
      ...i,
      cartaOrigen: await fetchCartaCompleta(i.idCartaOrigen, modeloCache),
      cartaDestino: await fetchCartaCompleta(i.idCartaDestino, modeloCache),
    }))
  );

  return Array.isArray(intercambios) ? intercambiosCompletos : intercambiosCompletos[0];
};