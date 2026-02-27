import { useEffect, useState } from "react";
import {
  getDisponiblesByUsername,
  getNoDisponiblesByUsername,
  deleteCartaFisica,
  createCartaFisica,
  updateCartaFisica
} from "../../services/cartasFisicas";
import { getCurrentUser } from "../../utils/token";
import MiCarta from "../../components/MiCarta/MiCarta.jsx";
import CartaModal from "../../components/CartaModal/CartaModal.jsx";

const MisCartas = () => {
  const [cartas, setCartas] = useState([]);
  const [filtro, setFiltro] = useState("disponibles");

  const [showModal, setShowModal] = useState(false);
  const [editingCarta, setEditingCarta] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const user = getCurrentUser();

  const fetchCartas = async () => {
    if (!user) return;

    const [disp, noDisp] = await Promise.all([
      getDisponiblesByUsername(user.username),
      getNoDisponiblesByUsername(user.username)
    ]);

    const disponibles = disp.data.map(c => ({ ...c, disponible: true }));
    const noDisponibles = noDisp.data.map(c => ({ ...c, disponible: false }));

    setCartas([...disponibles, ...noDisponibles]);
  };

  useEffect(() => {
    fetchCartas();
  }, []);

  const handleDelete = async () => {
    await deleteCartaFisica(deleteTarget.id);
    setDeleteTarget(null);
    fetchCartas();
  };

  const handleSave = async (data) => {
    if (editingCarta) {
      await updateCartaFisica(editingCarta.id, data);
    } else {
      await createCartaFisica(data);
    }

    setShowModal(false);
    setEditingCarta(null);
    fetchCartas();
  };

  const filteredCartas = cartas.filter(c => {
    if (filtro === "disponibles") return c.disponible;
    if (filtro === "no") return !c.disponible;
    return true;
  });

  return (
    <div>
      <h2>Mis Cartas</h2>

      {/* Tabs */}
      <div>
        <button onClick={() => setFiltro("todas")}>Todas</button>
        <button onClick={() => setFiltro("disponibles")}>Disponibles</button>
        <button onClick={() => setFiltro("no")}>No disponibles</button>
      </div>

      {/* Cartas */}
      <div>
        {filteredCartas.map(carta => (
          <MiCarta
            key={carta.id}
            carta={carta}
            onEdit={(c) => {
              setEditingCarta(c);
              setShowModal(true);
            }}
            onDelete={(c) => setDeleteTarget(c)}
          />
        ))}
      </div>

      {/* Botón crear */}
      <button
        onClick={() => {
          setEditingCarta(null);
          setShowModal(true);
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px"
        }}
      >
        + Subir nueva carta
      </button>

      {/* Modal crear/editar */}
      <CartaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialData={editingCarta}
      />

      {/* Modal eliminar */}
      {deleteTarget && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>¿Seguro que quieres eliminar esta carta?</h3>

            <div className="modalActions">
              <button onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
              <button onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCartas;