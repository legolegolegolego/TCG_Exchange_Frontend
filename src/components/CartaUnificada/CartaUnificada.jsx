import { useState, useEffect } from "react";
import api from "../../services/api";
import styles from "./CartaUnificada.module.css";
import Button from "../Button/Button";

const estadoColores = {
  EXCELENTE: { bg: "success", text: "white" },
  ACEPTABLE: { bg: "warning", text: "dark" },
};

const formatEstado = (estado) => {
  if (!estado) return "";
  return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
};

const CartaUnificada = ({
  carta,
  placeholderText,
  isSelectable = false,
  isSelected = false,
  onClick,
  actions = [],
}) => {
  const [cartaEnriquecida, setCartaEnriquecida] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrichCarta = async () => {
      if (!carta) {
        setCartaEnriquecida(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let cm;
        if (carta.idCartaModelo) {
          const cmRes = await api.get(`/cartas-modelo/${carta.idCartaModelo}`);
          cm = cmRes.data;
        }
        setCartaEnriquecida({
          ...carta,
          nombre: cm?.nombre || carta?.nombre || "Desconocido",
          numero: cm?.numero || carta?.numero || "?",
          estadoCarta: carta.estadoCarta || "?",
          imagenUrl: carta.imagenUrl || cm?.imagenUrl || "/placeholder.png",
        });
      } catch (err) {
        console.error(err);
        setCartaEnriquecida(carta);
      } finally {
        setLoading(false);
      }
    };
    enrichCarta();
  }, [carta]);

  if (loading)
    return (
      <div className={`card ${styles.cardContainer} ${styles.loading}`}>
        Cargando...
      </div>
    );

  if (!cartaEnriquecida)
    return (
      <div className={`card ${styles.cardContainer} ${placeholderText ? styles.placeholder : ""}`}>
        {placeholderText || null}
      </div>
    );

  const { nombre, numero, estadoCarta, imagenUrl } = cartaEnriquecida;
  const { bg, text } = estadoColores[estadoCarta] || { bg: "secondary", text: "white" };

  return (
    <div
      className={`${styles.cardContainer} ${isSelectable ? styles.selectable : ""} ${isSelected ? styles.selected : ""
        }`}
      onClick={isSelectable ? onClick : undefined}
    >
      <div className={styles.imageWrapper}>
        <img src={imagenUrl} alt={nombre} className={styles.image} />
        {estadoCarta && (
          <span className={`badge bg-${bg} text-${text} ${styles.estadoBadge}`}>
            {formatEstado(estadoCarta)}
          </span>
        )}
      </div>
      <p className="fw-semibold mt-2 mb-0 text-center">
        {nombre} #{numero}
      </p>
      {actions?.length > 0 && (
        <div
          className={`${styles.actions} ${actions.length === 1 ? styles.singleAction : ""
            }`}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "primary"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              className={styles.actionButton}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartaUnificada;