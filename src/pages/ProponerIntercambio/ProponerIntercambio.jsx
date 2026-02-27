import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import CartaIntercambio from "../../components/CartaIntercambio/CartaIntercambio";
import Notification from "../../components/Notification/Notification";
import Button from "../../components/Button/Button";
import styles from "./ProponerIntercambio.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProponerIntercambio = () => {
  const { idCartaDestino } = useParams();
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const username = currentUser?.username;

  const [cartaDestino, setCartaDestino] = useState(null);
  const [misCartas, setMisCartas] = useState([]);
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchDatos = async () => {
      setLoading(true);
      try {
        const cfRes = await api.get(`/cartas-fisicas/${idCartaDestino}`);
        const cf = cfRes.data;
        const cmRes = await api.get(`/cartas-modelo/${cf.idCartaModelo}`);
        const cm = cmRes.data;

        setCartaDestino({
          ...cf,
          nombre: cm?.nombre || "Desconocido",
          numero: cm?.numero || "?",
          tipoCarta: cm?.tipoCarta,
          rareza: cm?.rareza,
          tipoPokemon: cm?.tipoPokemon,
          evolucion: cm?.evolucion,
          estadoCarta: cf?.estadoCarta || "?",
          imagenUrl: cf?.imagenUrl || cm?.imagenUrl || "/placeholder.png",
        });

        const misCartasRes = await api.get(`/cartas-fisicas/usuario/${username}`);
        const disponibles = misCartasRes.data || [];
        const modeloCache = {};
        const misCartasCompletas = await Promise.all(
          disponibles.map(async (c) => {
            let cmCarta;
            if (modeloCache[c.idCartaModelo]) cmCarta = modeloCache[c.idCartaModelo];
            else {
              const cmRes = await api.get(`/cartas-modelo/${c.idCartaModelo}`);
              cmCarta = cmRes.data;
              modeloCache[c.idCartaModelo] = cmCarta;
            }
            return {
              ...c,
              nombre: cmCarta?.nombre || "Desconocido",
              numero: cmCarta?.numero || "?",
              tipoCarta: cmCarta?.tipoCarta,
              rareza: cmCarta?.rareza,
              tipoPokemon: cmCarta?.tipoPokemon,
              evolucion: cmCarta?.evolucion,
              estadoCarta: c?.estadoCarta || "?",
              imagenUrl: c?.imagenUrl || cmCarta?.imagenUrl || "/placeholder.png",
            };
          })
        );

        setMisCartas(misCartasCompletas);
      } catch (err) {
        const msg = err.response?.data?.mensaje || "No se pudo cargar la carta de destino o tus cartas.";
        setNotification({ type: "error", message: msg });
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [idCartaDestino, username]);

  const handleEnviar = async () => {
    if (!cartaSeleccionada || enviando) return;

    setEnviando(true);
    setNotification(null);

    try {
      const res = await api.post("/intercambios", {
        cartaOrigenId: cartaSeleccionada.id,
        cartaDestinoId: cartaDestino.id,
      });

      const intercambioCreado = res.data;

      navigate(`/intercambio/${intercambioCreado.id}`, {
        state: {
          notification: { type: "success", message: "Propuesta enviada correctamente" },
        },
      });
    } catch (err) {
      const msg = err.response?.data?.mensaje || "No se pudo enviar la propuesta. Intenta de nuevo.";
      setNotification({ type: "error", message: msg });
      setEnviando(false);
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (!cartaDestino) {
    navigate("/", { state: { notification: { type: "error", message: "La carta solicitada no existe." } } });
    return null;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-3">Proponer intercambio</h1>
      <p>Selecciona una de tus cartas para intercambiar por <strong>{cartaDestino.nombre}</strong></p>

      {notification && <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />}

      {/* Cartas principales */}
      <div className="d-flex flex-wrap justify-content-center gap-3 my-3">
        <CartaIntercambio carta={cartaDestino} title="Carta solicitada" />
        <CartaIntercambio
          carta={cartaSeleccionada}
          title="Tu selección"
          placeholderText="Selecciona una carta de tu colección"
        />
      </div>

      <h3 className="mt-4">Mis cartas disponibles:</h3>
      <div className="d-flex flex-wrap gap-3 mt-2">
        {misCartas.map((c) => (
          <div
            key={c.id}
            className={`${styles.cartaSeleccionable} ${cartaSeleccionada?.id === c.id ? styles.selected : ""}`}
            onClick={() => !enviando && setCartaSeleccionada(c)}
          >
            <CartaIntercambio carta={c} title="" />
          </div>
        ))}
      </div>

      {/* Botones */}
      <div className="d-flex gap-2 justify-content-center mt-4 flex-wrap">
        <Button variant="outline" onClick={() => navigate("/")}>Volver a la página principal</Button>
        <Button variant="primary" disabled={!cartaSeleccionada || enviando} onClick={handleEnviar}>
          {enviando ? "Enviando..." : "Enviar propuesta"}
        </Button>
      </div>
    </div>
  );
};

export default ProponerIntercambio;