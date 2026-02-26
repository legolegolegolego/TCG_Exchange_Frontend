import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";
import CartaVisual from "../../components/CartaVisual/CartaVisual";
import styles from "./DetalleIntercambio.module.css";

const DetalleIntercambio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [intercambio, setIntercambio] = useState(null);
  const [loading, setLoading] = useState(true);

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

        setIntercambio({ ...data, cartaOrigen, cartaDestino });
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

  const isOrigen = currentUser?.username === intercambio.usernameOrigen;
  const usernameOtro = isOrigen ? intercambio.usernameDestino : intercambio.usernameOrigen;

  return (
    <div className={styles.container}>
      <button className={styles.volverBtn} onClick={() => navigate(-1)}>← Volver</button>

      <h1>Detalle del intercambio</h1>
      <p>Propuesta {isOrigen ? "a" : "de"} {usernameOtro}</p>
      <p>Estado: {intercambio.estado || "PENDIENTE"}</p>

      <div className={styles.cartas}>
        <CartaVisual
          carta={isOrigen ? intercambio.cartaDestino : intercambio.cartaOrigen}
          title={isOrigen ? "Recibes" : "Das"}
        />
        <CartaVisual
          carta={isOrigen ? intercambio.cartaOrigen : intercambio.cartaDestino}
          title={isOrigen ? "Das" : "Recibes"}
        />
      </div>
    </div>
  );
};

export default DetalleIntercambio;