import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import styles from "./CardFisica.module.css";

const CardFisica = ({ carta }) => {
  const navigate = useNavigate();
  const [cartaEnriquecida, setCartaEnriquecida] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrichCarta = async () => {
      if (!carta) return;

      setLoading(true);
      try {
        // Carta física
        const cf = carta;

        // Carta modelo
        const cmRes = await api.get(`/cartas-modelo/${cf.idCartaModelo}`);
        const cm = cmRes.data;

        setCartaEnriquecida({
          ...cf,
          nombre: cm?.nombre || cf?.nombre || "Desconocido",
          numero: cm?.numero || cf?.numero || "?",
          tipoCarta: cm?.tipoCarta,
          rareza: cm?.rareza,
          tipoPokemon: cm?.tipoPokemon,
          evolucion: cm?.evolucion,
          imagenUrl: cf?.imagenUrl || cm?.imagenUrl || "/placeholder.png",
        });
      } catch (err) {
        console.error("Error enriqueciendo carta:", err);
        setCartaEnriquecida(carta); // fallback
      } finally {
        setLoading(false);
      }
    };

    enrichCarta();
  }, [carta]);

  if (loading) return <div className={styles.card}>Cargando...</div>;
  if (!cartaEnriquecida) return null;

  const { nombre, numero, imagenUrl, estadoCarta, disponible, id } = cartaEnriquecida;

  const estadoRaw = estadoCarta; // 'EXCELENTE' | 'ACEPTABLE'
  const estado = estadoRaw
    ? capitalize(estadoRaw)
    : disponible
    ? "Disponible"
    : "No disponible";

  function capitalize(s) {
    if (!s) return s;
    const str = String(s);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const statusClass = estadoRaw
    ? estadoRaw.toLowerCase() === "excelente"
      ? styles.statusExcelente
      : estadoRaw.toLowerCase() === "aceptable"
      ? styles.statusAceptable
      : styles.status
    : styles.statusUnknown;

  return (
    <div className={styles.card}>
      <div className={styles.media}>
        {imagenUrl ? <img src={imagenUrl} alt={nombre} /> : <div className={styles.placeholder}>No image</div>}
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{nombre} #{numero}</div>
        <div className={styles.meta}>Estado: <span className={statusClass}>{estado}</span></div>
        <div className={styles.actions}>
          <button
            className={styles.proposeButton}
            onClick={() => navigate(`/proponer-intercambio/${id}`)}
          >
            Proponer intercambio
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardFisica;