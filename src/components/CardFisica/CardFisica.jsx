import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./CardFisica.module.css";
import Button from "../Button/Button";

const estadoColores = {
  EXCELENTE: "success",
  ACEPTABLE: "warning",
  DEFAULT: "secondary",
};

const CardFisica = ({ carta }) => {
  const navigate = useNavigate();
  const [cartaEnriquecida, setCartaEnriquecida] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrichCarta = async () => {
      if (!carta) return;
      setLoading(true);
      try {
        const cf = carta;
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
        setCartaEnriquecida(carta);
      } finally {
        setLoading(false);
      }
    };

    enrichCarta();
  }, [carta]);

  if (loading) return <div className="card text-center p-3 bg-white">Cargando...</div>;
  if (!cartaEnriquecida) return null;

  const { nombre, numero, imagenUrl, estadoCarta, disponible, id } = cartaEnriquecida;

  const estadoRaw = estadoCarta;
  const estado = estadoRaw
    ? capitalize(estadoRaw)
    : disponible
    ? "Disponible"
    : "No disponible";

  function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  const badgeColor = estadoColores[estadoRaw] || estadoColores.DEFAULT;

  return (
    <div className={`card h-100 shadow-sm ${styles.clickable} bg-white`}>
      <div className="position-relative">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={nombre}
            className="card-img-top"
            style={{ objectFit: "cover", aspectRatio: "3/4" }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "200px", color: "#aaa" }}>
            No image
          </div>
        )}
        {estado && (
          <span className={`badge position-absolute top-0 start-0 m-2 bg-${badgeColor}`}>
            {estado}
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column gap-2 p-2">
        <h5 className="card-title text-truncate mb-1">{nombre} #{numero}</h5>
        {id && (
          <Button
            variant="primary"
            size="md"
            className="w-100 mt-1"
            onClick={() => navigate(`/proponer-intercambio/${id}`)}
          >
            Proponer intercambio
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardFisica;