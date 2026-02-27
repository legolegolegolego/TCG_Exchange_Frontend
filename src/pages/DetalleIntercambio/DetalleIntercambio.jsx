import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import Notification from "../../components/Notification/Notification";
import styles from "./DetalleIntercambio.module.css";
import { aceptarIntercambio, rechazarIntercambio } from "../../services/intercambios.js";

const DetalleCarta = ({ carta, title }) => {
  if (!carta) return null;

  return (
    <div className={styles.cartaContainer}>
      <h3>{title}</h3>
      <img
        src={carta.imagenUrl || "/placeholder.png"}
        alt={carta.nombre || "Carta"}
        className={styles.imagen}
      />
      <p>{carta.nombre || "Desconocido"} #{carta.numero || "?"}</p>
      <p>Estado: {carta.estadoCarta || "?"}</p>
    </div>
  );
};

const DetalleIntercambio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [intercambio, setIntercambio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(location.state?.notification || null);

  const [showAceptarModal, setShowAceptarModal] = useState(false);
  const [showRechazarModal, setShowRechazarModal] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleAceptar = async () => {
    setActionError("");

    try {
      await aceptarIntercambio(id);

      navigate(`/intercambio/${id}`, {
        state: {
          notification: {
            type: "success",
            message: "Intercambio aceptado correctamente"
          }
        }
      });

    } catch (err) {
      setActionError(err.response?.data?.mensaje || "Error al aceptar intercambio");
    }
  };

  const handleRechazar = async () => {
    setActionError("");

    try {
      await rechazarIntercambio(id);

      navigate(`/intercambio/${id}`, {
        state: {
          notification: {
            type: "success",
            message: "Intercambio rechazado"
          }
        }
      });

    } catch (err) {
      setActionError(err.response?.data?.mensaje || "Error al rechazar intercambio");
    }
  };


  useEffect(() => {
    const fetchIntercambioCompleto = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/intercambios/${id}`);
        const data = res.data;

        const modeloCache = {};
        const fetchCartaCompleta = async (idCartaFisica) => {
          if (!idCartaFisica) return null;

          const cfRes = await api.get(`/cartas-fisicas/${idCartaFisica}`);
          const cf = cfRes.data;

          let cm;
          if (modeloCache[cf.idCartaModelo]) cm = modeloCache[cf.idCartaModelo];
          else {
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

        const cartaOrigen = await fetchCartaCompleta(data.idCartaOrigen);
        const cartaDestino = await fetchCartaCompleta(data.idCartaDestino);

        setIntercambio({
          ...data,
          cartaOrigen,
          cartaDestino,
        });
      } catch (err) {
        console.error("Error cargando intercambio:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIntercambioCompleto();
  }, [id]);

  if (loading) return <p>Cargando intercambio...</p>;
  if (!intercambio) return <p>Intercambio no encontrado</p>;

  const esDestino = currentUser?.username === intercambio.usernameDestino;
  const puedeActuar = esDestino && intercambio.estado === "PENDIENTE";

  const isOrigen = currentUser?.username === intercambio.usernameOrigen;
  const usernameOtro = isOrigen ? intercambio.usernameDestino : intercambio.usernameOrigen;

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <h1>Detalle del intercambio</h1>
      <p>
        Propuesta {isOrigen ? "a" : "de"} {usernameOtro}
      </p>
      <p>Estado: {intercambio.estado || "PENDIENTE"}</p>

      <div className={styles.cartas}>
        <DetalleCarta
          carta={isOrigen ? intercambio.cartaDestino : intercambio.cartaOrigen}
          title={isOrigen ? "Recibes" : "Das"}
        />
        <DetalleCarta
          carta={isOrigen ? intercambio.cartaOrigen : intercambio.cartaDestino}
          title={isOrigen ? "Das" : "Recibes"}
        />
      </div>
      {puedeActuar && (
        <div className={styles.actions}>
          <button
            className={styles.acceptButton}
            onClick={() => setShowAceptarModal(true)}
          >
            Aceptar intercambio
          </button>

          <button
            className={styles.rejectButton}
            onClick={() => setShowRechazarModal(true)}
          >
            Rechazar intercambio
          </button>
        </div>
      )}
      {showAceptarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>¿Aceptar intercambio?</h3>
            <p>Esta acción confirmará el intercambio.</p>

            {actionError && <p className={styles.error}>{actionError}</p>}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowAceptarModal(false)}
              >
                Volver
              </button>

              <button
                className={styles.confirmButton}
                onClick={handleAceptar}
              >
                Sí, aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {showRechazarModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>¿Rechazar intercambio?</h3>
            <p>Esta acción cancelará el intercambio.</p>

            {actionError && <p className={styles.error}>{actionError}</p>}

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowRechazarModal(false)}
              >
                Volver
              </button>

              <button
                className={styles.confirmDeleteButton}
                onClick={handleRechazar}
              >
                Sí, rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleIntercambio;