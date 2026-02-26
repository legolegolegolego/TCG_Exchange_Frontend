import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import styles from "./CardDetail.module.css";
import { getCartaModeloById, getUsuariosConCartaModelo } from "../../services/cartasModelo";

const CardDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [carta, setCarta] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resCarta = await getCartaModeloById(id);
        setCarta(resCarta.data || resCarta);
        const resUsers = await getUsuariosConCartaModelo(id);
        setUsuarios(resUsers.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  if (loading) return <div className={styles.container}>Cargando...</div>;

  if (!carta) return <div className={styles.container}>Carta no encontrada</div>;

  const { nombre, numero, rareza, tipoPokemon, tipoCarta, evolucion, imagenUrl } = carta;

  return (
    <div className={styles.container}>
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
            {usuarios.map((u) => (
              <li key={u.id} className={styles.userItem}>
                <div className={styles.userName}>{u.username || u.nombre || u.email || `Usuario ${u.id}`}</div>
                {(() => {
                  const uname = u.username || u.nombre || u.email || u.id;
                  return (
                    <Link to={`/usuario/${uname}`} state={{ from: location.pathname, fromLabel: 'vista de carta modelo' }}>
                      <button className={styles.userButton}>Ver cartas</button>
                    </Link>
                  );
                })()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CardDetail;
