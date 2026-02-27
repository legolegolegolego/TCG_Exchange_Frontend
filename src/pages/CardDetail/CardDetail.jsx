import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./CardDetail.module.css";
import { getCartaModeloById, getUsuariosConCartaModelo } from "../../services/cartasModelo";
import Notification from "../../components/Notification/Notification";

const tipoColores = {
  AGUA: "#3498db",
  FUEGO: "#e74c3c",
  PLANTA: "#2ecc71",
  ELECTRICO: "#f1c40f",
  PSIQUICO: "#8e44ad",
  LUCHA: "#d35400",
  INCOLORO: "#bdc3c7",
  OSCURO: "#2c3e50",
  METAL: "#95a5a6",
  HADA: "#ff9ff3",
  DRAGON: "#6c5ce7",
  ENTRENADOR: "#ffffff"
};

const rarezaColores = {
  COMUN: "#95a5a6",
  INFRECUENTE: "#3498db",
  RARA: "#ff8c08",
  RARA_HOLO: "#c00ff1"
};

const CardDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [carta, setCarta] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resCarta = await getCartaModeloById(id);
        const dataCarta = resCarta.data || resCarta;
        if (!dataCarta) throw { response: { data: { mensaje: "Carta no encontrada" } } };
        setCarta(dataCarta);

        const resUsers = await getUsuariosConCartaModelo(id);
        setUsuarios(resUsers.data || []);
      } catch (err) {
        const msg = err.response?.data?.mensaje || "Error al cargar la carta";
        setNotification({ type: "error", message: msg });
        navigate("/", { state: { notification: { type: "error", message: msg } } });
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, navigate]);

  if (loading) return <div className={styles.container}>Cargando...</div>;
  if (!carta) return null;

  const { nombre, numero, rareza, tipoPokemon, tipoCarta, evolucion, imagenUrl } = carta;
  const glowColor = tipoColores[tipoPokemon] || "#999";
  const rarezaColor = rarezaColores[rareza] || "#777";

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={styles.top}>
        {/* Imagen más grande */}
        <div
          className={styles.imageWrap}
          style={{
            borderColor: glowColor,
            boxShadow: `0 0 18px ${glowColor}`
          }}
        >
          {imagenUrl ? (
            <img src={imagenUrl} alt={nombre} />
          ) : (
            <div className={styles.noImage}>No image</div>
          )}
        </div>

        {/* Info a la derecha */}
        <div className={styles.info}>
          <h2 className={styles.name}>{nombre}</h2>

          {tipoPokemon && tipoPokemon !== "ENTRENADOR" && (
            <div className={styles.row}>
              <strong>Tipo Pokémon:</strong>{" "}
              <span style={{ color: glowColor, fontWeight: 600 }}>{tipoPokemon}</span>
            </div>
          )}

          <div className={styles.row}><strong>Número:</strong> #{numero ?? '-'}</div>
          <div className={styles.row}><strong>Tipo carta:</strong> {tipoCarta || '-'}</div>

          {rareza && (
            <div className={styles.row}>
              <strong>Rareza:</strong>{" "}
              <span style={{
                color: "#fff",
                backgroundColor: rarezaColor,
                padding: "2px 6px",
                borderRadius: "6px",
                fontWeight: 600
              }}>
                {rareza}
              </span>
            </div>
          )}

          {tipoPokemon && tipoPokemon !== "ENTRENADOR" && (
            <div className={styles.row}><strong>Evolución:</strong> {evolucion || '-'}</div>
          )}
        </div>
      </div>

      <div className={styles.usersSection}>
        <h3>Usuarios que tienen la carta</h3>
        {usuarios.length === 0 ? (
          <div className={styles.noUsers}>Nadie tiene esta carta.</div>
        ) : (
          <ul className={styles.userList}>
            {usuarios.map((u) => {
              const uname = u.username || u.nombre || u.email || u.id;
              return (
                <li key={u.id} className={styles.userItem}>
                  <div className={styles.userName}>{uname}</div>
                  <Link
                    to={`/usuario/${uname}`}
                    state={{ from: location.pathname, fromLabel: 'vista de carta modelo' }}
                  >
                    <button className={styles.userButton}>Ver cartas</button>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CardDetail;