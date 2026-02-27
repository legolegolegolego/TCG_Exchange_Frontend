import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UsuarioCartas.module.css";
import { getDisponiblesByUsername } from "../../services/cartasFisicas";
import CardFisica from "../../components/CardFisica/CardFisica";
import Notification from "../../components/Notification/Notification";

const UsuarioCartas = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!username) {
        navigate("/");
        return;
      }
      setLoading(true);
      try {
        const res = await getDisponiblesByUsername(username);
        const data = res.data || [];
        if (data.length === 0) {
          throw { response: { data: { mensaje: "Usuario no válido o sin cartas" } } };
        }
        setCartas(data);
        setIsValid(true);
      } catch (err) {
        const msg = err.response?.data?.mensaje || "Error al cargar las cartas del usuario.";
        setNotification({ type: "error", message: msg });
        navigate("/", { state: { notification: { type: "error", message: msg } } });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username, navigate]);

  if (!isValid) return null;

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <h2 className={styles.username}>{username}</h2>
      <h3 className={styles.sectionTitle}>Cartas disponibles para intercambio</h3>
      {loading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : (
        <div className={styles.grid}>
          {cartas.map((c) => (
            <CardFisica key={c.id} carta={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuarioCartas;