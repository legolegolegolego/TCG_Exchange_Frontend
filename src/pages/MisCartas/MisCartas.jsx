import { useEffect, useState } from "react"; 
import styles from "./MisCartas.module.css";

import {
  getDisponiblesByUsername,
  getNoDisponiblesByUsername,
  deleteCartaFisica,
  createCartaFisica,
  updateCartaFisica
} from "../../services/cartasFisicas";

import { getCurrentUser } from "../../utils/token";
import api from "../../services/api";

import MiCarta from "../../components/MiCarta/MiCarta";
import EditarCrearCartaFisica from "../../components/EditarCrearCartaFisica/EditarCrearCartaFisica";
import Notification from "../../components/Notification/Notification";

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
  const [filtro, setFiltro] = useState("disponibles");

  const [showModal, setShowModal] = useState(false);
  const [editingCarta, setEditingCarta] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [notification, setNotification] = useState(null);

  const user = getCurrentUser();

  const fetchCartas = async () => {
    if (!user) return;

    try {
      const [disp, noDisp] = await Promise.all([
        getDisponiblesByUsername(user.username),
        getNoDisponiblesByUsername(user.username)
      ]);

      const disponibles = disp.data.map(c => ({ ...c, disponible: true }));
      const noDisponibles = noDisp.data.map(c => ({ ...c, disponible: false }));

      const todas = [...disponibles, ...noDisponibles];

      const completas = await Promise.all(todas.map(c => fetchCartaCompleta(c)));

      const finales = completas.map((c, i) => ({
        ...c,
        disponible: todas[i].disponible
      }));

      setCartas(finales);
    } catch (err) {
      const msg = err.response?.data?.mensaje || "No se pudieron cargar tus cartas. Intenta de nuevo.";
      setNotification({ type: "error", message: msg });
      console.error("Error cargando cartas:", err);
    }
  };

  useEffect(() => {
    fetchCartas();
  }, []);

  const handleSave = async (data) => {
    try {
      if (editingCarta) {
        await updateCartaFisica(editingCarta.id, data);
        setNotification({ type: "success", message: "Carta editada correctamente" });
      } else {
        await createCartaFisica(data);
        setNotification({ type: "success", message: "Carta creada correctamente" });
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje || "Error al guardar la carta";
      setNotification({ type: "error", message: msg });
      console.error("Error guardando carta:", err);
    }

    setShowModal(false);
    setEditingCarta(null);
    fetchCartas();
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
      console.error("Error eliminando carta:", err);
    }
  };

  const filteredCartas = cartas.filter(c => {
    if (filtro === "disponibles") return c.disponible;
    if (filtro === "no") return !c.disponible;
    return true;
  });

  return (
    <div className={styles.container}>
      <h2>Mis Cartas</h2>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          className={filtro === "disponibles" ? styles.activeTab : ""}
          onClick={() => setFiltro("disponibles")}
        >
          Disponibles
        </button>

        <button
          className={filtro === "todas" ? styles.activeTab : ""}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>

        <button
          className={filtro === "no" ? styles.activeTab : ""}
          onClick={() => setFiltro("no")}
        >
          No disponibles
        </button>
      </div>

      {/* CARTAS */}
      <div className={styles.grid}>
        {filteredCartas.map(carta => (
          <MiCarta
            key={carta.id}
            carta={carta}
            onEdit={(c) => { setEditingCarta(c); setShowModal(true); }}
            onDelete={(c) => setDeleteTarget(c)}
          />
        ))}
      </div>

      {/* BOTÓN CREAR */}
      <button
        className={styles.addButton}
        onClick={() => { setEditingCarta(null); setShowModal(true); }}
      >
        + Subir nueva carta
      </button>

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
            <h3>¿Seguro que quieres eliminar esta carta?</h3>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>

              <button
                className={styles.confirmDeleteButton}
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default MisCartas;