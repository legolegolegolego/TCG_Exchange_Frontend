import { useState, useEffect, useMemo } from "react";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import IntercambioHorizontal from "../../components/IntercambioHorizontal/IntercambioHorizontal";
import styles from "./MisIntercambios.module.css";

const MisIntercambios = () => {
  const [intercambios, setIntercambios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  // Memoizamos solo el username para evitar re-render infinito
  const currentUser = useMemo(() => getCurrentUser(), []);
  const username = currentUser?.username;

  useEffect(() => {
    if (!username) return;

    const fetchIntercambios = async () => {
      setLoading(true);
      try {
        const estadoQuery = estadoFiltro !== "TODOS" ? `?estado=${estadoFiltro}` : "";
        const res = await api.get(`/intercambios/usuario/${username}${estadoQuery}`);
        setIntercambios(res.data || []);
      } catch (error) {
        console.error("Error al cargar intercambios:", error);
        setIntercambios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntercambios();
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