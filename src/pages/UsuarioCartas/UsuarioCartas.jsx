import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDisponiblesByUsername } from "../../services/cartasFisicas";
import CardFisica from "../../components/CardFisica/CardFisica";
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
    const load = async () => {
      if (!username) {
        navigate("/");
        return;
      }
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
    <div className="container usuario-cartas-container">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <h2 className="username text-center text-md-start">{username}</h2>
      <h3 className="sectionTitle text-center text-md-start">Cartas disponibles para intercambio</h3>

      {loading ? (
        <div className="loading text-center">Cargando...</div>
      ) : (
        <>
          {cartas.length === 0 ? (
            <p className="empty text-center w-100">No se encontraron cartas.</p>
          ) : (
            <div className="row g-3">
              {cartas.map((c) => (
                <div key={c.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                  <CardFisica carta={c} />
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