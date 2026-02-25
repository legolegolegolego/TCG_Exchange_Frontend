import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./UsuarioCartas.module.css";
import { getDisponiblesByUsername } from "../../services/cartasFisicas";
import CardFisica from "../../components/CardFisica/CardFisica";

const UsuarioCartas = () => {
  const { username } = useParams();
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getDisponiblesByUsername(username);
        setCartas(res.data || res || []);
      } catch (err) {
        console.error(err);
        setCartas([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) load();
  }, [username]);

  return (
    <div className={styles.container}>
      <h2 className={styles.username}>{username}</h2>

      <h3 className={styles.sectionTitle}>Cartas disponibles para intercambio</h3>

      {loading ? (
        <div className={styles.loading}>Cargando...</div>
      ) : cartas.length === 0 ? (
        <div className={styles.empty}>No hay cartas disponibles.</div>
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
