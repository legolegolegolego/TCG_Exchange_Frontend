import { useEffect, useState } from "react";
import { getDisponiblesByUsername, getNoDisponiblesByUsername, deleteCartaFisica, createCartaFisica, updateCartaFisica } from "../../services/cartasFisicas";
import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";

import MiCarta from "../../components/MiCarta/MiCarta";
import EditarCrearCartaFisica from "../../components/EditarCrearCartaFisica/EditarCrearCartaFisica";
import Notification from "../../components/Notification/Notification";
import Button from "../../components/Button/Button";

import styles from "./MisCartas.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from "react-router-dom";

const modeloCache = {};

const fetchCartaCompleta = async (cf) => {
  let cm;

  if (modeloCache[cf.idCartaModelo]) {
    cm = modeloCache[cf.idCartaModelo];
  } else {
    const cmRes = await api.get(`/cartas-modelo/${cf.idCartaModelo}`);
    cm = cmRes.data;
    modeloCache[cf.idCartaModelo] = cm;
  }

  return {
    ...cf,
    nombre: cm?.nombre || "Desconocido",
    numero: cm?.numero || "?",
    imagenUrl: cf?.imagenUrl || cm?.imagenUrl || "/placeholder.png"
  };
};

const MisCartas = () => {
  const [cartas, setCartas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [showModal, setShowModal] = useState(false);
  const [editingCarta, setEditingCarta] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();


  const user = getCurrentUser();
  const { username } = useParams();
  const isAdmin = user?.roles?.includes("ROLE_ADMIN")

  const fetchCartas = async () => {
    if (!user) return;
    if (user.username !== username && !isAdmin) return;
    try {
      const [disp, noDisp] = await Promise.all([
        getDisponiblesByUsername(username),
        getNoDisponiblesByUsername(username)
      ]);

      const disponibles = disp.data.map(c => ({ ...c, disponible: true }));
      const noDisponibles = noDisp.data.map(c => ({ ...c, disponible: false }));
      const todas = [...disponibles, ...noDisponibles];
      const completas = await Promise.all(todas.map(c => fetchCartaCompleta(c)));
      const finales = completas.map((c, i) => ({ ...c, disponible: todas[i].disponible }));

      setCartas(finales);
    } catch (err) {
      const msg = err.response?.data?.mensaje || "No se pudieron cargar tus cartas. Intenta de nuevo.";
      setNotification({ type: "error", message: msg });
      console.error(err);
    }
  };

  useEffect(() => { fetchCartas(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingCarta) {
        await updateCartaFisica(editingCarta.id, data);
        setNotification({ type: "success", message: "Carta editada correctamente" });
      } else {
        await createCartaFisica(data);
        setNotification({ type: "success", message: "Carta creada correctamente" });
      }
      setShowModal(false);
      setEditingCarta(null);
      fetchCartas();
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al guardar la carta";

      setNotification({ type: "error", message: msg });

      if (msg.includes("Debes registrar una dirección antes de crear cartas para intercambio")) {
        sessionStorage.setItem("notification", JSON.stringify({
          type: "error",
          message: msg
        }));
        navigate("/editar-perfil", { state: { tab: "direccion" } });
        return;
      }
      console.error(err);
    }

  };

  const handleDelete = async () => {
    try {
      await deleteCartaFisica(deleteTarget.id);
      setNotification({ type: "success", message: "Carta eliminada correctamente" });
      setDeleteTarget(null);
      fetchCartas();
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al eliminar la carta";
      setNotification({ type: "error", message: msg });
      console.error(err);
    }
  };

  const filteredCartas = cartas.filter(c => {
    if (filtro === "disponibles") return c.disponible;
    if (filtro === "no") return !c.disponible;
    return true;
  });

  return (
    <div className="container py-4">
      
      {isAdmin ? (
        <h2 className="mb-3 text-center">Cartas de {username}</h2>
      ) : (
        <h2 className="mb-3 text-center">Mis cartas</h2>
      )}

      {/* TABS con Button */}
      <div className="d-flex gap-2 mb-3 flex-wrap justify-content-center">
        <Button
          variant={filtro === "todas" ? "primary" : "outline-primary"}
          onClick={() => setFiltro("todas")}
        >
          TODAS
        </Button>
        <Button
          variant={filtro === "disponibles" ? "primary" : "outline-primary"}
          onClick={() => setFiltro("disponibles")}
        >
          DISPONIBLES
        </Button>
        <Button
          variant={filtro === "no" ? "primary" : "outline-primary"}
          onClick={() => setFiltro("no")}
        >
          NO DISPONIBLES
        </Button>
      </div>

      {/* CARTAS GRID */}
      <div className="row g-3">
        {filteredCartas.map(carta => (
          <div key={carta.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <MiCarta
              carta={carta}
              isAdmin={isAdmin}
              onEdit={(c) => { setEditingCarta(c); setShowModal(true); }}
              onDelete={(c) => setDeleteTarget(c)}
            />
          </div>
        ))}
      </div>

      {/* BOTÓN CREAR */}
      {!isAdmin && (
        <Button
          className={`position-fixed ${styles.addButton}`}
          size="lg"
          onClick={() => {
            setEditingCarta(null);
            setShowModal(true);
          }}
        >
          + Subir nueva carta
        </Button>
      )}

      {/* MODAL CREAR/EDITAR */}
      <EditarCrearCartaFisica
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingCarta}
      />

      {/* MODAL ELIMINAR */}
      {deleteTarget && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h5>¿Seguro que quieres eliminar esta carta?</h5>
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="cancel" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION */}
      {notification && (
        <Notification type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
      )}
    </div>
  );
};

export default MisCartas;