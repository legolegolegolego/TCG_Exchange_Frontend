import { useEffect, useState } from "react";
import styles from "./EditarCrearCartaFisica.module.css";
import { getCartasModelo } from "../../services/cartasModelo";

const EditarCrearCartaFisica = ({ isOpen, onClose, onSave, initialData }) => {
  const [modelos, setModelos] = useState([]);
  const [form, setForm] = useState({
    idCartaModelo: "",
    estadoCarta: "EXCELENTE",
    imagenUrl: ""
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchModelos = async () => {
      const res = await getCartasModelo({ sort: "numero,asc" });
      setModelos(res.data.content || res.data);
    };

    fetchModelos();

    if (initialData) {
      setForm({
        idCartaModelo: initialData.idCartaModelo,
        estadoCarta: initialData.estadoCarta,
        imagenUrl: initialData.imagenUrl || ""
      });
    } else {
      setForm({
        idCartaModelo: "",
        estadoCarta: "EXCELENTE",
        imagenUrl: ""
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>{initialData ? "Editar Carta" : "Nueva Carta"}</h3>
        <p>Modifica la información de tu carta física.</p>

        {/* Selector modelo */}
        <select
          value={form.idCartaModelo}
          onChange={(e) =>
            setForm({ ...form, idCartaModelo: e.target.value })
          }
        >
          <option value="">Selecciona carta</option>
          {modelos.map((m) => (
            <option key={m.id} value={m.id}>
              #{m.numero} - {m.nombre}
            </option>
          ))}
        </select>

        {/* Estado */}
        <select
          value={form.estadoCarta}
          onChange={(e) =>
            setForm({ ...form, estadoCarta: e.target.value })
          }
        >
          <option value="EXCELENTE">EXCELENTE</option>
          <option value="ACEPTABLE">ACEPTABLE</option>
        </select>

        {/* Imagen */}
        <input
          type="text"
          placeholder="URL imagen"
          value={form.imagenUrl}
          onChange={(e) =>
            setForm({ ...form, imagenUrl: e.target.value })
          }
        />

        <div className={styles.modalActions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className={styles.confirmDeleteButton}
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarCrearCartaFisica;