import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "./CardDetail.module.css";
import { getCartaModeloById, getUsuariosConCartaModelo } from "../../services/cartasModelo";
import Notification from "../../components/Notification/Notification";
import Button from "../../components/Button/Button";
import { getCurrentUser } from "../../utils/token";
import EditarCrearCartaModelo from "../../components/EditarCrearCartaModelo/EditarCrearCartaModelo";
import { deleteCartaModelo } from "../../services/cartasModelo";

const tipoColores = {
  PLANTA: "#2ecc71",
  FUEGO: "#e74c3c",
  AGUA: "#3498db",
  ELECTRICO: "#f1c40f",
  PSIQUICO: "#8e44ad",
  LUCHA: "#d35400",
  INCOLORO: "#bdc3c7",
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
  const [showModal, setShowModal] = useState(false);
  const [editingCarta, setEditingCarta] = useState(null);
  const user = getCurrentUser();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCartaModelo(carta.id);

      navigate("/", {
        state: {
          notification: {
            type: "success",
            message: "Carta eliminada correctamente"
          }
        }
      });
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al eliminar";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

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

  // Filtrar usuarios para no mostrar al actual (si hay sesión)
  const usuariosFiltrados = user
    ? usuarios.filter(u => u.username !== user.username)
    : usuarios;

  return (
    <div className={styles.container}> {/* Contenedor principal */}

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={styles.layout}> {/* Layout: izquierda + derecha */}

        {/* IZQUIERDA */}
        <div className={styles.left}>
          <div className={styles.top}>
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

          {isAdmin && (
            <div className={styles.adminActions}>
              <Button
                variant="outline-primary"
                size="md"
                onClick={() => {
                  setEditingCarta(carta);
                  setShowModal(true);
                }}
              >
                Editar
              </Button>

              <Button
                variant="outline-danger"
                onClick={() => {
                  setDeleteError(null);
                  setShowDeleteModal(true);
                }}
              >
                Eliminar
              </Button>
            </div>
          )}
        </div> {/* FIN left */}

        {/* DERECHA */}
        <div className={styles.right}>
          <div className={styles.usersSection}>
            <h3>Usuarios que tienen la carta</h3>

            {usuariosFiltrados.length === 0 ? (
              <div className={styles.noUsers}>Nadie tiene esta carta.</div>
            ) : (
              <ul className={styles.userList}>
                {usuariosFiltrados
                  .map((u) => {
                    const uname = u.username
                    return (
                      <li key={u.id} className={styles.userItem}>
                        <div className={styles.userName}>{uname}</div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/usuario/${uname}`, {
                            state: { from: location.pathname, fromLabel: 'vista de carta modelo' }
                          })}
                        >
                          Ver cartas
                        </Button>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div> {/* FIN right */}

      </div> {/* FIN layout */}

      {/* Modal de editar/crear carta */}
      <EditarCrearCartaModelo
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={(data) => {
          setShowModal(false);
          setCarta(prev => ({ ...prev, ...data }));
          setNotification({ type: "success", message: "Carta editada correctamente" });
          setEditingCarta(null);
        }}
        onError={(err) => {
          setNotification({ type: "error", message: err.message });
        }}
        initialData={editingCarta}
      />

      {/* Modal de eliminar carta */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h5>¿Eliminar carta?</h5>
            <p>No se podrá recuperar.</p>

            {deleteError && <p className={styles.error}>{deleteError}</p>}

            <div className={styles.modalActions}>
              <Button
                variant="cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>

              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div> /* FIN container */
  );
}

export default CardDetail;