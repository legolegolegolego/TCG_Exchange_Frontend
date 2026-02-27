import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./CardDetail.module.css";
import { getCartaModeloById, getUsuariosConCartaModelo } from "../../services/cartasModelo";
import Notification from "../../components/Notification/Notification";

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
        <div className={styles.imageWrap}>
          {imagenUrl ? <img src={imagenUrl} alt={nombre} /> : <div className={styles.noImage}>No image</div>}
        </div>
        <div className={styles.info}>
          <h2 className={styles.name}>{nombre}</h2>
          <div className={styles.row}><strong>Tipo Pokémon:</strong> {tipoPokemon || '-'}</div>
          <div className={styles.row}><strong>Número:</strong> #{numero ?? '-'}</div>
          <div className={styles.row}><strong>Tipo carta:</strong> {tipoCarta || '-'}</div>
          <div className={styles.row}><strong>Rareza:</strong> {rareza || '-'}</div>
          <div className={styles.row}><strong>Evolución:</strong> {evolucion || '-'}</div>
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
                  <Link to={`/usuario/${uname}`} state={{ from: location.pathname, fromLabel: 'vista de carta modelo' }}>
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