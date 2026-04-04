import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDisponiblesByUsername } from "../../services/cartasFisicas";
import { getCurrentUser } from "../../utils/token";
import CartaUnificada from "../../components/CartaUnificada/CartaUnificada";
import Notification from "../../components/Notification/Notification";
import 'bootstrap/dist/css/bootstrap.min.css';
import './UsuarioCartas.module.css';

const UsuarioCartas = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [cartas, setCartas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();

    // Si el username de la URL coincide con el usuario logueado, redirige
    if (currentUser?.username === username) {
      navigate(`/cartas/${username}`);
      return; // evita continuar con la carga de cartas
    }
    const load = async () => {
      setLoading(true);
      try {
        const res = await getDisponiblesByUsername(username);
        const data = res.data || [];
        if (data.length === 0) throw { response: { data: { mensaje: "Usuario no válido o sin cartas" } } };
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
    <div className="container py-4 usuario-cartas-container">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="mb-4 text-center">
        Cartas disponibles para intercambio de: {username}
      </h1>

      {loading ? (

        <div className="py-5 text-center">
          <div className="spinner-border mb-3" role="status" />
          <div>Cargando...</div>
        </div>

      ) : (
        <>
          {cartas.length === 0 ? (
            <p className="empty text-center w-100">No se encontraron cartas.</p>
          ) : (
            <div className="row g-3">
              {cartas.map((c) => (
                <div
                  key={c.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center"
                >
                  <CartaUnificada
                    carta={c}
                    isSelectable={true}
                    onClick={() => navigate(`/proponer-intercambio/${c.id}`)}
                    actions={[
                      {
                        label: "Proponer intercambio",
                        variant: "primary",
                        onClick: () => navigate(`/proponer-intercambio/${c.id}`),
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsuarioCartas;