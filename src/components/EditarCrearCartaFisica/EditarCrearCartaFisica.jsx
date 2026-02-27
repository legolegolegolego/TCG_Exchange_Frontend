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

    const fetchAllModelos = async () => {
      let allModelos = [];
      let page = 0;
      let totalPages = 1;

      // Recorrer todas las páginas
      do {
        const res = await getCartasModelo({ sort: "numero,asc", page, size: 50 });
        const data = res.data;
        allModelos = allModelos.concat(data.content || data);
        totalPages = data.totalPages || 1;
        page++;
      } while (page < totalPages);

      setModelos(allModelos);
    };

    fetchAllModelos();

    // Inicializar formulario
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
    <div className={`${styles.modalOverlay} modal fade show d-block`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-3 p-md-4">
          <div className="modal-header">
            <h5 className="modal-title">{initialData ? "Editar Carta" : "Nueva Carta"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Modifica la información de tu carta física.</p>

            {/* Selector modelo */}
            <div className="mb-3">
              <label className="form-label">Modelo de Carta</label>
              <select
                className="form-select"
                value={form.idCartaModelo}
                onChange={(e) => setForm({ ...form, idCartaModelo: e.target.value })}
              >
                <option value="">Selecciona carta</option>
                {modelos.map((m) => (
                  <option key={m.id} value={m.id}>
                    #{m.numero} - {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div className="mb-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={form.estadoCarta}
                onChange={(e) => setForm({ ...form, estadoCarta: e.target.value })}
              >
                <option value="EXCELENTE">EXCELENTE</option>
                <option value="ACEPTABLE">ACEPTABLE</option>
              </select>
            </div>

            {/* Imagen */}
            <div className="mb-3">
              <label className="form-label">URL Imagen</label>
              <input
                type="text"
                className="form-control"
                placeholder="URL imagen"
                value={form.imagenUrl}
                onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className={`btn btn-danger ${styles.cancelButton}`} onClick={onClose}>
              Cancelar
            </button>
            <button className={`btn btn-secondary ${styles.confirmDeleteButton}`} onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarCrearCartaFisica;