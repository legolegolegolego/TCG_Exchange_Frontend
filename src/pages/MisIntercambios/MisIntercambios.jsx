import { useState, useEffect, useMemo } from "react";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import IntercambioHorizontal from "../../components/IntercambioHorizontal/IntercambioHorizontal";
import styles from "./MisIntercambios.module.css";

const MisIntercambios = () => {
  const [intercambios, setIntercambios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  const currentUser = useMemo(() => getCurrentUser(), []);
  const username = currentUser?.username;

  useEffect(() => {
    if (!username) return;

    const fetchIntercambiosCompletos = async () => {
      setLoading(true);
      try {
        const estadoQuery = estadoFiltro !== "TODOS" ? `?estado=${estadoFiltro}` : "";
        const res = await api.get(`/intercambios/usuario/${username}${estadoQuery}`);
        const intercambiosRaw = res.data || [];

        const modeloCache = {};

        // Función para obtener carta física + modelo
        const fetchCartaCompleta = async (idCartaFisica) => {
          if (!idCartaFisica) return null;

          // Carta física
          const cfRes = await api.get(`/cartas-fisicas/${idCartaFisica}`);
          const cf = cfRes.data;

          // Carta modelo (cached)
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

        // Enriquecer cada intercambio
        const intercambiosCompletos = await Promise.all(
          intercambiosRaw.map(async (i) => ({
            ...i,
            cartaOrigen: await fetchCartaCompleta(i.idCartaOrigen),
            cartaDestino: await fetchCartaCompleta(i.idCartaDestino),
          }))
        );

        setIntercambios(intercambiosCompletos);
      } catch (error) {
        console.error("Error al cargar intercambios:", error);
        setIntercambios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntercambiosCompletos();
  }, [estadoFiltro, username]);

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Mis intercambios</h1>

      <div className={styles.filtros}>
        {["TODOS", "PENDIENTE", "ACEPTADO", "RECHAZADO"].map((estado) => (
          <button
            key={estado}
            className={`${styles.filtroBtn} ${estadoFiltro === estado ? styles.active : ""}`}
            onClick={() => setEstadoFiltro(estado)}
          >
            {estado}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loading}>Cargando intercambios...</p>
      ) : intercambios.length === 0 ? (
        <p className={styles.vacio}>No hay intercambios para mostrar</p>
      ) : (
        <div className={styles.lista}>
          {intercambios.map((i) => (
            <IntercambioHorizontal
              key={i.id}
              intercambio={i}
              currentUsername={username}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisIntercambios;