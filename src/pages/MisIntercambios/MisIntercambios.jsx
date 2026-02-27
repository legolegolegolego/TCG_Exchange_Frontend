import { useState, useEffect, useMemo } from "react";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import { enriquecerIntercambios } from "../../utils/intercambioUtils";
import IntercambioHorizontal from "../../components/IntercambioHorizontal/IntercambioHorizontal";
import Notification from "../../components/Notification/Notification";
import Button from "../../components/Button/Button"; 
import styles from "./MisIntercambios.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container py-4">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <h2 className="mb-3 text-center">Mis intercambios</h2>

      {/* FILTROS CON BUTTON COMPONENT */}
      <div className="d-flex gap-2 flex-wrap justify-content-center mb-3">
        {["TODOS", "PENDIENTE", "ACEPTADO", "RECHAZADO"].map((estado) => (
          <Button
            key={estado}
            variant={estadoFiltro === estado ? "primary" : "outline"}
            onClick={() => setEstadoFiltro(estado)}
          >
            {estado}
          </Button>
        ))}
      </div>

      {/* LISTADO DE INTERCAMBIOS */}
      {loading ? (
        <p className="text-center fst-italic text-secondary">Cargando intercambios...</p>
      ) : intercambios.length === 0 ? (
        <p className="text-center fst-italic text-secondary">No hay intercambios para mostrar</p>
      ) : (
        <div className="d-flex flex-column gap-3">
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