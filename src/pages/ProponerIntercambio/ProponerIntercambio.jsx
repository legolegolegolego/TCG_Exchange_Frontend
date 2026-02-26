import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import CartaIntercambio from "../../components/CartaIntercambio/CartaIntercambio";
import styles from "./ProponerIntercambio.module.css";

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
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchDatos = async () => {
      setLoading(true);
      try {
        // Carta destino
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
          imagenUrl: cf?.imagenUrl || cm?.imagenUrl || "/placeholder.png",
        });

        // Mis cartas disponibles
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
              imagenUrl: c?.imagenUrl || cmCarta?.imagenUrl || "/placeholder.png",
            };
          })
        );

        setMisCartas(misCartasCompletas);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("No se pudo cargar la carta de destino o tus cartas.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [idCartaDestino, username]);

  const handleEnviar = async () => {
    if (!cartaSeleccionada || enviando) return;

    setEnviando(true);
    setError("");

    try {
      // POST al backend
      const res = await api.post("/intercambios", {
        cartaOrigenId: cartaSeleccionada.id,
        cartaDestinoId: cartaDestino.id,
      });

      const intercambioCreado = res.data;

      // Redirigir directamente al detalle del intercambio y pasar flag de notificación
      navigate(`/intercambio/${intercambioCreado.id}`, {
        state: { notification: { type: "success", message: "Propuesta enviada correctamente" } },
      });
    } catch (err) {
      console.error("Error enviando propuesta:", err);
      setError("No se pudo enviar la propuesta. Intenta de nuevo.");
      setEnviando(false);
    }
  };

  if (loading) return <p>Cargando datos...</p>;
  if (!cartaDestino) return <p>No se pudo cargar la carta de destino.</p>;

  return (
    <div className={styles.container}>
      <h1>Proponer intercambio</h1>
      <p>Selecciona una de tus cartas para intercambiar por {cartaDestino.nombre}</p>

      {error && <div className={styles.mensajeError}>{error}</div>}

      <div className={styles.cartas}>
        <CartaIntercambio carta={cartaDestino} title="Carta solicitada" />
        <CartaIntercambio
          carta={cartaSeleccionada}
          title="Selecciona tu carta"
          placeholderText="Selecciona una carta de tu colección"
        />
      </div>

      <h3>Mis cartas disponibles:</h3>
      <div className={styles.lista}>
        {misCartas.map((c) => (
          <div
            key={c.id}
            className={styles.cartaSeleccionable}
            onClick={() => !enviando && setCartaSeleccionada(c)}
          >
            <CartaIntercambio carta={c} title="" />
          </div>
        ))}
      </div>

      <div className={styles.botones}>
        <button
          onClick={() => navigate("/")}
          disabled={enviando}
        >
          Volver a la página principal
        </button>
        <button
          onClick={handleEnviar}
          disabled={!cartaSeleccionada || enviando}
        >
          {enviando ? "Enviando..." : "Enviar propuesta"}
        </button>
      </div>
    </div>
  );
};

export default ProponerIntercambio;