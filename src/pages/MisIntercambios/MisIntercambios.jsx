import { useState, useEffect, useMemo } from "react";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import { enriquecerIntercambios } from "../../utils/intercambioUtils";
import IntercambioHorizontal from "../../components/IntercambioHorizontal/IntercambioHorizontal";
import Notification from "../../components/Notification/Notification";
import styles from "./MisIntercambios.module.css";

const MisIntercambios = () => {
  const [intercambios, setIntercambios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");
  const [notification, setNotification] = useState(null);

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
        const intercambiosCompletos = await enriquecerIntercambios(intercambiosRaw);
        setIntercambios(intercambiosCompletos);
      } catch (error) {
        const msg = error.response?.data?.mensaje || "Error al cargar intercambios.";
        setNotification({ type: "error", message: msg });
        setIntercambios([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntercambiosCompletos();
  }, [estadoFiltro, username]);

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

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